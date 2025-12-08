import { supabase } from "./client";
import { appLogger } from "@/core/logging/logger";
import { MOCK_CREDENTIALS } from "@/lib/constants";
import type { User, Session } from "@/types";

/**
 * Mock user data para desarrollo
 */
const MOCK_USERS: Record<string, User> = {
  "test@aflow.cl": {
    id: "user-001",
    email: "test@aflow.cl",
    nombre: "Usuario",
    apellido: "Administrador",
    role: "admin",
    avatar: "",
    telefono: "+56912345678",
    cargo: "Administrador de Sistema",
    departamento: "TI",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "analista@aflow.cl": {
    id: "user-002",
    email: "analista@aflow.cl",
    nombre: "María",
    apellido: "González",
    role: "analista",
    avatar: "",
    telefono: "+56987654321",
    cargo: "Analista Senior",
    departamento: "Operaciones",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "operador@aflow.cl": {
    id: "user-003",
    email: "operador@aflow.cl",
    nombre: "Juan",
    apellido: "Pérez",
    role: "operador",
    avatar: "",
    telefono: "+56911111111",
    cargo: "Operador de Guardia",
    departamento: "Seguridad",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Autenticación con Supabase (Mock)
 */
export const auth = {
  /**
   * Iniciar sesión
   */
  async signIn(email: string, password: string): Promise<Session | null> {
    try {
      appLogger.auth("Login attempt", { email });

      // Validación mock
      if (email === MOCK_CREDENTIALS.EMAIL && password === MOCK_CREDENTIALS.PASSWORD) {
        const user = MOCK_USERS[email];
        const session: Session = {
          user,
          accessToken: `mock-token-${Date.now()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        };

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("aflow_session", JSON.stringify(session));
        }

        appLogger.auth("Login successful", { email, userId: user.id });
        return session;
      }

      // Validar otros usuarios mock
      const mockUser = MOCK_USERS[email];
      if (mockUser && password === "123456") {
        const session: Session = {
          user: mockUser,
          accessToken: `mock-token-${Date.now()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("aflow_session", JSON.stringify(session));
        }

        appLogger.auth("Login successful", { email, userId: mockUser.id });
        return session;
      }

      appLogger.warn("Login failed - invalid credentials", { email });
      return null;
    } catch (error) {
      appLogger.error("Login error", error);
      return null;
    }
  },

  /**
   * Cerrar sesión
   */
  async signOut(): Promise<void> {
    try {
      appLogger.auth("Logout");

      if (typeof window !== "undefined") {
        localStorage.removeItem("aflow_session");
      }

      await supabase.auth.signOut();
    } catch (error) {
      appLogger.error("Logout error", error);
    }
  },

  /**
   * Obtener sesión actual
   */
  async getSession(): Promise<Session | null> {
    try {
      if (typeof window === "undefined") return null;

      const sessionData = localStorage.getItem("aflow_session");
      if (!sessionData) return null;

      const session: Session = JSON.parse(sessionData);

      // Verificar expiración
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem("aflow_session");
        return null;
      }

      return session;
    } catch (error) {
      appLogger.error("Get session error", error);
      return null;
    }
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      return session?.user || null;
    } catch (error) {
      appLogger.error("Get current user error", error);
      return null;
    }
  },

  /**
   * Verificar si hay una sesión activa
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
    try {
      appLogger.user("Update profile", userId, data);

      const session = await this.getSession();
      if (!session || session.user.id !== userId) {
        throw new Error("Unauthorized");
      }

      const updatedUser: User = {
        ...session.user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Actualizar mock user
      MOCK_USERS[updatedUser.email] = updatedUser;

      // Actualizar sesión
      const updatedSession: Session = {
        ...session,
        user: updatedUser,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("aflow_session", JSON.stringify(updatedSession));
      }

      return updatedUser;
    } catch (error) {
      appLogger.error("Update profile error", error);
      return null;
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      appLogger.user("Change password");

      // Mock: siempre exitoso si la contraseña actual es correcta
      if (currentPassword === "123456") {
        return true;
      }

      return false;
    } catch (error) {
      appLogger.error("Change password error", error);
      return false;
    }
  },
};

export default auth;
