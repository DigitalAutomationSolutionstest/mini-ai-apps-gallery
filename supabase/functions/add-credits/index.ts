// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Hello from Functions!")

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { user } = await supabase.auth.getUser(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const amount = body.amount ?? 5;

  let { data: userData } = await supabase
    .from("stripe_user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  // Se l'utente non ha un customer_id, ne creiamo uno nuovo
  if (!userData?.stripe_customer_id) {
    // Crea un nuovo cliente Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: user.id,
      },
    });

    // Salva il customer_id nel database
    const { error } = await supabase
      .from("stripe_user_subscriptions")
      .upsert({
        user_id: user.id,
        stripe_customer_id: customer.id,
      });

    if (error) {
      console.error("Error saving customer:", error);
      return new Response("Error creating customer", { status: 500 });
    }

    userData = { stripe_customer_id: customer.id };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: userData.stripe_customer_id,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Ricarica Crediti Mini AI Hub`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: Deno.env.get("SITE_URL") + "/dashboard?success=1",
    cancel_url: Deno.env.get("SITE_URL") + "/dashboard?canceled=1",
    metadata: {
      user_id: user.id,
      credits: amount * 10, // es. ogni 1€ = 10 crediti
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-credits' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
