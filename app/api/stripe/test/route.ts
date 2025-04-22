import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function GET() {
  try {
    // Verifica che la chiave API sia configurata
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY non configurata' }, { status: 500 })
    }

    // Verifica che la chiave API sia valida
    try {
      await stripe.products.list({ limit: 1 })
    } catch (err) {
      return NextResponse.json({ error: 'Chiave API Stripe non valida' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Connessione a Stripe riuscita' })
  } catch (err) {
    console.error('Errore nella verifica di Stripe:', err)
    return NextResponse.json({ error: 'Errore nella verifica di Stripe' }, { status: 500 })
  }
} 