import { supabase } from "@/src/lib/supabase";
import { getUserIdFromRequest } from "@/src/lib/auth";

export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ credits: data?.credits || 0 }), { status: 200 });
} 