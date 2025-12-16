/**
 * Sistema de tipos para el módulo Maestro de Negocio
 * Contiene todas las interfaces y tipos para Contratantes, Proveedores, Servicios y Packs
 */

// ============================================
// TIPOS BASE Y ENUMS
// ============================================

export type TipoPersona = "persona-natural" | "empresa";
export type EstadoRegistro = "Activo" | "Inactivo";
export type UnidadMedida = "UN" | "M2" | "M3" | "ML" | "KG" | "HR" | "GL" | "DIA";

// ============================================
// DIRECCIÓN / SUCURSAL
// ============================================

export interface Direccion {
  id: string;
  nombre: string;
  regionId: string;
  regionNombre?: string;
  ciudadId: string;
  ciudadNombre?: string;
  comuna: string;
  calle: string;
  numero: string;
  complemento?: string;
  esPrincipal: boolean;
  contactoNombre?: string;
  contactoTelefono?: string;
  contactoEmail?: string;
  activa: boolean;
}

// ============================================
// CONTRATANTE
// ============================================

export interface ContratanteBase {
  id: string;
  tipoPersona: TipoPersona;
  rut: string;
  email: string;
  telefono: string;
  estado: EstadoRegistro;
  fechaCreacion: string;
  fechaActualizacion: string;
  direcciones: Direccion[];
  notas?: string;
}

export interface PersonaNatural extends ContratanteBase {
  tipoPersona: "persona-natural";
  nombres: string;
  apellidos: string;
  razonSocial?: never;
  giro?: never;
}

export interface Empresa extends ContratanteBase {
  tipoPersona: "empresa";
  razonSocial: string;
  giro: string;
  nombres?: never;
  apellidos?: never;
}

export type Contratante = PersonaNatural | Empresa;

// ============================================
// INPUTS PARA FORMULARIOS
// ============================================

export interface CreateContratanteInput {
  tipoPersona: TipoPersona;
  rut: string;
  // Campos condicionales según tipo
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  giro?: string;
  // Campos comunes
  email: string;
  telefono: string;
  estado: EstadoRegistro;
  notas?: string;
}

export interface UpdateContratanteInput extends Partial<CreateContratanteInput> {
  id: string;
}

export interface CreateDireccionInput {
  contratanteId: string;
  nombre: string;
  regionId: string;
  ciudadId: string;
  comuna: string;
  calle: string;
  numero: string;
  complemento?: string;
  esPrincipal: boolean;
  contactoNombre?: string;
  contactoTelefono?: string;
  contactoEmail?: string;
}

// ============================================
// PROVEEDOR
// ============================================

export interface ProveedorBase {
  id: string;
  tipoPersona: TipoPersona;
  rut: string;
  email: string;
  telefono: string;
  estado: EstadoRegistro;
  esProveedorDefault: boolean; // Flag para "Empresa del cliente AFLOW"
  fechaCreacion: string;
  fechaActualizacion: string;
  productos: Producto[];
  direcciones: Direccion[];
  notas?: string;
}

export interface ProveedorPersonaNatural extends ProveedorBase {
  tipoPersona: "persona-natural";
  nombres: string;
  apellidos: string;
  razonSocial?: never;
  giro?: never;
}

export interface ProveedorEmpresa extends ProveedorBase {
  tipoPersona: "empresa";
  razonSocial: string;
  giro: string;
  nombres?: never;
  apellidos?: never;
}

export type Proveedor = ProveedorPersonaNatural | ProveedorEmpresa;

// ============================================
// PRODUCTO
// ============================================

export interface Producto {
  id: string;
  proveedorId: string;
  nombre: string;
  descripcion: string;
  valorInterno: number;
  unidadMedida: UnidadMedida;
  estado: EstadoRegistro;
  codigo?: string; // SKU o código interno
  categoria?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateProductoInput {
  proveedorId: string;
  nombre: string;
  descripcion: string;
  valorInterno: number;
  unidadMedida: UnidadMedida;
  estado: EstadoRegistro;
  codigo?: string;
  categoria?: string;
}

export interface UpdateProductoInput extends Partial<CreateProductoInput> {
  id: string;
}

// ============================================
// PROVEEDOR INPUTS
// ============================================

export interface CreateProveedorInput {
  tipoPersona: TipoPersona;
  rut: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  giro?: string;
  email: string;
  telefono: string;
  estado: EstadoRegistro;
  notas?: string;
}

export interface UpdateProveedorInput extends Partial<CreateProveedorInput> {
  id: string;
}

// ============================================
// SERVICIO
// ============================================

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  valorBase: number;
  estado: EstadoRegistro;
  categoria?: string;
  codigo?: string;
  unidadMedida?: UnidadMedida;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateServicioInput {
  nombre: string;
  descripcion: string;
  valorBase: number;
  estado: EstadoRegistro;
  categoria?: string;
  codigo?: string;
  unidadMedida?: UnidadMedida;
}

export interface UpdateServicioInput extends Partial<CreateServicioInput> {
  id: string;
}

// ============================================
// PACK DE SERVICIOS
// ============================================

export interface PackServicioItem {
  tipo: "servicio" | "producto";
  id: string; // ID del servicio o producto
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PackServicio {
  id: string;
  nombre: string;
  descripcion: string;
  items: PackServicioItem[];
  valorTotal: number;
  estado: EstadoRegistro;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreatePackServicioInput {
  nombre: string;
  descripcion: string;
  items: Omit<PackServicioItem, "valorTotal">[];
  estado: EstadoRegistro;
}

export interface UpdatePackServicioInput extends Partial<CreatePackServicioInput> {
  id: string;
}

// ============================================
// CONFIGURACIÓN DE ESTADOS
// ============================================

export const ESTADO_CONFIG: Record<EstadoRegistro, {
  label: string;
  color: string;
  badgeClass: string;
  description: string;
}> = {
  "Activo": {
    label: "Activo",
    color: "bg-green-500",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    description: "Registro activo y disponible",
  },
  "Inactivo": {
    label: "Inactivo",
    color: "bg-gray-500",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Registro deshabilitado",
  },
};

// ============================================
// FILTROS
// ============================================

export interface ContratanteFilters {
  busqueda: string; // RUT, nombre, razón social, email
  tipoPersona: TipoPersona | "all";
  estado: EstadoRegistro | "all";
}

export interface ProveedorFilters {
  busqueda: string;
  tipoPersona: TipoPersona | "all";
  estado: EstadoRegistro | "all";
  esProveedorDefault?: boolean;
}

export interface ServicioFilters {
  busqueda: string;
  categoria: string;
  estado: EstadoRegistro | "all";
}

export interface ProductoFilters {
  busqueda: string;
  categoria: string;
  estado: EstadoRegistro | "";
  proveedorId: string;
}

// ============================================
// HELPER FUNCTIONS PARA TIPOS
// ============================================

export function getDisplayName(entidad: Contratante | Proveedor): string {
  if (entidad.tipoPersona === "persona-natural") {
    return `${entidad.nombres} ${entidad.apellidos}`;
  }
  return entidad.razonSocial;
}

export function getDireccionCompleta(direccion: Direccion): string {
  const parts = [
    direccion.calle,
    direccion.numero,
    direccion.complemento,
    direccion.comuna,
    direccion.ciudadNombre,
    direccion.regionNombre,
  ].filter(Boolean);
  
  return parts.join(", ");
}

export function isPersonaNatural(entidad: Contratante | Proveedor): entidad is PersonaNatural | ProveedorPersonaNatural {
  return entidad.tipoPersona === "persona-natural";
}

export function isEmpresa(entidad: Contratante | Proveedor): entidad is Empresa | ProveedorEmpresa {
  return entidad.tipoPersona === "empresa";
}
