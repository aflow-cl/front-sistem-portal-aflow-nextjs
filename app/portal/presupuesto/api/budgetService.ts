import type { Budget, IndicatorData, CreateBudgetInput, AccionHistoria, BudgetDetailedData, BudgetNote, DuplicateBudgetResult } from "@/types/presupuesto";

/**
 * Simulated API service for Budget operations
 * Uses promises with delays to simulate real API behavior
 */

// Estado configuration with colors and grouping
export const ESTADO_CONFIG = {
  "Borrador": {
    label: "Borrador",
    color: "bg-gray-500",
    badgeClass: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-300",
    group: "Activos",
  },
  "En revisión": {
    label: "En revisión",
    color: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-300",
    group: "Activos",
  },
  "En proceso": {
    label: "En proceso",
    color: "bg-indigo-500",
    badgeClass: "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-300",
    group: "Activos",
  },
  "Pendiente": {
    label: "Pendiente",
    color: "bg-yellow-500",
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300",
    group: "Pendientes",
  },
  "Aprobado": {
    label: "Aprobado",
    color: "bg-green-500",
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-100 border-green-300",
    group: "Finalizados",
  },
  "Rechazado": {
    label: "Rechazado",
    color: "bg-red-500",
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-100 border-red-300",
    group: "Finalizados",
  },
  "Finalizado": {
    label: "Finalizado",
    color: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300",
    group: "Finalizados",
  },
  "Cerrado": {
    label: "Cerrado",
    color: "bg-slate-500",
    badgeClass: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-300",
    group: "Finalizados",
  },
} as const;

// Indicator groups configuration
export const INDICATOR_GROUPS = {
  "Activos": {
    estados: ["Borrador", "En revisión", "En proceso"] as const,
    color: "bg-blue-500",
    description: "En desarrollo",
  },
  "Pendientes": {
    estados: ["Pendiente"] as const,
    color: "bg-yellow-500",
    description: "Esperando respuesta",
  },
  "Finalizados": {
    estados: ["Aprobado", "Rechazado", "Finalizado", "Cerrado"] as const,
    color: "bg-green-500",
    description: "Completados",
  },
} as const;

export type EstadoKey = keyof typeof ESTADO_CONFIG;
export type IndicatorGroup = keyof typeof INDICATOR_GROUPS;

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

// ============================================
// MÉTODOS PARA MÓDULO DE EDICIÓN
// ============================================

/**
 * Fetch budget by ID with detailed information
 */
export async function fetchBudgetById(id: string): Promise<BudgetDetailedData | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const budget = MOCK_BUDGETS.find(b => b.id === id);
      
      if (!budget) {
        resolve(null);
        return;
      }

      // Simulate detailed data with additional information
      const detailedBudget: BudgetDetailedData = {
        ...budget,
        proyecto: `Proyecto ${budget.folio}`,
        subtotal: budget.neto || 0,
        ivaTotal: (budget.monto || 0) - (budget.neto || 0),
        items: [
          {
            id: "item-1",
            producto: "Consultoría Técnica",
            descripcion: "Análisis y diseño de arquitectura",
            unidadMedida: "HR",
            cantidad: 120,
            precioUnitario: 50000,
            iva: 19,
            utilidad: 25,
            total: 6000000
          },
          {
            id: "item-2",
            producto: "Desarrollo Frontend",
            descripcion: "Implementación de interfaz de usuario",
            unidadMedida: "HR",
            cantidad: 200,
            precioUnitario: 45000,
            iva: 19,
            utilidad: 30,
            total: 9000000
          },
          {
            id: "item-3",
            producto: "Desarrollo Backend",
            descripcion: "API REST y base de datos",
            unidadMedida: "HR",
            cantidad: 180,
            precioUnitario: 48000,
            iva: 19,
            utilidad: 28,
            total: 8640000
          }
        ],
        cliente_info: {
          rut: "76.123.456-7",
          razonSocial: budget.cliente,
          giro: "Construcción y Servicios",
          direccion: "Av. Libertador Bernardo O'Higgins 1234",
          email: "contacto@empresa.cl",
          telefono: "+56 2 2345 6789",
          ciudad: "Santiago",
          region: "Metropolitana"
        },
        proyecto_info: {
          nombre: `Proyecto ${budget.folio}`,
          descripcion: budget.descripcion,
          tipoTrabajo: "Desarrollo",
          fechaInicio: budget.fecha,
          fechaTermino: budget.fechaCierre,
          responsable: budget.autor
        },
        createdBy: budget.autor,
        updatedBy: budget.autor,
        updatedAt: new Date().toISOString()
      };

      resolve(detailedBudget);
    }, 500);
  });
}

/**
 * Update budget
 */
export async function updateBudget(id: string, data: Partial<BudgetDetailedData>): Promise<BudgetDetailedData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const budgetIndex = MOCK_BUDGETS.findIndex(b => b.id === id);
      
      if (budgetIndex === -1) {
        throw new Error("Budget not found");
      }

      // Update the budget
      MOCK_BUDGETS[budgetIndex] = {
        ...MOCK_BUDGETS[budgetIndex],
        ...data,
        id, // Preserve ID
      };

      // Return detailed data
      fetchBudgetById(id).then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Budget not found after update"));
        }
      }).catch(reject);
    }, 800);
  });
}

/**
 * Duplicate budget
 */
export async function duplicateBudget(id: string): Promise<DuplicateBudgetResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const originalBudget = MOCK_BUDGETS.find(b => b.id === id);
      
      if (!originalBudget) {
        throw new Error("Budget not found");
      }

      // Generate new folio
      const currentYear = new Date().getFullYear();
      const maxNumber = MOCK_BUDGETS
        .filter(b => b.folio.includes(`COT-${currentYear}`))
        .reduce((max, b) => {
          const num = parseInt(b.folio.split("-")[2]);
          return num > max ? num : max;
        }, 0);
      
      const newFolio = `COT-${currentYear}-${String(maxNumber + 1).padStart(3, "0")}`;
      const newId = `${Date.now()}`;

      // Create duplicate
      const newBudget: Budget = {
        ...originalBudget,
        id: newId,
        folio: newFolio,
        fecha: new Date().toISOString(),
        estado: "Borrador",
        fechaCierre: undefined,
      };

      MOCK_BUDGETS.push(newBudget);

      resolve({
        id: newId,
        folio: newFolio,
        originalId: id,
        createdAt: new Date().toISOString()
      });
    }, 800);
  });
}

/**
 * Fetch notes for a budget
 */
export async function fetchBudgetNotes(budgetId: string): Promise<BudgetNote[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock notes data
      const notes: BudgetNote[] = [
        {
          id: "note-1",
          budgetId,
          content: "Cliente solicitó revisión de costos en el módulo de reportes.",
          author: "María González",
          createdAt: "2025-12-10T14:30:00Z"
        },
        {
          id: "note-2",
          budgetId,
          content: "Coordinado reunión para el 15 de diciembre para presentación final.",
          author: "Juan Pérez",
          createdAt: "2025-12-11T09:15:00Z"
        },
        {
          id: "note-3",
          budgetId,
          content: "Pendiente: Validar disponibilidad de recursos para enero 2026.",
          author: "Carlos Ramírez",
          createdAt: "2025-12-12T16:45:00Z"
        }
      ];

      resolve(notes);
    }, 400);
  });
}

/**
 * Add note to budget
 */
export async function addBudgetNote(budgetId: string, content: string, author: string): Promise<BudgetNote> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNote: BudgetNote = {
        id: `note-${Date.now()}`,
        budgetId,
        content,
        author,
        createdAt: new Date().toISOString()
      };

      resolve(newNote);
    }, 300);
  });
}

