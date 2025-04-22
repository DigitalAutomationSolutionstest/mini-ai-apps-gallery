import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { input } = await req.json();
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

  // Chiamata a Claude via Anthropic
  let output = null;
  let json = null;
  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Genera un report professionale in formato testo partendo dal seguente input:\n\n${input}`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      return NextResponse.json({ error: "Errore chiamata Anthropic" }, { status: 502 });
    }

    json = await claudeRes.json();
    console.log("Risposta Claude:", JSON.stringify(json, null, 2));
    output = json?.content?.[0]?.text;
  } catch (err) {
    console.error("Errore fetch Anthropic:", err);
    return NextResponse.json({ error: "Errore connessione AI" }, { status: 500 });
  }

  if (!output) {
    return NextResponse.json({ error: "Errore nella generazione AI" }, { status: 500 });
  }

  // Deduzione credito
  await supabase
    .from("users")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  return NextResponse.json({ result: output, credits: profile.credits - 1 });
} 