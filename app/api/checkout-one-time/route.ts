import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "PriceId e userId sono richiesti" },
        { status: 400 }
      );
    }

    // Verifica che il prezzo esista
    const price = await stripe.prices.retrieve(priceId);
    if (!price) {
      return NextResponse.json(
        { error: "Prezzo non trovato" },
        { status: 404 }
      );
    }

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Pagamento annullato`,
      metadata: {
        user_id: userId,
        price_id: priceId,
        type: "one_time"
      },
    });

    // Registra il tentativo di checkout
    await supabase.from("checkout_sessions").insert({
      user_id: userId,
      session_id: session.id,
      price_id: priceId,
      amount: price.unit_amount,
      currency: price.currency,
      status: "pending",
      type: "one_time",
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Errore creazione sessione:", err);
    return NextResponse.json(
      { error: err.message || "Errore creazione sessione" },
      { status: 500 }
    );
  }
} 