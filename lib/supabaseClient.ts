import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Crea il client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase; 