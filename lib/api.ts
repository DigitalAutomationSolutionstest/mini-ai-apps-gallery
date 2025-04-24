/**
 * Client API per interagire con i servizi del backend
 */

// URL base per le chiamate API
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Ottiene un report PDF analizzato
 */
export async function getPDFReport(fileUrl: string, prompt?: string) {
  try {
    const response = await fetch(`${API_URL}/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl,
        prompt: prompt || 'Analizza questo documento',
      }),
    });

    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore durante l'analisi PDF:", error);
    throw error;
  }
}

/**
 * Invia una richiesta di preventivo
 */
export async function sendQuote(data: {
  name: string;
  email: string;
  message: string;
  budget?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore durante l'invio del preventivo:", error);
    throw error;
  }
}

/**
 * Ottiene il saldo crediti utente
 */
export async function getUserCredits() {
  try {
    const response = await fetch(`${API_URL}/user/credits`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Errore durante il recupero dei crediti:', error);
    return { credits: 0 };
  }
} 