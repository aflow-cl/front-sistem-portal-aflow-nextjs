/**
 * Variables de entorno con validación
 */

// Validación de variables de entorno requeridas
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  
  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Ejecutar validación
validateEnv();

// Exportar variables de entorno
export const env = {
  // App
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "AFLOW Portal",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-role-key",
  },
  
  // API
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:3000/api",
    timeout: parseInt(process.env.API_TIMEOUT || "30000", 10),
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enabled: process.env.ENABLE_LOGGING === "true",
  },
  
  // Session
  session: {
    secret: process.env.SESSION_SECRET || "aflow-portal-session-secret",
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "86400", 10),
  },
  
  // Feature Flags
  features: {
    authEnabled: process.env.FEATURE_AUTH_ENABLED !== "false",
    mockData: process.env.FEATURE_MOCK_DATA === "true",
  },
} as const;

export type Env = typeof env;
