import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service-role key.
// This key must NEVER be exposed to the frontend/browser.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn(
    '[supabaseClient] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — Supabase client not initialized. Set these in .env once the Supabase project is created.'
  );
}

export default supabase;
