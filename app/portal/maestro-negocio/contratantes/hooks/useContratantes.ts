/**
 * Hook personalizado para gestionar Contratantes
 * Maneja filtrado, ordenamiento y lógica de negocio
 */

import { useMemo, useState } from "react";
import { Contratante, ContratanteFilters, getDisplayName } from "../../types/maestroNegocio";

export type SortField = "nombre" | "rut" | "email" | "estado" | "fechaCreacion";
export type SortDirection = "asc" | "desc";

export function useContratantes(contratantes: Contratante[]) {
  const [filters, setFilters] = useState<ContratanteFilters>({
    busqueda: "",
    tipoPersona: "all",
    estado: "all",
  });

  const [sortField, setSortField] = useState<SortField>("fechaCreacion");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filtrado y ordenamiento
  const filteredAndSortedContratantes = useMemo(() => {
    let result = [...contratantes];

    // Aplicar filtros
    const searchLower = filters.busqueda.toLowerCase();
    
    result = result.filter((contratante) => {
      // Filtro de búsqueda
      const matchesBusqueda =
        !filters.busqueda ||
        contratante.rut.toLowerCase().includes(searchLower) ||
        contratante.email.toLowerCase().includes(searchLower) ||
        getDisplayName(contratante).toLowerCase().includes(searchLower);

      // Filtro de tipo de persona
      const matchesTipo =
        filters.tipoPersona === "all" || contratante.tipoPersona === filters.tipoPersona;

      // Filtro de estado
      const matchesEstado =
        filters.estado === "all" || contratante.estado === filters.estado;

      return matchesBusqueda && matchesTipo && matchesEstado;
    });

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "nombre":
          comparison = getDisplayName(a).localeCompare(getDisplayName(b));
          break;
        case "rut":
          comparison = a.rut.localeCompare(b.rut);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "estado":
          comparison = a.estado.localeCompare(b.estado);
          break;
        case "fechaCreacion":
          comparison = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [contratantes, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setFilters({
      busqueda: "",
      tipoPersona: "all",
      estado: "all",
    });
  };

  const hasActiveFilters = 
    filters.busqueda || 
    (filters.tipoPersona !== "all") || 
    (filters.estado !== "all");

  // Estadísticas
  const stats = useMemo(() => {
    const total = contratantes.length;
    const activos = contratantes.filter((c) => c.estado === "Activo").length;
    const personas = contratantes.filter((c) => c.tipoPersona === "persona-natural").length;
    const empresas = contratantes.filter((c) => c.tipoPersona === "empresa").length;

    return {
      total,
      activos,
      inactivos: total - activos,
      personasNaturales: personas,
      empresas,
    };
  }, [contratantes]);

  return {
    filters,
    setFilters,
    filteredAndSortedContratantes,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    hasActiveFilters,
    stats,
  };
}
