
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Define the type for your env variables if they're available
type SupabaseEnv = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

// Default to empty strings or environment variables
let supabaseUrl = '';
let supabaseAnonKey = '';

// Try to get environment variables if available
try {
  const env = window as unknown as SupabaseEnv;
  supabaseUrl = env.SUPABASE_URL || '';
  supabaseAnonKey = env.SUPABASE_ANON_KEY || '';
} catch (error) {
  console.error('Error accessing Supabase environment variables:', error);
}

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};
