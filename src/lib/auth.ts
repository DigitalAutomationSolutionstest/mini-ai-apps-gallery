import { supabase } from './supabase';

/**
 * Estrae l'ID utente dalla richiesta utilizzando il token di autorizzazione
 */
export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  try {
    // Estrai il token dalla header Authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }

    // Verifica il token con Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('[AUTH_ERROR]', error);
      return null;
    }

    return data.user.id;
  } catch (err) {
    console.error('[AUTH_ERROR]', err);
    return null;
  }
} 