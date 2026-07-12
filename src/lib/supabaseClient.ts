import { createClient } from "@supabase/supabase-js";

/**
 * Single shared Supabase client for the whole app.
 * Reads the Project URL + anon key from Vite env vars (see .env.example).
 *
 * The anon key is meant to be public — your data is protected by the
 * Row Level Security (RLS) policies defined in supabase/schema.sql.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Don't crash the app — just warn. Login/data calls will fail until set.
  // eslint-disable-next-line no-console
  console.warn(
    "[TransitOps] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Create a .env.local file (see .env.example) and restart `npm run dev`.",
  );
}

export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
