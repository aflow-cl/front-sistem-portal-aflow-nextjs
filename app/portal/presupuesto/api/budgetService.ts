import type { Budget, IndicatorData, CreateBudgetInput, AccionHistoria } from "@/types/presupuesto";

/**
 * Simulated API service for Budget operations
 * Uses promises with delays to simulate real API behavior
 */

// Mock data
const MOCK_BUDGETS: Budget[] = [
  {
    id: "1",
    folio: "COT-2025-001",
    cliente: "Constructora Andes S.A.",
    fecha: "2025-12-01",
    estado: "Aprobado",
    monto: 45000000,
    neto: 37815000,
    autor: "Juan Pérez",
    fechaCierre: "2025-12-15",
    descripcion: "Proyecto de construcción residencial - Torre Norte",
    documentoUrl: "/documents/COT-2025-001.pdf"
  },
  {
    id: "2",
    folio: "COT-2025-002",
    cliente: "Servicios Digitales Ltda.",
    fecha: "2025-12-03",
    estado: "Pendiente",
    monto: 28500000,
    neto: 23950000,
    autor: "María González",
    fechaCierre: "2025-12-20",
    descripcion: "Desarrollo de plataforma web corporativa",
    documentoUrl: "/documents/COT-2025-002.pdf"
  },
  {
    id: "3",
    folio: "COT-2025-003",
    cliente: "Comercial del Sur S.A.",
    fecha: "2025-12-05",
    estado: "En revisión",
    monto: 51500000,
    neto: 43277000,
    autor: "Carlos Ramírez",
    fechaCierre: "2025-12-18",
    descripcion: "Sistema de inventario y ventas integrado",
    documentoUrl: "/documents/COT-2025-003.pdf"
  },
  {
    id: "4",
    folio: "COT-2025-004",
    cliente: "Inmobiliaria del Sur",
    fecha: "2025-12-07",
    estado: "Borrador",
    monto: 35000000,
    neto: 29412000,
    autor: "Juan Pérez",
    fechaCierre: "2025-12-25",
    descripcion: "Portal de propiedades online con tours virtuales",
    documentoUrl: "/documents/COT-2025-004.pdf"
  },
  {
    id: "5",
    folio: "COT-2025-005",
    cliente: "Tecnología Avanzada SpA",
    fecha: "2025-12-08",
    estado: "Aprobado",
    monto: 62000000,
    neto: 52101000,
    autor: "María González",
    fechaCierre: "2025-12-12",
    descripcion: "Implementación de ERP empresarial",
    documentoUrl: "/documents/COT-2025-005.pdf"
  },
  {
    id: "6",
    folio: "COT-2025-006",
    cliente: "Minera Los Andes",
    fecha: "2025-11-28",
    estado: "Rechazado",
    monto: 98000000,
    neto: 82353000,
    autor: "Ana Silva",
    fechaCierre: "2025-12-05",
    descripcion: "Sistema de gestión de operaciones mineras",
    documentoUrl: "/documents/COT-2025-006.pdf"
  },
  {
    id: "7",
    folio: "COT-2025-007",
    cliente: "Clínica Santa María",
    fecha: "2025-12-10",
    estado: "En revisión",
    monto: 42000000,
    neto: 35294000,
    autor: "Carlos Ramírez",
    fechaCierre: "2025-12-22",
    descripcion: "Sistema de gestión hospitalaria integrado",
    documentoUrl: "/documents/COT-2025-007.pdf"
  },
  {
    id: "8",
    folio: "COT-2025-008",
    cliente: "Retail Express",
    fecha: "2025-12-09",
    estado: "Pendiente",
    monto: 31000000,
    neto: 26050000,
    autor: "Ana Silva",
    fechaCierre: "2025-12-30",
    descripcion: "E-commerce multi-tienda con app móvil",
    documentoUrl: "/documents/COT-2025-008.pdf"
  },
];

/**
 * Fetch all budgets from API
 * Simulates network delay of 1000ms
 */
export async function fetchBudgets(): Promise<Budget[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_BUDGETS]);
    }, 1000);
  });
}

/**
 * Fetch indicator/KPI data
 * Simulates instant response
 */
export async function fetchIndicators(): Promise<IndicatorData[]> {
  return Promise.resolve([
    { label: "Activos", value: 18, color: "bg-emerald-500" },
    { label: "En Revisión", value: 6, color: "bg-yellow-500" },
    { label: "Finalizados", value: 24, color: "bg-blue-500" },
    { label: "Cerrados", value: 9, color: "bg-gray-500" },
  ]);
}

/**
 * Create new budget
 * Simulates network delay of 800ms
 */
export async function createBudget(newBudget: CreateBudgetInput): Promise<Budget> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const budget: Budget = {
        id: String(Date.now()),
        folio: `P-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        cliente: newBudget.cliente,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Borrador",
        monto: newBudget.monto,
        descripcion: newBudget.descripcion,
      };
      resolve(budget);
    }, 800);
  });
}

// ============================================
// HISTORIA DE ACCIONES
// ============================================

// Mock data para historia de acciones
const MOCK_HISTORIA: AccionHistoria[] = [
  {
    id: "h1",
    folio: "P-001",
    tipo: "creado",
    descripcion: "Presupuesto creado",
    usuario: "Juan Pérez",
    fecha: "2025-12-01T10:30:00Z",
    detalles: {
      cliente: "Constructora Andes",
      monto: 45000
    }
  },
  {
    id: "h2",
    folio: "P-001",
    tipo: "modificado",
    descripcion: "Monto actualizado",
    usuario: "Juan Pérez",
    fecha: "2025-12-01T14:15:00Z",
    detalles: {
      campo: "monto",
      valorAnterior: "42000",
      valorNuevo: "45000"
    }
  },
  {
    id: "h3",
    folio: "P-001",
    tipo: "cambio_estado",
    descripcion: "Estado cambiado de Borrador a En revisión",
    usuario: "María González",
    fecha: "2025-12-02T09:00:00Z",
    detalles: {
      estadoAnterior: "Borrador",
      estadoNuevo: "En revisión"
    }
  },
  {
    id: "h4",
    folio: "P-002",
    tipo: "creado",
    descripcion: "Presupuesto creado",
    usuario: "Carlos Ramírez",
    fecha: "2025-12-03T11:20:00Z",
    detalles: {
      cliente: "Servicios Digitales Ltda.",
      monto: 28500
    }
  },
  {
    id: "h5",
    folio: "P-002",
    tipo: "enviado",
    descripcion: "Presupuesto enviado al cliente",
    usuario: "Carlos Ramírez",
    fecha: "2025-12-03T15:30:00Z",
    detalles: {
      email: "cliente@serviciosdigitales.com"
    }
  },
  {
    id: "h6",
    folio: "P-002",
    tipo: "aprobado",
    descripcion: "Presupuesto aprobado por el cliente",
    usuario: "Sistema",
    fecha: "2025-12-04T10:45:00Z",
    detalles: {
      aprobadoPor: "cliente@serviciosdigitales.com"
    }
  },
  {
    id: "h7",
    folio: "P-002",
    tipo: "cambio_estado",
    descripcion: "Estado cambiado a Finalizado",
    usuario: "Carlos Ramírez",
    fecha: "2025-12-10T16:00:00Z",
    detalles: {
      estadoAnterior: "Aprobado",
      estadoNuevo: "Finalizado"
    }
  },
  {
    id: "h8",
    folio: "P-003",
    tipo: "creado",
    descripcion: "Presupuesto creado",
    usuario: "Ana Silva",
    fecha: "2025-12-05T08:30:00Z",
    detalles: {
      cliente: "Comercial S.A.",
      monto: 51500
    }
  },
  {
    id: "h9",
    folio: "P-003",
    tipo: "comentario",
    descripcion: "Comentario agregado: Cliente solicitó agregar módulo adicional",
    usuario: "Ana Silva",
    fecha: "2025-12-06T14:20:00Z"
  },
  {
    id: "h10",
    folio: "P-004",
    tipo: "creado",
    descripcion: "Presupuesto creado",
    usuario: "Juan Pérez",
    fecha: "2025-12-07T10:00:00Z",
    detalles: {
      cliente: "Inmobiliaria del Sur",
      monto: 35000
    }
  },
  {
    id: "h11",
    folio: "P-005",
    tipo: "creado",
    descripcion: "Presupuesto creado",
    usuario: "María González",
    fecha: "2025-12-08T09:15:00Z",
    detalles: {
      cliente: "Tecnología Avanzada",
      monto: 62000
    }
  },
  {
    id: "h12",
    folio: "P-005",
    tipo: "cambio_estado",
    descripcion: "Estado cambiado de Borrador a En revisión",
    usuario: "María González",
    fecha: "2025-12-08T11:30:00Z",
    detalles: {
      estadoAnterior: "Borrador",
      estadoNuevo: "En revisión"
    }
  },
  {
    id: "h13",
    folio: "P-003",
    tipo: "rechazado",
    descripcion: "Presupuesto rechazado por el cliente",
    usuario: "Sistema",
    fecha: "2025-12-09T13:00:00Z",
    detalles: {
      motivo: "Presupuesto excede el monto disponible"
    }
  },
];

/**
 * Fetch action history
 * Can be filtered by folio
 */
export async function fetchHistoria(folio?: string): Promise<AccionHistoria[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const historia = folio 
        ? MOCK_HISTORIA.filter(h => h.folio === folio)
        : [...MOCK_HISTORIA];
      // Sort by date descending (most recent first)
      historia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      resolve(historia);
    }, 600);
  });
}

