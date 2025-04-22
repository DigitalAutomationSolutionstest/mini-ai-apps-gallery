import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function GET() {
  try {
    // Recupera tutti i prodotti attivi
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Formatta i prodotti per il frontend
    const formattedProducts = products.data.map(product => {
      const defaultPrice = product.default_price as Stripe.Price;
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: defaultPrice ? {
          id: defaultPrice.id,
          amount: defaultPrice.unit_amount,
          currency: defaultPrice.currency,
          interval: defaultPrice.recurring?.interval,
          interval_count: defaultPrice.recurring?.interval_count
        } : null,
        metadata: product.metadata,
        images: product.images,
        category: product.metadata.category || 'general'
      };
    });

    // Raggruppa per categoria
    const productsByCategory = formattedProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, typeof formattedProducts>);

    return NextResponse.json({
      products: formattedProducts,
      categories: productsByCategory
    });
  } catch (err) {
    console.error("Errore recupero prodotti:", err);
    return NextResponse.json(
      { error: "Errore durante il recupero dei prodotti" },
      { status: 500 }
    );
  }
} 