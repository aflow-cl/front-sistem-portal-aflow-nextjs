// ============================================
// TIPOS - CLIENTES
// ============================================

export type TipoPersona = "persona-natural" | "empresa";

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  email: string;
  activa: boolean;
  createdAt: string;
}

export interface UsuarioCliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  perfilId: string;
  perfilNombre: string;
  sucursalId?: string;
  sucursalNombre?: string;
  activo: boolean;
  createdAt: string;
}

export interface ServicioContratado {
  id: string;
  servicioId: string;
  servicioNombre: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: "Activo" | "Pausado" | "Finalizado";
  tarifaMensual: number;
  planSeleccionado?: "Basic" | "Professional" | "Enterprise";
}

export interface Cliente {
  id: string;
  tipoPersona: TipoPersona;
  rut: string;
  // Campos persona natural
  nombres?: string;
  apellidos?: string;
  // Campos empresa
  razonSocial: string;
  nombreFantasia?: string;
  giro: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  contactoPrincipal: string;
  emailContacto: string;
  activo: boolean;
  sucursales: Sucursal[];
  usuarios: UsuarioCliente[];
  serviciosContratados: ServicioContratado[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteInput {
  tipoPersona: TipoPersona;
  rut: string;
  // Campos persona natural
  nombres?: string;
  apellidos?: string;
  // Campos empresa
  razonSocial?: string;
  nombreFantasia?: string;
  giro?: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  contactoPrincipal: string;
  emailContacto: string;
}

// Wizard Data Types
export interface ClienteBasicData {
  tipoPersona: TipoPersona;
  rut: string;
  // Persona Natural
  nombres?: string;
  apellidos?: string;
  // Empresa
  razonSocial?: string;
  nombreFantasia?: string;
  giro?: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
}

export interface SucursalData {
  nombre: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  email: string;
}

export interface UsuarioData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  perfilId: string;
}

export interface ServicioSeleccionado {
  servicioId: string;
  planSeleccionado: "Basic" | "Professional" | "Enterprise";
}

export interface ClienteWizardData {
  cliente: ClienteBasicData | null;
  sucursal: SucursalData | null;
  usuario: UsuarioData | null;
  servicios: ServicioSeleccionado[];
}

// ============================================
// TIPOS - PERFILES
// ============================================

export interface Permiso {
  id: string;
  modulo: string;
  submodulo?: string;
  accion: "Crear" | "Leer" | "Editar" | "Eliminar" | "Exportar";
  habilitado: boolean;
}

export interface Perfil {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: "Administrador" | "Supervisor" | "Operador" | "Consulta";
  color: string;
  permisos: Permiso[];
  usuariosAsignados: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePerfilInput {
  nombre: string;
  descripcion: string;
  nivel: "Administrador" | "Supervisor" | "Operador" | "Consulta";
  permisos: Permiso[];
}

// ============================================
// TIPOS - OPCIONES DE MENÚ
// ============================================

export interface OpcionMenu {
  id: string;
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  visible: boolean;
  perfilesAsignados: string[]; // IDs de perfiles
  moduloPadre?: string;
  esSubmenu: boolean;
  descripcion?: string;
  activo: boolean;
}

// ============================================
// TIPOS - SERVICIOS
// ============================================

export interface TarifaServicio {
  plan: "Basic" | "Professional" | "Enterprise";
  precioMensual: number;
  precioAnual: number;
  descripcion: string;
  caracteristicas: string[];
}

export interface Servicio {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  categoria: "Software" | "Consultoría" | "Soporte" | "Infraestructura";
  tarifas: TarifaServicio[];
  activo: boolean;
  clientesActivos: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicioInput {
  nombre: string;
  codigo: string;
  descripcion: string;
  categoria: "Software" | "Consultoría" | "Soporte" | "Infraestructura";
  tarifas: TarifaServicio[];
}

// ============================================
// TIPOS - FILTROS Y ESTADO
// ============================================

export interface ClienteFilterState {
  busqueda: string;
  region: string;
  activo: string;
}

export interface PerfilFilterState {
  busqueda: string;
  nivel: string;
  activo: string;
}

export interface ServicioFilterState {
  busqueda: string;
  categoria: string;
  activo: string;
}

// ============================================
// TIPOS - DASHBOARD
// ============================================

export interface DashboardStats {
  totalClientes: number;
  clientesActivos: number;
  totalUsuarios: number;
  usuariosActivos: number;
  totalServicios: number;
  serviciosActivos: number;
  totalPerfiles: number;
  ingresosRecurrentes: number;
}

export interface ActividadReciente {
  id: string;
  tipo: "cliente" | "usuario" | "servicio" | "perfil";
  accion: "Creado" | "Editado" | "Eliminado" | "Activado" | "Desactivado";
  descripcion: string;
  usuario: string;
  fecha: string;
}

// ============================================
// TIPOS - RESPUESTAS API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
