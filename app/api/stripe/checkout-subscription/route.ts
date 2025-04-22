import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil'
})

export async function POST(req: Request) {
  try {
    const { user_id, priceId } = await req.json()

    if (!user_id || !priceId) {
      return NextResponse.json(
        { error: 'user_id e priceId sono richiesti' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      client_reference_id: user_id,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Errore nel checkout:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione della sessione di checkout' },
      { status: 500 }
    )
  }
} 