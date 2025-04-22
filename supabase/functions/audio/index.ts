// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "npm:openai";

console.log("Hello from Functions!")

serve(async (req) => {
  const { audioUrl } = await req.json();
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  const audioRes = await fetch(audioUrl);
  const buffer = await audioRes.arrayBuffer();
  const audioBlob = new Blob([new Uint8Array(buffer)]);

  const transcription = await openai.audio.transcriptions.create({
    file: new File([audioBlob], "audio.mp3"),
    model: "whisper-1",
  });

  const summary = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: `Riassumi questo testo:\n${transcription.text}` },
    ],
  });

  return new Response(
    JSON.stringify({ transcript: transcription.text, summary: summary.choices[0].message.content }),
    { headers: { "Content-Type": "application/json" } }
  );
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/audio' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
