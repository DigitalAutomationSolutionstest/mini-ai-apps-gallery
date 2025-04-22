import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { query } = await req.json();
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

  // Chiamata a OpenAI
  let code = null;
  let json = null;
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Scrivi solo codice, senza spiegazioni. ${query}`,
          },
        ],
        max_tokens: 512,
        temperature: 0.2,
      }),
    });

    if (!openaiRes.ok) {
      return NextResponse.json({ error: "Errore chiamata OpenAI" }, { status: 502 });
    }

    json = await openaiRes.json();
    code = json?.choices?.[0]?.message?.content;
  } catch (err) {
    console.error("Errore fetch OpenAI:", err);
    return NextResponse.json({ error: "Errore connessione AI" }, { status: 500 });
  }

  if (!code) {
    return NextResponse.json({ error: "Errore nella generazione codice" }, { status: 500 });
  }

  // Deduzione credito
  await supabase
    .from("users")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  return NextResponse.json({ result: code, credits: profile.credits - 1 });
} 