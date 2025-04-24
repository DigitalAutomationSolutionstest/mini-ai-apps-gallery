import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API per verificare lo stato dei servizi
 * GET /api/debug
 */
export async function GET() {
  try {
    // Verifica connessione a Supabase
    const { data: supabaseCheck, error: supabaseError } = await supabase
      .from('health_check')
      .select('*')
      .limit(1)
      .maybeSingle();

    // Controlla servizi esterni
    const services = {
      supabase: {
        status: supabaseError ? 'error' : 'online',
        message: supabaseError ? supabaseError.message : 'Connessione attiva',
      },
      stripe: {
        status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
      },
      resend: {
        status: process.env.RESEND_API_KEY ? 'configured' : 'not_configured',
      },
      openai: {
        status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
      }
    };

    return NextResponse.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services,
    }, { status: 200 });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Si è verificato un errore durante il controllo dei servizi',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 