import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

interface RequestBody {
  priceId: string;
  email: string;
}

/**
 * API per creare una sessione di checkout Stripe per abbonamenti
 * POST /api/stripe/checkout-subscription
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody;
    const { priceId, email } = body;

    if (!priceId || !email) {
      return NextResponse.json(
        { success: false, message: 'Dati mancanti: priceId e email sono obbligatori' },
        { status: 400 }
      );
    }

    // Ottieni o crea l'utente in Supabase
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.error('Errore nel recupero dell\'utente:', userError);
      return NextResponse.json(
        { success: false, message: 'Errore durante la verifica dell\'utente' },
        { status: 500 }
      );
    }

    let userId;
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Crea un nuovo utente
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ email, created_at: new Date().toISOString() }])
        .select('id')
        .single();

      if (createError || !newUser) {
        console.error('Errore nella creazione dell\'utente:', createError);
        return NextResponse.json(
          { success: false, message: 'Errore durante la registrazione dell\'utente' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Crea la sessione di checkout
    const checkoutResult = await createCheckoutSession(priceId, userId, email);

    if (!checkoutResult.success) {
      return NextResponse.json(
        { success: false, message: checkoutResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: checkoutResult.sessionId,
      url: checkoutResult.url,
    });
  } catch (error) {
    console.error('Errore nella creazione dell\'abbonamento:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore interno' },
      { status: 500 }
    );
  }
} 