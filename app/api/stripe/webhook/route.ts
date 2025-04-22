import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Firma Stripe mancante" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Gestisci l'evento
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const priceId = session.metadata?.priceId;

      if (userId && priceId) {
        // Aggiorna i crediti dell'utente in base al piano
        const price = await stripe.prices.retrieve(priceId);
        const creditsToAdd = price.metadata.credits ? parseInt(price.metadata.credits) : 10;

        // Aggiorna i crediti dell'utente
        const { data: userCredits } = await supabase
          .from("user_credits")
          .select("credits")
          .eq("user_id", userId)
          .single();

        const currentCredits = userCredits?.credits || 0;
        const newCredits = currentCredits + creditsToAdd;

        await supabase
          .from("user_credits")
          .upsert({
            user_id: userId,
            credits: newCredits,
            updated_at: new Date().toISOString(),
          });

        // Registra la transazione
        await supabase.from("transactions").insert({
          user_id: userId,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency,
          status: "completed",
          price_id: priceId,
          credits_added: creditsToAdd,
          created_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Errore nel webhook:", error);
    return NextResponse.json(
      { error: "Errore nel webhook" },
      { status: 400 }
    );
  }
} 