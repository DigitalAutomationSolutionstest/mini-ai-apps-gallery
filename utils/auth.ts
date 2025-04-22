import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function getUserFromToken(token?: string) {
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return data?.user ?? null;
} 