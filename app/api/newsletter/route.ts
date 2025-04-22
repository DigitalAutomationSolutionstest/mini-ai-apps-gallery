import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email mancante" },
        { status: 400 }
      );
    }

    // Verifica formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato email non valido" },
        { status: 400 }
      );
    }

    // Verifica se l'email esiste già
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email già registrata" },
        { status: 400 }
      );
    }

    // Inserisci il nuovo subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        status: "active",
        subscribed_at: new Date().toISOString(),
        source: "website"
      });

    if (error) {
      console.error("Errore salvataggio subscriber:", error);
      return NextResponse.json(
        { error: "Errore durante la registrazione" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Iscrizione completata con successo"
    });
  } catch (err) {
    console.error("Errore generico:", err);
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta" },
      { status: 500 }
    );
  }
} 