import { auth } from "@/data/supabase/auth";
import { appLogger } from "@/core/logging/logger";
import type { User } from "@/types";
import type { ProfileFormData, ChangePasswordFormData, UserPreferences } from "../types/miCuenta";

/**
 * Servicio para el módulo Mi Cuenta
 */
export const miCuentaService = {
  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, data: ProfileFormData): Promise<User | null> {
    try {
      appLogger.user("Update profile request", userId, data);

      const updatedUser = await auth.updateProfile(userId, data);

      if (!updatedUser) {
        throw new Error("Error al actualizar perfil");
      }

      appLogger.user("Profile updated successfully", userId);
      return updatedUser;
    } catch (error) {
      appLogger.error("Update profile error", error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(data: ChangePasswordFormData): Promise<boolean> {
    try {
      appLogger.user("Change password request");

      const success = await auth.changePassword(
        data.currentPassword,
        data.newPassword
      );

      if (!success) {
        throw new Error("Contraseña actual incorrecta");
      }

      appLogger.user("Password changed successfully");
      return true;
    } catch (error) {
      appLogger.error("Change password error", error);
      throw error;
    }
  },

  /**
   * Obtener preferencias del usuario
   */
  async getPreferences(userId: string): Promise<UserPreferences> {
    try {
      // Mock: retornar preferencias por defecto
      const preferences: UserPreferences = {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        theme: "light",
        language: "es",
        timezone: "America/Santiago",
      };

      return preferences;
    } catch (error) {
      appLogger.error("Get preferences error", error);
      throw error;
    }
  },

  /**
   * Actualizar preferencias del usuario
   */
  async updatePreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<boolean> {
    try {
      appLogger.user("Update preferences", userId, preferences);

      // Mock: simular actualización exitosa
      await new Promise((resolve) => setTimeout(resolve, 500));

      appLogger.user("Preferences updated successfully", userId);
      return true;
    } catch (error) {
      appLogger.error("Update preferences error", error);
      throw error;
    }
  },
};
