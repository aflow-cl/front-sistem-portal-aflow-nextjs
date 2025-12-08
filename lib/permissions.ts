import { ROLES, type UserRole } from "./constants";

/**
 * Define los módulos disponibles para cada rol
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.ADMIN]: [
    "cotizacion",
    "comex",
    "guardia",
    "finanzas",
    "clientes",
    "micuenta",
    "contratante",
    "settings",
  ],
  [ROLES.ANALISTA]: ["cotizacion", "clientes", "micuenta", "contratante"],
  [ROLES.OPERADOR]: ["guardia", "micuenta"],
};

/**
 * Verifica si un usuario tiene permiso para acceder a un módulo
 */
export function hasPermission(role: UserRole, module: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(module);
}

/**
 * Obtiene todos los módulos permitidos para un rol
 */
export function getPermittedModules(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Verifica si el usuario es administrador
 */
export function isAdmin(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Verifica si el usuario es analista
 */
export function isAnalista(role: UserRole): boolean {
  return role === ROLES.ANALISTA;
}

/**
 * Verifica si el usuario es operador
 */
export function isOperador(role: UserRole): boolean {
  return role === ROLES.OPERADOR;
}
