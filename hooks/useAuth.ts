"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, Session, LoginCredentials } from "@/types";
import {
  loginMock,
  logoutMock,
  getSession,
  isAuthenticated,
} from "@/data/supabase/auth";
import { log } from "@/lib/pino-client";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication management
 * Handles login, logout, and session state
 */
export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const session = getSession();
        if (session) {
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
          });
          log.info("Session restored", { userId: session.user.id });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        log.error("Error initializing auth", error as Error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const { session, error } = await loginMock(credentials);

        if (error || !session) {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return { success: false, error: error || "Error desconocido" };
        }

        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
        });

        log.info("Login successful via hook", { userId: session.user.id });

        return { success: true, error: null };
      } catch (error) {
        log.error("Login error in hook", error as Error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return { success: false, error: "Error al iniciar sesión" };
      }
    },
    []
  );

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      await logoutMock();
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
      log.info("Logout successful via hook");
      router.push("/login");
    } catch (error) {
      log.error("Logout error", error as Error);
    }
  }, [router]);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    return isAuthenticated();
  }, []);

  return {
    user: authState.user,
    session: authState.session,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
