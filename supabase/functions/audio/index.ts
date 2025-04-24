// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// @deno-types="https://deno.land/x/types/deno.ns.d.ts"

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { OpenAI } from "npm:openai@4.28.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { ENV } from "../_shared/env.ts";

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { audioUrl } = await req.json();
    const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });

    const audioRes = await fetch(audioUrl);
    const buffer = await audioRes.arrayBuffer();
    const audioBlob = new Blob([new Uint8Array(buffer)]);

    // Utilizziamo l'API di OpenAI per la trascrizione
    const formData = new FormData();
    formData.append("file", new File([audioBlob], "audio.mp3"));
    formData.append("model", "whisper-1");

    const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const transcriptionData = await transcriptionResponse.json();
    const transcriptionText = transcriptionData.text;

    const summary = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: `Riassumi questo testo:\n${transcriptionText}` },
      ],
    });

    return new Response(
      JSON.stringify({ transcript: transcriptionText, summary: summary.choices[0].message.content }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audio' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
