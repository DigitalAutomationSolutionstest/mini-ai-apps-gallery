import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Configurazione hardcoded temporanea
const SUPABASE_URL = 'https://nuvvezmucfeaswkmerbs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dnZlem11Y2ZlYXN3a21lcmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MTU2OCwiZXhwIjoyMDU5NzE3NTY4fQ.4afTRyc3OGoQNHII5mL3_dzXAhKphaLLGvldryXxU70';

// Inizializzazione client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Verifica l'autenticazione dell'utente e controlla i crediti
 * @param req Request
 * @param res Response
 * @param requiredCredits Crediti richiesti per l'operazione
 * @returns Oggetto con user e credits se autenticato e con crediti sufficienti, altrimenti null
 */
export async function verifyAuthAndCredits(
  req: NextApiRequest,
  res: NextApiResponse,
  requiredCredits: number
): Promise<{ user: any; credits: number } | null> {
  try {
    console.log('Starting auth verification...');
    // Verifica token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid auth header:', authHeader);
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return null;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted, verifying user...');
    
    // Verifica utente
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      console.log('Auth error:', authError);
      res.status(401).json({ error: 'Invalid token' });
      return null;
    }
    if (!user) {
      console.log('No user found for token');
      res.status(401).json({ error: 'Invalid token' });
      return null;
    }

    console.log('User verified:', user.id);

    // Verifica crediti
    console.log('Checking credits for user:', user.id);
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (creditsError) {
      console.log('Error checking credits:', creditsError);
      res.status(500).json({ error: 'Error checking credits' });
      return null;
    }

    console.log('Credits found:', credits);

    if (!credits || credits.credits < requiredCredits) {
      console.log('Insufficient credits:', credits?.credits, 'required:', requiredCredits);
      res.status(403).json({ error: 'Insufficient credits' });
      return null;
    }

    console.log('Auth and credits verification successful');
    return { user, credits: credits.credits };
  } catch (error) {
    console.error('Detailed auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return null;
  }
}

/**
 * Aggiorna i crediti dell'utente
 * @param userId ID dell'utente
 * @param currentCredits Crediti attuali
 * @param creditsToDeduct Crediti da detrarre
 * @returns true se l'aggiornamento è riuscito, false altrimenti
 */
export async function updateCredits(
  userId: string,
  currentCredits: number,
  creditsToDeduct: number
): Promise<boolean> {
  try {
    console.log('Updating credits for user:', userId);
    console.log('Current credits:', currentCredits, 'to deduct:', creditsToDeduct);

    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: currentCredits - creditsToDeduct })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    console.log('Credits updated successfully');
    return true;
  } catch (error) {
    console.error('Detailed error updating credits:', error);
    return false;
  }
} 