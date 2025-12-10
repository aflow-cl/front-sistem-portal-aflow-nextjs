/**
 * Core type definitions for AFLOW Portal
 */

// ============================================================================
// User & Authentication
// ============================================================================

export type UserRole = "admin" | "analista" | "operador";

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

export interface Session {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============================================================================
// Menu System
// ============================================================================

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  group: string;
  order?: number;
}

export interface MenuGroup {
  id: string;
  label: string;
  order: number;
  items: MenuItem[];
}

// ============================================================================
// API Responses
// ============================================================================

export interface ApiResponse<T = unknown> {
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

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
}
