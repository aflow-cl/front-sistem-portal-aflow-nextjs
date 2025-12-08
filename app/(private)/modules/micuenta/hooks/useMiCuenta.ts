"use client";

import { useState } from "react";
import { miCuentaService } from "../services/miCuenta.service";
import type { ProfileFormData, ChangePasswordFormData, UserPreferences } from "../types/miCuenta";
import type { LoadingState } from "@/types";

/**
 * Hook para manejar las operaciones de Mi Cuenta
 */
export function useMiCuenta() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, data: ProfileFormData) => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const updatedUser = await miCuentaService.updateProfile(userId, data);

      setState("success");
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar perfil";
      setError(errorMessage);
      setState("error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordFormData) => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const success = await miCuentaService.changePassword(data);

      setState("success");
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cambiar contraseña";
      setError(errorMessage);
      setState("error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPreferences = async (userId: string) => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const preferences = await miCuentaService.getPreferences(userId);

      setState("success");
      return preferences;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener preferencias";
      setError(errorMessage);
      setState("error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (userId: string, preferences: UserPreferences) => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const success = await miCuentaService.updatePreferences(userId, preferences);

      setState("success");
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar preferencias";
      setError(errorMessage);
      setState("error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    state,
    error,
    updateProfile,
    changePassword,
    getPreferences,
    updatePreferences,
  };
}
