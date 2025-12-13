import { useState, useMemo } from "react";
import type { Budget, FilterState, SortField, SortDirection } from "@/types/presupuesto";

export function useCotizaciones(budgets: Budget[]) {
  const [filters, setFilters] = useState<FilterState>({
    cliente: "",
    estado: "",
    fecha: "",
  });
  
  const [sortField, setSortField] = useState<SortField>("fecha");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort budgets
  const filteredAndSortedBudgets = useMemo(() => {
    let result = [...budgets];

    // Apply filters
    result = result.filter((budget) => {
      const matchesCliente = filters.cliente
        ? budget.cliente.toLowerCase().includes(filters.cliente.toLowerCase())
        : true;

      const matchesEstado = filters.estado
        ? budget.estado === filters.estado
        : true;

      const matchesFecha = filters.fecha
        ? budget.fecha === filters.fecha
        : true;

      const matchesFechaRango =
        filters.fechaInicio && filters.fechaFin
          ? budget.fecha >= filters.fechaInicio && budget.fecha <= filters.fechaFin
          : true;

      const matchesAutor = filters.autor
        ? budget.autor?.toLowerCase().includes(filters.autor.toLowerCase())
        : true;

      const matchesFolio = filters.folio
        ? budget.folio.toLowerCase().includes(filters.folio.toLowerCase())
        : true;

      const matchesMontoMin = filters.montoMin !== undefined
        ? (budget.monto || 0) >= filters.montoMin
        : true;

      const matchesMontoMax = filters.montoMax !== undefined
        ? (budget.monto || 0) <= filters.montoMax
        : true;

      const matchesFechaCierreRango =
        filters.fechaCierreInicio && filters.fechaCierreFin
          ? budget.fechaCierre &&
            budget.fechaCierre >= filters.fechaCierreInicio &&
            budget.fechaCierre <= filters.fechaCierreFin
          : true;

      return (
        matchesCliente &&
        matchesEstado &&
        matchesFecha &&
        matchesFechaRango &&
        matchesAutor &&
        matchesFolio &&
        matchesMontoMin &&
        matchesMontoMax &&
        matchesFechaCierreRango
      );
    });

    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "folio":
          aValue = a.folio;
          bValue = b.folio;
          break;
        case "cliente":
          aValue = a.cliente;
          bValue = b.cliente;
          break;
        case "fecha":
          aValue = a.fecha;
          bValue = b.fecha;
          break;
        case "monto":
          aValue = a.monto || 0;
          bValue = b.monto || 0;
          break;
        case "neto":
          aValue = a.neto || 0;
          bValue = b.neto || 0;
          break;
        case "estado":
          aValue = a.estado;
          bValue = b.estado;
          break;
        case "autor":
          aValue = a.autor || "";
          bValue = b.autor || "";
          break;
        case "fechaCierre":
          aValue = a.fechaCierre || "";
          bValue = b.fechaCierre || "";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [budgets, filters, sortField, sortDirection]);

  const clearFilters = () => {
    setFilters({
      cliente: "",
      estado: "",
      fecha: "",
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "cliente" || key === "estado" || key === "fecha") {
        return value !== "";
      }
      return value !== undefined && value !== null;
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredAndSortedBudgets,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    hasActiveFilters,
  };
}
