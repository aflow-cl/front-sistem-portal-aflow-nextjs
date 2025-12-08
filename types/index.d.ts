/**
 * Tipos globales de la aplicación AFLOW Portal
 */

import { ROLES } from "@/lib/constants";

/**
 * Usuario del sistema
 */
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: UserRole;
  avatar?: string;
  telefono?: string;
  cargo?: string;
  departamento?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Roles de usuario
 */
export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Sesión de usuario
 */
export interface Session {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

/**
 * Item del menú
 */
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  group: string;
  order?: number;
}

/**
 * Grupo de menú
 */
export interface MenuGroup {
  id: string;
  label: string;
  order: number;
  items: MenuItem[];
}

/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Estado de carga
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Opciones de Select
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Breadcrumb
 */
export interface Breadcrumb {
  label: string;
  href?: string;
}

/**
 * Notificación/Toast
 */
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}
