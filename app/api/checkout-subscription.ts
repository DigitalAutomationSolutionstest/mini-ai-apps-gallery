import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID è richiesto" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://mini-ai-hub.bolt.new/success",
      cancel_url: "https://mini-ai-hub.bolt.new/cancel",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Errore nella creazione della sessione checkout:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della sessione checkout" },
      { status: 500 }
    );
  }
} 