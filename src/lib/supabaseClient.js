import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzyfbuosnuyqafnzhfo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5enlmYnVvc251eXFhZm56aGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjYxOTEsImV4cCI6MjA3ODA0MjE5MX0.oPrh18a6hudzdz4m43qG2V1R0KL1V2IV_Y_QNXQAFPA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
