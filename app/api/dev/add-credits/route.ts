import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Route disponibile solo in sviluppo" }, { status: 403 });
  }

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

  // Recupera i crediti attuali
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Profilo non trovato" }, { status: 404 });
  }

  // Aggiorna i crediti
  const nuoviCrediti = (profile.credits || 0) + 20;
  const { error: updateError } = await supabase
    .from("users")
    .update({ credits: nuoviCrediti })
    .eq("id", user.id);
  if (updateError) {
    return NextResponse.json({ error: "Errore aggiornamento crediti" }, { status: 500 });
  }

  return NextResponse.json({ success: true, credits: nuoviCrediti });
} 