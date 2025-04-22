import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Verifica se la chiave API è valida
const isStripeKeyValid = process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') && 
  process.env.STRIPE_SECRET_KEY.length > 20

const stripe = isStripeKeyValid 
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-03-31.basil',
    })
  : null

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json()
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'ID prezzo mancante' },
        { status: 400 }
      )
    }
    
    // Se la chiave API non è valida, restituisci un errore
    if (!stripe) {
      return NextResponse.json(
        { error: 'Configurazione Stripe non valida. Controlla la chiave API.' },
        { status: 500 }
      )
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/error?error=${encodeURIComponent('Pagamento annullato')}`,
    })
    
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Errore nella creazione della sessione di checkout:', error)
    
    // In caso di errore, restituisci un URL di errore
    const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione della sessione di checkout'
    const errorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/error?error=${encodeURIComponent(errorMessage)}`
    
    return NextResponse.json({ url: errorUrl })
  }
} 