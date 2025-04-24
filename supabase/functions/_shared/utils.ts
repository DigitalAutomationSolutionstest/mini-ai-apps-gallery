import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from '@supabase/supabase-js';
import { z } from 'npm:zod@3.22.4';
import { Ratelimit } from 'npm:@upstash/ratelimit@2.0.0';
import { Redis } from 'npm:@upstash/redis@1.28.3';

// Configurazione Redis per rate limiting
const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_REST_URL') || '',
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || '',
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});

// Configurazione CORS
const ALLOWED_ORIGIN = 'https://www.miniaiapps.tech';
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Funzione helper per gestire CORS
export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

// Funzione helper per rate limiting
export async function checkRateLimit(ip: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response(JSON.stringify({
      error: 'Too many requests',
      limit,
      reset,
      remaining,
    }), {
      status: 429,
      headers: {
        ...corsHeaders,
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }
  
  return null;
}

// Schema di base per validazione input
export const baseRequestSchema = z.object({
  userId: z.string().uuid(),
  apiKey: z.string().min(1),
});

// Funzione helper per validazione input
export function validateInput<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Response(JSON.stringify({
        error: 'Invalid input',
        details: error.errors,
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    throw error;
  }
}

// Funzione helper per gestire errori
export function handleError(error: unknown) {
  console.error('Error:', error);
  
  if (error instanceof Response) {
    return error;
  }
  
  return new Response(JSON.stringify({
    error: 'Internal server error',
    message: error instanceof Error ? error.message : 'Unknown error',
  }), {
    status: 500,
    headers: corsHeaders,
  });
}

// Funzione helper per inizializzare Supabase
export function initSupabase() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
} 