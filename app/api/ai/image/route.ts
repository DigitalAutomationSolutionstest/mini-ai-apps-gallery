import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface ImageRequest {
  prompt: string;
  userId: string;
  size?: string;
  style?: string;
}

/**
 * API per generare immagini tramite AI
 * POST /api/ai/image
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ImageRequest;
    const { prompt, userId, size = '1024x1024', style = 'natural' } = body;

    if (!prompt || !userId) {
      return NextResponse.json(
        { success: false, message: 'Prompt e ID utente sono obbligatori' },
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

    const requiredCredits = 2; // La generazione di immagini richiede più crediti
    
    if (userData.credits < requiredCredits) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Crediti insufficienti. Sono necessari ${requiredCredits} crediti per generare un'immagine.` 
        },
        { status: 403 }
      );
    }

    // Logica per generare immagini con API OpenAI
    // Qui andrebbe implementata la chiamata a OpenAI o altra API di AI
    
    // Mock della risposta per dimostrazione
    const imageUrl = "https://placehold.co/600x400?text=Immagine+generata+AI";

    // Registra l'utilizzo e scala i crediti
    const { error: usageError } = await supabase
      .from('ai_usage')
      .insert({
        user_id: userId,
        feature: 'image',
        credits_used: requiredCredits,
        content_reference: prompt,
        created_at: new Date().toISOString(),
      });

    if (usageError) {
      console.error('Errore nel salvataggio dell\'utilizzo:', usageError);
    }

    // Sottrai i crediti all'utente
    const { error: creditError } = await supabase
      .from('users')
      .update({ credits: userData.credits - requiredCredits })
      .eq('id', userId);

    if (creditError) {
      console.error('Errore nell\'aggiornamento dei crediti:', creditError);
    }

    // Salva l'immagine generata nel database
    const { data: imageData, error: imageError } = await supabase
      .from('generated_images')
      .insert({
        user_id: userId,
        prompt,
        image_url: imageUrl,
        size,
        style,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (imageError) {
      console.error('Errore nel salvataggio dell\'immagine:', imageError);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      imageId: imageData?.id,
      remainingCredits: userData.credits - requiredCredits,
    });
  } catch (error) {
    console.error('Errore nella generazione dell\'immagine:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore interno' },
      { status: 500 }
    );
  }
} 