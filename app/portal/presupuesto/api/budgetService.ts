import type { Budget, IndicatorData, CreateBudgetInput } from "@/types/presupuesto";

/**
 * Simulated API service for Budget operations
 * Uses promises with delays to simulate real API behavior
 */

// Mock data
const MOCK_BUDGETS: Budget[] = [
  {
    id: "1",
    folio: "P-001",
    cliente: "Constructora Andes",
    fecha: "2025-12-01",
    estado: "En revisión",
    monto: 45000,
    descripcion: "Proyecto de construcción residencial"
  },
  {
    id: "2",
    folio: "P-002",
    cliente: "Servicios Digitales Ltda.",
    fecha: "2025-12-03",
    estado: "Finalizado",
    monto: 28500,
    descripcion: "Desarrollo de plataforma web"
  },
  {
    id: "3",
    folio: "P-003",
    cliente: "Comercial S.A.",
    fecha: "2025-12-05",
    estado: "En proceso",
    monto: 51500,
    descripcion: "Sistema de inventario y ventas"
  },
  {
    id: "4",
    folio: "P-004",
    cliente: "Inmobiliaria del Sur",
    fecha: "2025-12-07",
    estado: "Borrador",
    monto: 35000,
    descripcion: "Portal de propiedades online"
  },
  {
    id: "5",
    folio: "P-005",
    cliente: "Tecnología Avanzada",
    fecha: "2025-12-08",
    estado: "En revisión",
    monto: 62000,
    descripcion: "Implementación de ERP"
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
