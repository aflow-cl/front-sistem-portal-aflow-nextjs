import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS de manera eficiente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un RUT chileno
 */
export function formatRut(rut: string): string {
  const cleaned = rut.replace(/[^0-9kK]/g, "");
  if (cleaned.length < 2) return cleaned;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

/**
 * Valida un RUT chileno usando el algoritmo del módulo 11
 */
export function validateRut(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9kK]/g, "");
  if (cleaned.length < 2) return false;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDv = 11 - (sum % 11);
  const expectedDvStr = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString();
  
  return dv === expectedDvStr;
}

/**
 * Formatea un número de teléfono chileno
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `+56 9 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return phone;
}

/**
 * Debounce para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formatea una fecha en formato chileno
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Manejo de errores con mensaje amigable
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Ha ocurrido un error inesperado";
}
