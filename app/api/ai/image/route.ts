import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const authHeader = headers().get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 401 });
  }

  // Controllo crediti
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.credits < 1) {
    return NextResponse.json({ error: "Crediti esauriti" }, { status: 403 });
  }

  // Chiamata a HuggingFace (Stable Diffusion demo)
  let imageUrl = null;
  let json = null;
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!hfRes.ok) {
      return NextResponse.json({ error: "Errore chiamata HuggingFace" }, { status: 502 });
    }

    // L'API può restituire direttamente un'immagine (blob) o un URL, qui simuliamo un URL
    // In produzione, salva l'immagine su storage e restituisci l'URL
    // Per demo:
    json = await hfRes.json();
    imageUrl = json?.url || null;
    if (!imageUrl && Array.isArray(json)) {
      // Alcuni modelli HuggingFace restituiscono [{ generated_image: "data:image/png;base64,..." }]
      const base64 = json[0]?.generated_image;
      if (base64) imageUrl = base64;
    }
  } catch (err) {
    console.error("Errore fetch HuggingFace:", err);
    return NextResponse.json({ error: "Errore connessione AI" }, { status: 500 });
  }

  if (!imageUrl) {
    return NextResponse.json({ error: "Errore nella generazione immagine" }, { status: 500 });
  }

  // Deduzione credito
  await supabase
    .from("users")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  return NextResponse.json({ image: imageUrl, credits: profile.credits - 1 });
} 