export interface Budget {
  id: string;
  folio: string;
  cliente: string;
  fecha: string;
  estado: "Borrador" | "En revisión" | "En proceso" | "Finalizado" | "Cerrado" | "Aprobado" | "Rechazado" | "Pendiente";
  monto?: number;
  neto?: number;
  autor?: string;
  fechaCierre?: string;
  descripcion?: string;
  documentoUrl?: string;
}

export interface IndicatorData {
  label: string;
  value: number;
  color: string;
}

export interface FilterState {
  cliente: string;
  estado: string;
  fecha: string;
  fechaInicio?: string;
  fechaFin?: string;
  autor?: string;
  montoMin?: number;
  montoMax?: number;
  folio?: string;
  fechaCierreInicio?: string;
  fechaCierreFin?: string;
}

export type SortField = 'folio' | 'cliente' | 'fecha' | 'monto' | 'neto' | 'estado' | 'autor' | 'fechaCierre';
export type SortDirection = 'asc' | 'desc';

export interface CreateBudgetInput {
  cliente: string;
  proyecto?: string;
  estado?: "Borrador" | "En revisión" | "Aprobado" | "Rechazado" | "Enviado";
  items?: any[];
  subtotal?: number;
  iva?: number;
  total?: number;
  moneda?: string;
  observaciones?: string;
  descripcion?: string;
  monto?: number;
}

// ============================================
// TIPOS EXTENDIDOS PARA PRESUPUESTOS COMPLETOS
// ============================================

export type EstadoPresupuesto = "Borrador" | "En revisión" | "Aprobado" | "Rechazado" | "Enviado";
export type Moneda = "CLP" | "USD" | "EUR";
export type UnidadMedida = "UN" | "M2" | "M3" | "KG" | "LT" | "HR" | "DIA" | "MES";
export type FormatoDocumento = "Vertical" | "Horizontal";

export interface BudgetItem {
  id: string;
  producto: string;
  descripcion: string;
  unidadMedida: UnidadMedida;
  cantidad: number;
  precioUnitario: number;
  iva: number; // Porcentaje (ej: 19)
  utilidad: number; // Porcentaje de margen
  total: number; // Calculado automáticamente
}

export interface ClienteInfo {
  nombre: string;
  direccion: string;
  email: string;
  telefono: string;
}

export interface PersonalizacionVisual {
  logo?: File | null;
  colorPrincipal: string;
  formato: FormatoDocumento;
  columnasVisibles: {
    cantidad: boolean;
    precioUnitario: boolean;
    iva: boolean;
    utilidad: boolean;
    total: boolean;
  };
}

export interface CondicionesComerciales {
  descuentoPorcentaje: number;
  descuentoMonto: number;
  condicionesPago: string;
  observacionesInternas: string;
}

export interface BudgetFormData {
  // 1. Datos Generales
  folio: string; // readonly
  fechaCreacion: string;
  cliente: ClienteInfo;
  proyecto: string;
  estado: EstadoPresupuesto;
  moneda: Moneda;
  tipoCambio: number;

  // 2. Ítems del Presupuesto
  items: BudgetItem[];

  // 3. Totales y Condiciones
  subtotal: number; // readonly, calculado
  ivaTotal: number; // readonly, calculado
  totalGeneral: number; // readonly, calculado
  condiciones: CondicionesComerciales;

  // 4. Personalización Visual
  personalizacion: PersonalizacionVisual;

  // 5. Envío
  adjuntarPDF: boolean;

  // 6. Controles Internos (hidden)
  usuarioCreador?: string;
  fechaModificacion?: string;
}

// ============================================
// TIPOS PARA HISTORIA DE ACCIONES
// ============================================

export type AccionTipo = 
  | "creado" 
  | "modificado" 
  | "cambio_estado" 
  | "enviado" 
  | "aprobado" 
  | "rechazado" 
  | "comentario"
  | "eliminado";

export interface AccionHistoria {
  id: string;
  folio: string; // Folio del presupuesto relacionado
  tipo: AccionTipo;
  descripcion: string;
  usuario: string;
  fecha: string; // ISO string
  detalles?: {
    estadoAnterior?: string;
    estadoNuevo?: string;
    campo?: string;
    valorAnterior?: string;
    valorNuevo?: string;
    [key: string]: any;
  };
}
