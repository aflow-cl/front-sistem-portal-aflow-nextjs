/**
 * Tipos para el módulo Mi Cuenta
 */

export interface ProfileFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cargo: string;
  departamento: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: "light" | "dark" | "system";
  language: "es" | "en";
  timezone: string;
}
