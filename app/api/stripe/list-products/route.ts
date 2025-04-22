import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function GET() {
  try {
    // Recupera tutti i prodotti
    const products = await stripe.products.list()
    
    // Recupera tutti i prezzi
    const prices = await stripe.prices.list({ active: true, expand: ['data.product'] })
    
    // Crea un oggetto per mappare i prezzi ai prodotti
    const priceMap: Record<string, { priceId: string; amount: number; interval: string }> = {}
    prices.data.forEach(price => {
      if (typeof price.product === 'object') {
        const product = price.product as Stripe.Product
        priceMap[product.id] = {
          priceId: price.id,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          interval: price.recurring?.interval || 'one-time',
        }
      }
    })
    
    // Formatta i risultati
    const results = products.data.map(product => ({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: priceMap[product.id] || null,
    }))
    
    return NextResponse.json(results)
  } catch (err) {
    console.error('Errore nel recupero dei prodotti:', err)
    return NextResponse.json({ error: 'Errore nel recupero dei prodotti' }, { status: 500 })
  }
} 