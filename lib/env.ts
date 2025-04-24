/**
 * Variabili d'ambiente condivise
 */

// API e URL base
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.miniaiapps.tech';

// Configurazione Supabase
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nuvvezmucfeaswkmerbs.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Configurazione Stripe
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Prezzi e prodotti predefiniti (utili per sviluppo)
export const DEFAULT_PRICE_ID = process.env.NEXT_PUBLIC_DEFAULT_PRICE_ID || 'price_1Nz'; 