/**
 * Servicio API para el módulo de Histórico de Contratantes
 */

import { PresupuestoHistorico } from "../types/historico";

// Mock data para desarrollo - Reemplazar con API real
const mockHistorico: PresupuestoHistorico[] = [
  {
    id: "1",
    folio: "PRES-2024-0001",
    contratante: {
      id: "cont-1",
      nombre: "Constructora Los Andes S.A.",
      rut: "76.123.456-7",
    },
    fechaInicio: "2024-01-15T10:30:00Z",
    fechaFin: "2024-02-28T18:00:00Z",
    estado: "Finalizado",
    neto: 15000000,
    iva: 2850000,
    total: 17850000,
    documentoUrl: "/documents/PRES-2024-0001.pdf",
    linkCompartir: "https://portal.aflow.cl/presupuestos/1",
    observaciones: "Proyecto completado exitosamente",
    creadoPor: "Juan Pérez",
    fechaCreacion: "2024-01-15T10:30:00Z",
    ultimaModificacion: "2024-02-28T18:00:00Z",
  },
  {
    id: "2",
    folio: "PRES-2024-0015",
    contratante: {
      id: "cont-2",
      nombre: "Inmobiliaria Central",
      rut: "77.654.321-8",
    },
    fechaInicio: "2024-03-10T09:00:00Z",
    estado: "Aprobado",
    neto: 8500000,
    iva: 1615000,
    total: 10115000,
    documentoUrl: "/documents/PRES-2024-0015.pdf",
    linkCompartir: "https://portal.aflow.cl/presupuestos/2",
    creadoPor: "María González",
    fechaCreacion: "2024-03-10T09:00:00Z",
    ultimaModificacion: "2024-03-12T14:30:00Z",
  },
  {
    id: "3",
    folio: "PRES-2024-0023",
    contratante: {
      id: "cont-3",
      nombre: "Edificaciones Modernas Ltda.",
      rut: "78.987.654-3",
    },
    fechaInicio: "2024-05-20T11:15:00Z",
    estado: "En Proceso",
    neto: 25000000,
    iva: 4750000,
    total: 29750000,
    documentoUrl: "/documents/PRES-2024-0023.pdf",
    linkCompartir: "https://portal.aflow.cl/presupuestos/3",
    creadoPor: "Carlos Rodríguez",
    fechaCreacion: "2024-05-20T11:15:00Z",
    ultimaModificacion: "2024-06-15T16:45:00Z",
  },
  {
    id: "4",
    folio: "PRES-2024-0032",
    contratante: {
      id: "cont-1",
      nombre: "Constructora Los Andes S.A.",
      rut: "76.123.456-7",
    },
    fechaInicio: "2024-07-05T13:00:00Z",
    estado: "Pendiente",
    neto: 12000000,
    iva: 2280000,
    total: 14280000,
    documentoUrl: "/documents/PRES-2024-0032.pdf",
    linkCompartir: "https://portal.aflow.cl/presupuestos/4",
    observaciones: "Esperando aprobación del cliente",
    creadoPor: "Ana Silva",
    fechaCreacion: "2024-07-05T13:00:00Z",
    ultimaModificacion: "2024-07-06T10:20:00Z",
  },
  {
    id: "5",
    folio: "PRES-2024-0041",
    contratante: {
      id: "cont-4",
      nombre: "Desarrollos Urbanos S.A.",
      rut: "79.111.222-4",
    },
    fechaInicio: "2024-09-12T08:30:00Z",
    estado: "Rechazado",
    neto: 5500000,
    iva: 1045000,
    total: 6545000,
    documentoUrl: "/documents/PRES-2024-0041.pdf",
    linkCompartir: "https://portal.aflow.cl/presupuestos/5",
    observaciones: "Cliente solicitó cotización con otro proveedor",
    creadoPor: "Luis Morales",
    fechaCreacion: "2024-09-12T08:30:00Z",
    ultimaModificacion: "2024-09-18T17:00:00Z",
  },
  {
    id: "6",
    folio: "PRES-2024-0055",
    contratante: {
      id: "cont-2",
      nombre: "Inmobiliaria Central",
      rut: "77.654.321-8",
    },
    fechaInicio: "2024-11-03T10:00:00Z",
    estado: "Borrador",
    neto: 18500000,
    iva: 3515000,
    total: 22015000,
    creadoPor: "Patricia Torres",
    fechaCreacion: "2024-11-03T10:00:00Z",
    ultimaModificacion: "2024-11-05T15:30:00Z",
  },
];

/**
 * Obtiene el histórico de presupuestos
 */
export const fetchHistoricoPresupuestos = async (): Promise<PresupuestoHistorico[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Reemplazar con llamada real a la API cuando el backend esté listo
  return mockHistorico;
};

/**
 * Obtiene un presupuesto por ID
 */
export const fetchPresupuestoById = async (id: string): Promise<PresupuestoHistorico | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Reemplazar con llamada real a la API cuando el backend esté listo
  const presupuesto = mockHistorico.find((p) => p.id === id);
  return presupuesto || null;
};

/**
 * Obtiene presupuestos por contratante
 */
export const fetchPresupuestosByContratante = async (
  contratanteId: string
): Promise<PresupuestoHistorico[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // TODO: Reemplazar con llamada real a la API cuando el backend esté listo
  return mockHistorico.filter((p) => p.contratante.id === contratanteId);
};

/**
 * Descarga el documento del presupuesto
 */
export const downloadPresupuestoDocument = async (presupuesto: PresupuestoHistorico): Promise<void> => {
  // TODO: Implementar descarga real cuando el backend esté listo
  alert(`Descargando: ${presupuesto.folio}.pdf`);
};

/**
 * Copia el link de compartir al portapapeles
 */
export const copyShareLink = async (presupuesto: PresupuestoHistorico): Promise<void> => {
  if (!presupuesto.linkCompartir) {
    throw new Error("No hay link para compartir");
  }

  try {
    await navigator.clipboard.writeText(presupuesto.linkCompartir);
  } catch {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = presupuesto.linkCompartir;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};
