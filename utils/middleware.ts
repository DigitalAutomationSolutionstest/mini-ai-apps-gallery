import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Middleware CORS
export const allowCors = (handler: Function) => async (req: NextRequest) => {
  const res = await handler(req.clone());
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};

// Middleware Rate Limit
export const withRateLimit = (handler: Function) => async (req: NextRequest) => {
  // In ambiente di test, non applichiamo il rate limiting
  if (process.env.NODE_ENV === 'test') {
    return handler(req.clone());
  }

  const ip = req.ip || "127.0.0.1";
  const key = `rate-limit:${ip}`;
  const limit = 10;
  const window = 60; // 1 minuto

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });

    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= limit) {
      return NextResponse.json(
        { error: "Troppe richieste" },
        { status: 429 }
      );
    }

    await redis.set(key, (count + 1).toString(), "EX", window);
    return handler(req.clone());
  } catch (error) {
    console.error("Errore nel rate limiting:", error);
    return handler(req.clone());
  }
};

// Middleware Validazione
export const withValidation = (schema: z.ZodSchema, handler: Function) => async (req: NextRequest) => {
  try {
    const body = await req.clone().json();
    schema.parse(body);
    return handler(req.clone());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dati non validi", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
};

// Middleware Logging
export const withLogging = (handler: Function) => async (req: NextRequest) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  try {
    const res = await handler(req.clone());
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.status} (${duration}ms)`);
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ERROR (${duration}ms)`, error);
    throw error;
  }
};

// Esempio di uso in api/pdf.ts:
/*
import { allowCors, withRateLimit, withValidation, withLogging } from "@/utils/middleware";
import { z } from "zod";

const schema = z.object({ 
  fileUrl: z.string().url(),
  userId: z.string().uuid(),
  apiKey: z.string().min(1),
  prompt: z.string().min(1).max(1000),
});

export const POST = allowCors(
  withRateLimit(
    withValidation(
      schema,
      withLogging(async (req) => {
        const { fileUrl, userId, apiKey, prompt } = await req.json();
        // ...analisi PDF
        return NextResponse.json({ success: true });
      })
    )
  )
);
*/ 