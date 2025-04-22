import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Token mancante" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 401 });
  }

  // Deduce 1 credito
  const { data: credits, error: creditsError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  if (creditsError || !credits || credits.credits < 1) {
    return NextResponse.json({ error: "Crediti insufficienti" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("user_credits")
    .update({ 
      credits: credits.credits - 1,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Errore aggiornamento crediti" }, { status: 500 });
  }

  // Registra l'utilizzo
  const { error: usageError } = await supabase
    .from("credits_usage")
    .insert({
      user_id: user.id,
      credits_used: 1,
      action: "mini_app_usage",
      created_at: new Date().toISOString()
    });

  if (usageError) {
    console.error("Errore registrazione utilizzo:", usageError);
  }

  return NextResponse.json({ 
    success: true, 
    credits: credits.credits - 1 
  });
} 