/**
 * Environment variables validation and type-safe access
 */

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const errors: string[] = [];

  if (!env.supabase.url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  if (!env.supabase.anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }

  if (errors.length > 0) {
    console.warn("Environment validation warnings:", errors);
  }

  return errors.length === 0;
}
