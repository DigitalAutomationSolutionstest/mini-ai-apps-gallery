import { supabase } from "@/src/lib/supabase";
import { getUserIdFromRequest } from "@/src/lib/auth";

export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { amount } = await req.json();

  const { error } = await supabase.rpc("adjust_user_credits", {
    uid: userId,
    delta: amount,
  });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 