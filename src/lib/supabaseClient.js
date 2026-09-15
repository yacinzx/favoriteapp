import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client, or `null` when not configured yet.
 *
 * When env vars are absent the app keeps working in "device-only" mode using
 * localStorage, so the project always runs — add keys to enable cloud sync.
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith("http"),
);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
