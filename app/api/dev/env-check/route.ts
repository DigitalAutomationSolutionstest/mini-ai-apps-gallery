/**
 * ATTENZIONE: Endpoint solo per diagnostica, da rimuovere in produzione.
 * Verifica la presenza delle variabili d'ambiente senza esporre i valori completi.
 */
export async function GET() {
  const envCheck = {
    STRIPE_SECRET_KEY: checkEnvVar(process.env.STRIPE_SECRET_KEY),
    RESEND_API_KEY: checkEnvVar(process.env.RESEND_API_KEY),
    SUPABASE_URL: checkEnvVar(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    HUGGINGFACE_API_KEY: checkEnvVar(process.env.HUGGINGFACE_API_KEY),
  };

  return new Response(JSON.stringify(envCheck, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Verifica se una variabile d'ambiente è presente e mostra solo parte del valore
 */
function checkEnvVar(value: string | undefined): { set: boolean; preview?: string; length?: number } {
  if (!value) {
    return { set: false };
  }
  
  const len = value.length;
  
  // Mostra solo i primi 4 e gli ultimi 4 caratteri della chiave
  const preview = len <= 8 
    ? "***" 
    : `${value.substring(0, 4)}...${value.substring(len - 4)}`;
  
  return {
    set: true,
    preview,
    length: len,
  };
} 