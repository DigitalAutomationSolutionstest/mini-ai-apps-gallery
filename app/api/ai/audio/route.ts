import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("audio");
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

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File audio mancante" }, { status: 400 });
  }

  // Chiamata a OpenAI Whisper
  let transcript = null;
  let json = null;
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: (() => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("model", "whisper-1");
        fd.append("language", "it");
        return fd;
      })(),
    });

    if (!openaiRes.ok) {
      return NextResponse.json({ error: "Errore chiamata OpenAI Whisper" }, { status: 502 });
    }

    json = await openaiRes.json();
    transcript = json?.text;
  } catch (err) {
    console.error("Errore fetch OpenAI Whisper:", err);
    return NextResponse.json({ error: "Errore connessione AI" }, { status: 500 });
  }

  if (!transcript) {
    return NextResponse.json({ error: "Errore nella trascrizione" }, { status: 500 });
  }

  // Deduzione credito
  await supabase
    .from("users")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  return NextResponse.json({ text: transcript, credits: profile.credits - 1 });
} 