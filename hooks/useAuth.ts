"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/data/supabase/auth";
import type { User, Session } from "@/types";
import { ROUTES } from "@/lib/constants";

/**
 * Hook personalizado para manejar la autenticación
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const currentSession = await auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar sesión");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const newSession = await auth.signIn(email, password);
      
      if (!newSession) {
        setError("Credenciales inválidas");
        return false;
      }

      setSession(newSession);
      setUser(newSession.user);
      
      router.push(ROUTES.DASHBOARD);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setSession(null);
      setUser(null);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error("No hay usuario autenticado");
      
      setLoading(true);
      const updatedUser = await auth.updateProfile(user.id, data);
      
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar perfil");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut,
    updateProfile,
    checkSession,
  };
}
