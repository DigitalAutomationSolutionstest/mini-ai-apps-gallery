// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// @deno-types="https://deno.land/x/types/deno.ns.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "npm:openai";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { ENV } from "../_shared/env.ts";
import { handleCors as utilsHandleCors, checkRateLimit, validateInput, handleError, initSupabase } from '../_shared/utils.ts';
import { z } from 'npm:zod@3.22.4';
import { logFunctionCall, logSuccess, logError } from '../_shared/logger.ts';

console.log("Hello from Functions!")

// Schema specifico per la funzione PDF
const pdfRequestSchema = z.object({
  userId: z.string().uuid(),
  apiKey: z.string().min(1),
  fileUrl: z.string().url(),
  prompt: z.string().min(1).max(1000),
});

serve(async (req) => {
  const startTime = Date.now();
  let logEntry;

  try {
    // Gestione CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResponse = await checkRateLimit(ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Validazione input
    const body = await req.json();
    const { userId, apiKey, fileUrl, prompt } = validateInput(pdfRequestSchema, body);

    // Log iniziale
    logEntry = logFunctionCall('pdf', userId, {
      fileUrl: fileUrl.substring(0, 50) + '...', // Log parziale dell'URL per privacy
      promptLength: prompt.length,
    });

    // Inizializza Supabase
    const supabase = initSupabase();

    // Verifica crediti utente
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (creditsError || !credits || credits.credits < 1) {
      const error = new Error('Insufficient credits');
      logError(logEntry, error);
      return new Response(JSON.stringify({
        error: 'Insufficient credits',
      }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Implementa la logica di elaborazione PDF qui
    // Per ora restituiamo una risposta di esempio
    const duration = Date.now() - startTime;
    logSuccess(logEntry, duration);

    return new Response(JSON.stringify({
      success: true,
      message: 'PDF processed successfully',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    if (logEntry) {
      logError(logEntry, error);
    }
    return handleError(error);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/pdf' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
