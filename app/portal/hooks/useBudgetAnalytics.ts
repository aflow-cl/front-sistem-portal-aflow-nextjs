import { useMemo } from "react";

/**
 * Hook para obtener datos analíticos de presupuestos (mock data)
 * Simula la información que vendría desde una API real
 */

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

export interface AmountComparison {
  category: string;
  neto: number;
  iva: number;
}

export interface TimelineData {
  month: string;
  cantidad: number;
  monto: number;
}

export interface KPIMetrics {
  totalBudgets: number;
  approvalRate: number;
  averageAmount: number;
  periodTotal: number;
}

export interface BudgetAnalytics {
  statusDistribution: StatusDistribution[];
  amountComparison: AmountComparison[];
  timeline: TimelineData[];
  kpiMetrics: KPIMetrics;
}

export function useBudgetAnalytics(): BudgetAnalytics {
  const analytics = useMemo(() => {
    // Datos simulados - distribución por estado
    const statusDistribution: StatusDistribution[] = [
      {
        name: "Aprobado",
        value: 45,
        color: "#10b981", // emerald-500
      },
      {
        name: "Pendiente",
        value: 28,
        color: "#f59e0b", // amber-500
      },
      {
        name: "En Revisión",
        value: 18,
        color: "#3b82f6", // blue-500
      },
      {
        name: "Rechazado",
        value: 9,
        color: "#ef4444", // red-500
      },
    ];

    // Datos simulados - comparación de montos y IVA
    // Usando presupuestos típicos chilenos con IVA del 19%
    const amountComparison: AmountComparison[] = [
      {
        category: "Q1 2025",
        neto: 245000000, // $245M CLP
        iva: 46550000, // 19% IVA
      },
      {
        category: "Q2 2025",
        neto: 312000000,
        iva: 59280000,
      },
      {
        category: "Q3 2025",
        neto: 289000000,
        iva: 54910000,
      },
      {
        category: "Q4 2025",
        neto: 356000000,
        iva: 67640000,
      },
    ];

    // Datos simulados - evolución temporal
    const timeline: TimelineData[] = [
      { month: "Jul", cantidad: 12, monto: 156000000 },
      { month: "Ago", cantidad: 15, monto: 198000000 },
      { month: "Sep", cantidad: 18, monto: 234000000 },
      { month: "Oct", cantidad: 22, monto: 287000000 },
      { month: "Nov", cantidad: 19, monto: 245000000 },
      { month: "Dic", cantidad: 24, monto: 312000000 },
    ];

    // Calcular KPIs
    const totalBudgets = statusDistribution.reduce((sum, item) => sum + item.value, 0);
    const approvedBudgets = statusDistribution.find(item => item.name === "Aprobado")?.value || 0;
    const approvalRate = totalBudgets > 0 ? (approvedBudgets / totalBudgets) * 100 : 0;
    const periodTotal = amountComparison.reduce((sum, item) => sum + item.neto + item.iva, 0);
    const averageAmount = totalBudgets > 0 ? periodTotal / totalBudgets : 0;

    const kpiMetrics: KPIMetrics = {
      totalBudgets,
      approvalRate,
      averageAmount,
      periodTotal,
    };

    return {
      statusDistribution,
      amountComparison,
      timeline,
      kpiMetrics,
    };
  }, []);

  return analytics;
}
