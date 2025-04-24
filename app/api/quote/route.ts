import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

interface QuoteRequest {
  name: string;
  email: string;
  projectDescription: string;
  budget?: string;
  deadline?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY || '');

/**
 * API per inviare una richiesta di preventivo
 * POST /api/quote
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as QuoteRequest;
    const { name, email, projectDescription, budget, deadline } = body;

    // Validazione dei campi obbligatori
    if (!name || !email || !projectDescription) {
      return NextResponse.json(
        { success: false, message: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }

    // Valida email con regex semplice
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Indirizzo email non valido' },
        { status: 400 }
      );
    }

    // Salva la richiesta nel database
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .insert([
        {
          name,
          email,
          project_description: projectDescription,
          budget: budget || 'Non specificato',
          deadline: deadline || 'Non specificato',
          status: 'nuovo',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (quoteError) {
      console.error('Errore nel salvataggio della richiesta:', quoteError);
      return NextResponse.json(
        { success: false, message: 'Errore durante il salvataggio della richiesta' },
        { status: 500 }
      );
    }

    // Invia email di notifica
    const adminEmail = process.env.EMAIL_ADMIN;
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Mini AI Hub <noreply@miniaiapps.tech>',
          to: [adminEmail],
          subject: 'Nuova richiesta di preventivo',
          html: `
            <h1>Nuova richiesta di preventivo</h1>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Descrizione progetto:</strong> ${projectDescription}</p>
            <p><strong>Budget:</strong> ${budget || 'Non specificato'}</p>
            <p><strong>Scadenza:</strong> ${deadline || 'Non specificato'}</p>
          `,
        });

        // Invia email di conferma al cliente
        await resend.emails.send({
          from: 'Mini AI Hub <noreply@miniaiapps.tech>',
          to: [email],
          subject: 'Abbiamo ricevuto la tua richiesta',
          html: `
            <h1>Grazie per averci contattato!</h1>
            <p>Ciao ${name},</p>
            <p>Abbiamo ricevuto la tua richiesta di preventivo e la stiamo valutando.</p>
            <p>Ti risponderemo al più presto con una proposta personalizzata.</p>
            <p>A presto,<br>Il team di Mini AI Hub</p>
          `,
        });
      } catch (emailError) {
        console.error('Errore nell\'invio dell\'email:', emailError);
        // Non blocchiamo il processo se l'invio dell'email fallisce
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Richiesta inviata con successo',
      quoteId: quoteData?.id,
    });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore interno' },
      { status: 500 }
    );
  }
} 