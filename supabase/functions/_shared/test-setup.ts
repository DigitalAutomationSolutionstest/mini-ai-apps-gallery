import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Configurazione ambiente test
export const TEST_CONFIG = {
  supabaseUrl: Deno.env.get('SUPABASE_URL') || 'http://localhost:54321',
  supabaseKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'test-key',
  openaiKey: Deno.env.get('OPENAI_API_KEY') || 'test-key',
  stripeKey: Deno.env.get('STRIPE_SECRET_KEY') || 'test-key',
};

// Client Supabase per i test
export const supabase = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseKey
);

// Helper per creare un utente di test
export async function createTestUser() {
  const { data: user, error } = await supabase.auth.signUp({
    email: `test-${Date.now()}@example.com`,
    password: 'test-password',
  });

  if (error) throw error;
  return user;
}

// Helper per pulire i dati di test
export async function cleanupTestData(userId: string) {
  await supabase.from('user_credits').delete().eq('user_id', userId);
  await supabase.from('quote_requests').delete().eq('user_id', userId);
  await supabase.auth.admin.deleteUser(userId);
}

// Helper per verificare health check
export async function checkHealth(endpoint: string) {
  const response = await fetch(`${TEST_CONFIG.supabaseUrl}/functions/v1/${endpoint}/health`);
  return {
    status: response.status,
    ok: response.ok,
    data: await response.json(),
  };
}

// Helper per verificare route API
export async function checkApiRoute(route: string) {
  const response = await fetch(`${TEST_CONFIG.supabaseUrl}/functions/v1/${route}`);
  return {
    status: response.status,
    ok: response.ok,
    data: await response.json(),
  };
} 