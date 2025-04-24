import { NextRequest, NextResponse } from "next/server";
import { allowCors, withRateLimit, withValidation, withLogging } from "@/utils/middleware";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  fileUrl: z.string().url(),
  userId: z.string().uuid(),
  apiKey: z.string().min(1),
  prompt: z.string().optional(),
});

async function handler(req: NextRequest) {
  const { fileUrl, userId, apiKey, prompt } = await req.json();

  // Verifica crediti utente
  const { data: credits, error: creditsError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (creditsError || !credits || credits.credits < 1) {
    return NextResponse.json(
      { error: "Crediti insufficienti" },
      { status: 402 }
    );
  }

  try {
    // Scarica il PDF
    const response = await fetch(fileUrl);
    const pdfBuffer = await response.arrayBuffer();

    // Analizza il PDF con OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Sei un assistente che analizza documenti PDF."
        },
        {
          role: "user",
          content: `Analizza questo PDF e ${prompt || 'fornisci un riassunto dettagliato'}`
        }
      ],
      max_tokens: 1000,
    });

    // Deduci un credito
    await supabase
      .from("user_credits")
      .update({ credits: credits.credits - 1 })
      .eq("user_id", userId);

    return NextResponse.json({
      success: true,
      analysis: completion.choices[0].message.content,
      creditsRemaining: credits.credits - 1
    });

  } catch (error) {
    console.error("Errore analisi PDF:", error);
    return NextResponse.json(
      { error: "Errore nell'analisi del PDF" },
      { status: 500 }
    );
  }
}

export const POST = allowCors(
  withRateLimit(
    withValidation(
      schema,
      withLogging(handler)
    )
  )
); 