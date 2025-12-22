/**
 * Tipos y configuraciones para el módulo de Histórico de Contratantes
 */

import { formatCurrency as formatCurrencyUtil } from "@/lib/utils";

export type EstadoPresupuesto = 
  | "Borrador" 
  | "Pendiente" 
  | "Aprobado" 
  | "Rechazado" 
  | "En Proceso"
  | "Finalizado"
  | "Cancelado";

export interface PresupuestoHistorico {
  id: string;
  folio: string;
  contratante: {
    id: string;
    nombre: string;
    rut: string;
  };
  fechaInicio: string; // ISO date string
  fechaFin?: string; // ISO date string
  estado: EstadoPresupuesto;
  neto: number;
  iva: number;
  total: number;
  documentoUrl?: string;
  linkCompartir?: string;
  observaciones?: string;
  creadoPor?: string;
  fechaCreacion?: string;
  ultimaModificacion?: string;
}

export interface HistoricoFilters {
  busqueda: string;
  estado: EstadoPresupuesto | "all";
  contratanteId: string;
  fechaDesde?: string;
  fechaHasta?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  ordenarPor: "folio" | "fecha" | "monto" | "estado";
  ordenDireccion: "asc" | "desc";
}

export interface HistoricoStats {
  total: number;
  totalNeto: number;
  totalIva: number;
  totalGeneral: number;
  porEstado: Record<EstadoPresupuesto, number>;
  promedioMonto: number;
}

export const ESTADO_PRESUPUESTO_CONFIG: Record<
  EstadoPresupuesto,
  {
    label: string;
    badgeClass: string;
    icon: string;
  }
> = {
  Borrador: {
    label: "Borrador",
    badgeClass: "bg-gray-100 text-gray-800 border-gray-300",
    icon: "FileEdit",
  },
  Pendiente: {
    label: "Pendiente",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "Clock",
  },
  Aprobado: {
    label: "Aprobado",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
    icon: "CheckCircle2",
  },
  Rechazado: {
    label: "Rechazado",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    icon: "XCircle",
  },
  "En Proceso": {
    label: "En Proceso",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "RefreshCw",
  },
  Finalizado: {
    label: "Finalizado",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "CheckCheck",
  },
  Cancelado: {
    label: "Cancelado",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
    icon: "Ban",
  },
};

// Re-exportar formatCurrency desde utils para mantener compatibilidad
export const formatCurrency = formatCurrencyUtil;

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
