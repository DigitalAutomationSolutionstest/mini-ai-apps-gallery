import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function deductCredits(userId: string, amount: number) {
  const { data: current } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  const currentCredits = current?.credits ?? 0;
  if (currentCredits < amount) return false;

  await supabase
    .from("user_credits")
    .update({ credits: currentCredits - amount })
    .eq("user_id", userId);

  return true;
} 