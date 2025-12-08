/**
 * Tipos para el módulo Contratante
 */

export type TipoContratante = "natural" | "juridica";

export interface Contratante {
  id: string;
  tipo: TipoContratante;
  nombreCompleto?: string; // Para persona natural
  razonSocial?: string; // Para persona jurídica
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContratanteFormData {
  tipo: TipoContratante;
  nombreCompleto?: string;
  razonSocial?: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface ContratanteFilters {
  search?: string;
  tipo?: TipoContratante | "all";
  activo?: boolean | "all";
}
