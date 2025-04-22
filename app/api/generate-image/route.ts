import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = body.prompt;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt mancante" }, { status: 400 });
  }

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Token mancante" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Utente non valido" }, { status: 401 });
  }

  // Verifica crediti disponibili
  const { data: credits, error: creditsError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  if (creditsError || !credits || credits.credits < 1) {
    return NextResponse.json({ error: "Crediti insufficienti" }, { status: 403 });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512"
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("Errore OpenAI:", errorText);
      return NextResponse.json({ error: "Errore dalla API OpenAI" }, { status: 500 });
    }

    const data = await openaiRes.json();
    const imageUrl = data.data[0].url;

    // Deduce 1 credito
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({ 
        credits: credits.credits - 1,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Errore aggiornamento crediti:", updateError);
    }

    // Registra l'utilizzo
    const { error: usageError } = await supabase
      .from("credits_usage")
      .insert({
        user_id: user.id,
        credits_used: 1,
        action: "image_generation",
        created_at: new Date().toISOString()
      });

    if (usageError) {
      console.error("Errore registrazione utilizzo:", usageError);
    }

    return NextResponse.json({ 
      url: imageUrl,
      credits_remaining: credits.credits - 1
    });

  } catch (err) {
    console.error("Errore interno:", err);
    return NextResponse.json({ error: "Errore nella generazione immagine" }, { status: 500 });
  }
} 