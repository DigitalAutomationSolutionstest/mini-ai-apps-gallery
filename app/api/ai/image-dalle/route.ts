import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("ENV – OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

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

  // Chiamata a OpenAI DALL·E
  let imageUrl = null;
  let openaiResponse = null;
  try {
    let openaiRes;
    try {
      openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
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
    } catch (fetchErr) {
      console.error("Errore di rete nella fetch OpenAI:", fetchErr);
      return NextResponse.json({ error: "Errore di rete verso OpenAI", details: String(fetchErr) }, { status: 500 });
    }

    try {
      openaiResponse = await openaiRes.json();
    } catch (jsonErr) {
      console.error("Errore parsing JSON risposta OpenAI:", jsonErr);
      return NextResponse.json({ error: "Errore parsing risposta OpenAI", details: String(jsonErr) }, { status: 500 });
    }

    console.log("Risposta OpenAI:", JSON.stringify(openaiResponse));

    if (!openaiRes.ok) {
      console.error("OpenAI response not ok:", openaiResponse);
      return NextResponse.json({ error: "Errore generazione immagine DALL·E", details: openaiResponse }, { status: 502 });
    }
    if (!openaiResponse.data || !openaiResponse.data[0]?.url) {
      console.error("Risposta OpenAI senza data/url:", openaiResponse);
      return NextResponse.json({ error: "Risposta OpenAI senza data/url", details: openaiResponse }, { status: 502 });
    }
    imageUrl = openaiResponse.data[0].url;
  } catch (err) {
    console.error("Errore generale blocco OpenAI:", err);
    return NextResponse.json({ error: "Errore connessione AI", details: String(err) }, { status: 500 });
  }

  // Deduzione credito
  await supabase
    .from("users")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  return NextResponse.json({ image: imageUrl, credits: profile.credits - 1 });
} 