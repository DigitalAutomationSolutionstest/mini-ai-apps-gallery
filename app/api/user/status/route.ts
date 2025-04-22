import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

  // Recupera crediti
  const { data: credits } = await supabase
    .from("user_credits")
    .select("credits, updated_at")
    .eq("user_id", user.id)
    .single();

  // Recupera abbonamento attivo
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Recupera ultimi utilizzi
  const { data: recentUsage } = await supabase
    .from("credits_usage")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email
    },
    credits: credits?.credits || 0,
    last_updated: credits?.updated_at,
    subscription: subscription || null,
    recent_usage: recentUsage || []
  });
} 