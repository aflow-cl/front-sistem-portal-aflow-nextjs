import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Supabase client for browser usage
 * 
 * NOTE: This is configured for mock authentication.
 * For production, ensure proper Supabase credentials are set in environment variables.
 */

export const supabase = createClient(
  env.supabase.url || "https://mock.supabase.co",
  env.supabase.anonKey || "mock-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
