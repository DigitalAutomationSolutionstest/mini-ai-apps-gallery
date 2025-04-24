import { stripe } from "@/src/lib/stripe";

export async function POST(req: Request) {
  const { priceId, successUrl, cancelUrl } = await req.json();
  
  console.log("[CHECKOUT DEBUG]", { priceId, successUrl, cancelUrl });
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("[STRIPE CHECKOUT ERROR]", error);
    return new Response(JSON.stringify({ error: "Errore Stripe", details: error }), { status: 500 });
  }
} 