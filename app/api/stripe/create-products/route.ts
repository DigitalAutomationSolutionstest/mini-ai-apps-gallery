import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST() {
  try {
    // Array di prodotti da creare
    const products = [
      {
        name: 'Start',
        description: 'Piano base per utenti singoli',
        price: 900, // 9€ in centesimi
      },
      {
        name: 'Pro',
        description: 'Accesso completo per creator e freelance',
        price: 1900, // 19€ in centesimi
      },
      {
        name: 'Business',
        description: 'Per team e aziende con esigenze avanzate',
        price: 3900, // 39€ in centesimi
      },
      {
        name: 'Custom',
        description: 'Progetti su misura con supporto premium',
        price: 9900, // 99€ in centesimi
      },
    ]

    const results = []

    // Crea i prodotti e i piani di prezzo
    for (const product of products) {
      // Crea il prodotto
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
      })

      // Crea il piano di prezzo
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'eur',
        recurring: {
          interval: 'month',
        },
      })

      results.push({
        productId: stripeProduct.id,
        priceId: price.id,
        name: product.name,
        price: product.price / 100, // Converti in euro
      })
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error('Errore nella creazione dei prodotti:', err)
    return NextResponse.json({ error: 'Errore nella creazione dei prodotti' }, { status: 500 })
  }
} 