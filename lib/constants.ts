/**
 * Constantes globales de la aplicación AFLOW Portal
 */

export const APP_NAME = "AFLOW Portal";
export const APP_VERSION = "1.0.0";

/**
 * Paleta de colores corporativa AFLOW
 */
export const COLORS = {
  ORANGE: "#FF7A00",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY_DARK: "#1A1A1A",
  GRAY_MEDIUM: "#4D4D4D",
  GRAY_LIGHT: "#EDEDED",
} as const;

/**
 * Roles de usuario
 */
export const ROLES = {
  ADMIN: "admin",
  ANALISTA: "analista",
  OPERADOR: "operador",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  MODULES: {
    COTIZACION: "/modules/cotizacion",
    COMEX: "/modules/comex",
    GUARDIA: "/modules/guardia",
    FINANZAS: "/modules/finanzas",
    CLIENTES: "/modules/clientes",
    MI_CUENTA: "/modules/micuenta",
    CONTRATANTE: "/modules/contratante",
  },
  SETTINGS: "/settings",
} as const;

/**
 * Endpoints de API
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    SESSION: "/api/auth/session",
  },
  MENU: "/api/menu",
  USERS: {
    BASE: "/api/users",
    PASSWORD: "/api/users/password",
  },
  CONTRATANTE: {
    BASE: "/api/contratante",
    BY_ID: (id: string) => `/api/contratante/${id}`,
  },
  HEALTHCHECK: "/api/healthcheck",
} as const;

/**
 * Mensajes de la aplicación
 */
export const MESSAGES = {
  LOGIN: {
    SUCCESS: "Inicio de sesión exitoso",
    ERROR: "Credenciales inválidas",
    REQUIRED: "Por favor ingrese sus credenciales",
  },
  LOGOUT: {
    SUCCESS: "Sesión cerrada exitosamente",
  },
  SAVE: {
    SUCCESS: "Cambios guardados exitosamente",
    ERROR: "Error al guardar los cambios",
  },
  DELETE: {
    SUCCESS: "Eliminado exitosamente",
    ERROR: "Error al eliminar",
    CONFIRM: "¿Está seguro que desea eliminar este registro?",
  },
  REQUIRED_FIELD: "Este campo es requerido",
  INVALID_EMAIL: "Email inválido",
  INVALID_RUT: "RUT inválido",
  INVALID_PHONE: "Teléfono inválido",
} as const;

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Timeouts y delays
 */
export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  API_TIMEOUT: 30000,
  TOAST_DURATION: 3000,
} as const;

/**
 * Tipos de contratante
 */
export const TIPO_CONTRATANTE = {
  NATURAL: "natural",
  JURIDICA: "juridica",
} as const;

export type TipoContratante = (typeof TIPO_CONTRATANTE)[keyof typeof TIPO_CONTRATANTE];

/**
 * Estados
 */
export const ESTADOS = {
  ACTIVO: true,
  INACTIVO: false,
} as const;

/**
 * Credenciales de prueba
 */
export const MOCK_CREDENTIALS = {
  EMAIL: "test@aflow.cl",
  PASSWORD: "123456",
} as const;
