// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";
import { ENV } from "../_shared/env.ts";

console.log("Hello from Functions!")

serve(async (req) => {
  const { name, email, message, budget } = await req.json();

  const supabase = createClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_SERVICE_ROLE_KEY
  );

  await supabase.from("quotes").insert({
    name,
    email,
    message,
    budget,
  });

  const resend = new Resend(ENV.RESEND_API_KEY);

  await resend.emails.send({
    from: "MiniAI <noreply@miniaiapps.tech>",
    to: [email, "info@miniaiapps.tech"],
    subject: "Richiesta preventivo MiniAI",
    html: `
      <h1>Grazie per il tuo interesse in MiniAI!</h1>
      <p>Abbiamo ricevuto la tua richiesta di preventivo e ti risponderemo il prima possibile.</p>
      <p>Dettagli della richiesta:</p>
      <ul>
        <li>Nome: ${name}</li>
        <li>Email: ${email}</li>
        <li>Budget: ${budget}</li>
        <li>Messaggio: ${message}</li>
      </ul>
    `,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-quote' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
