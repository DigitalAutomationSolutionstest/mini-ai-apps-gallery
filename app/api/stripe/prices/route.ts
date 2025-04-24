import { stripe } from "@/src/lib/stripe";
import { Stripe } from "stripe";

export async function GET() {
  try {
    const products = await stripe.products.list({ active: true });
    const prices = await stripe.prices.list({ active: true });

    const enriched = prices.data.map((price: Stripe.Price) => {
      const product = products.data.find((p: Stripe.Product) => p.id === price.product);
      return {
        id: price.id,
        nickname: product?.name || "Piano",
        price: price.unit_amount! / 100,
        interval: price.recurring?.interval,
      };
    });

    return new Response(JSON.stringify(enriched), { status: 200 });
  } catch (err) {
    console.error("[STRIPE_PRICES_ERROR]", err);
    return new Response(JSON.stringify({ error: "Errore Stripe" }), { status: 500 });
  }
}
