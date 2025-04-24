import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/lib/supabase';

interface PDFRequest {
  pdfUrl: string;
  userId: string;
  questions?: string[];
}

/**
 * API per elaborare PDF tramite AI
 * POST /api/ai/pdf
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as PDFRequest;
    const { pdfUrl, userId, questions } = body;

    if (!pdfUrl || !userId) {
      return NextResponse.json(
        { success: false, message: 'URL del PDF e ID utente sono obbligatori' },
        { status: 400 }
      );
    }

    // Verificare se l'utente esiste e ha abbastanza crediti
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, credits')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('Errore nel recupero dell\'utente:', userError);
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }

    if (userData.credits < 1) {
      return NextResponse.json(
        { success: false, message: 'Crediti insufficienti per elaborare il PDF' },
        { status: 403 }
      );
    }

    // Logica per elaborare il PDF con AI
    // Qui andrebbe implementata la chiamata a OpenAI o altra API di AI
    
    // Mock della risposta AI per dimostrazione
    const aiResponses = questions 
      ? questions.map(q => ({ question: q, answer: `Risposta simulata per: ${q}` }))
      : [{ summary: 'Questo è un riassunto simulato del contenuto del PDF.' }];

    // Registra l'utilizzo e scala i crediti
    const { error: usageError } = await supabase
      .from('ai_usage')
      .insert({
        user_id: userId,
        feature: 'pdf',
        credits_used: 1,
        content_reference: pdfUrl,
        created_at: new Date().toISOString(),
      });

    if (usageError) {
      console.error('Errore nel salvataggio dell\'utilizzo:', usageError);
    }

    // Sottrai un credito all'utente
    const { error: creditError } = await supabase
      .from('users')
      .update({ credits: userData.credits - 1 })
      .eq('id', userId);

    if (creditError) {
      console.error('Errore nell\'aggiornamento dei crediti:', creditError);
    }

    return NextResponse.json({
      success: true,
      responses: aiResponses,
      remainingCredits: userData.credits - 1,
    });
  } catch (error) {
    console.error('Errore nell\'elaborazione del PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore interno' },
      { status: 500 }
    );
  }
} 