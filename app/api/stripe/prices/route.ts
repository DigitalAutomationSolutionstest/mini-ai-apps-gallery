import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    })

    const formatted = prices.data.map((price) => {
      const product = price.product as Stripe.Product
      return {
        id: price.id,
        nickname: price.nickname || product.name || 'Piano',
        unit_amount: price.unit_amount || 0,
        product: {
          name: product.name || 'Piano senza nome',
          description: product.description || 'Nessuna descrizione disponibile',
          category: product.metadata.category || 'Altro',
        },
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('[STRIPE_GET_PRICES_ERROR]', error)
    return new NextResponse('Failed to fetch prices', { status: 500 })
  }
}
