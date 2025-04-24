import { getUserIdFromRequest } from "@/src/lib/auth";

export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  return new Response(JSON.stringify({ userId }), { status: 200 });
} 