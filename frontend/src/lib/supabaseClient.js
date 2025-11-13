import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://jjgcfpueqymjnmrepskc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZ2NmcHVlcXltam5tcmVwc2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI4NTEsImV4cCI6MjA3ODU0ODg1MX0.YpyEplyrYKE7HZEzYVXJifdxVvV5Prg8oxnpGIqzSSQ';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Las credenciales públicas de Supabase no están configuradas');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const PERSONAS_TABLE = 'personas';
export const ROSTROS_BUCKET = 'rostros';
