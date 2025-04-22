import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Configurazione hardcoded temporanea
const SUPABASE_URL = 'https://nuvvezmucfeaswkmerbs.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dnZlem11Y2ZlYXN3a21lcmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MTU2OCwiZXhwIjoyMDU5NzE3NTY4fQ.4afTRyc3OGoQNHII5mL3_dzXAhKphaLLGvldryXxU70';

// Inizializzazione client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Genera email casuale per il test
    const testEmail = `test${Date.now()}@example.com`;

    // Crea un utente di test
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'password123',
      email_confirm: true
    });

    if (authError) {
      return res.status(500).json({ error: 'Error creating test user', details: authError });
    }

    const userId = authData.user.id;

    // Crea crediti per l'utente
    const { error: creditsError } = await supabase
      .from('user_credits')
      .insert({ user_id: userId, credits: 10 });

    if (creditsError) {
      return res.status(500).json({ error: 'Error creating credits', details: creditsError });
    }

    // Ottieni il token di accesso
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'password123',
    });

    if (signInError || !session) {
      return res.status(500).json({ error: 'Error signing in', details: signInError });
    }

    // Test dell'API di generazione immagini
    const response = await fetch('http://localhost:3000/api/ai/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        prompt: 'Un gatto che gioca con un robot',
      }),
    });

    const result = await response.json();

    // Pulisci l'utente di test
    await supabase.auth.admin.deleteUser(userId);

    return res.status(200).json({
      success: true,
      testResult: result,
      accessToken: session.access_token
    });

  } catch (error) {
    console.error('Error running test:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 