import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cliente de Supabase para el navegador
 */
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Cliente de Supabase con Service Role (solo servidor)
 */
export const supabaseAdmin = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
