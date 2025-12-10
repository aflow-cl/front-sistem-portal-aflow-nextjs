import type { User, Session, LoginCredentials } from "@/types";
import { log } from "@/lib/pino-client";

/**
 * Mock user database for development
 * This simulates authentication without a real backend
 */
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "test@aflow.cl",
    nombre: "Usuario",
    apellido: "Demo",
    role: "admin",
    cargo: "Administrador",
    departamento: "TI",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Mock password for test user
 */
const MOCK_PASSWORD = "123456";

/**
 * Session storage key
 */
const SESSION_KEY = "aflow_session";

/**
 * Mock login function
 * Simulates authentication with predefined credentials
 */
export async function loginMock(
  credentials: LoginCredentials
): Promise<{ session: Session | null; error: string | null }> {
  try {
    log.info("Attempting mock login", { email: credentials.email });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email
    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!user) {
      log.warn("User not found", { email: credentials.email });
      return {
        session: null,
        error: "Credenciales inválidas",
      };
    }

    // Validate password
    if (credentials.password !== MOCK_PASSWORD) {
      log.warn("Invalid password", { email: credentials.email });
      return {
        session: null,
        error: "Credenciales inválidas",
      };
    }

    // Create session
    const session: Session = {
      user,
      accessToken: `mock-token-${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Store session
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    log.info("Login successful", { userId: user.id, email: user.email });

    return {
      session,
      error: null,
    };
  } catch (error) {
    log.error("Login error", error as Error);
    return {
      session: null,
      error: "Error al iniciar sesión",
    };
  }
}

/**
 * Get current session from localStorage
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch (error) {
    log.error("Error reading session", error as Error);
    return null;
  }
}

/**
 * Logout and clear session
 */
export async function logoutMock(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
  log.info("Logout successful");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const session = getSession();
  return session !== null;
}
