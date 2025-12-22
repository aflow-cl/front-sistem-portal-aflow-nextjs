/**
 * Hook personalizado para gestionar el histórico de presupuestos
 */

import { useMemo, useState } from "react";
import {
  PresupuestoHistorico,
  HistoricoFilters,
  HistoricoStats,
  EstadoPresupuesto,
} from "../types/historico";

const DEFAULT_FILTERS: HistoricoFilters = {
  busqueda: "",
  estado: "all",
  contratanteId: "",
  ordenarPor: "fecha",
  ordenDireccion: "desc",
};

export const useHistoricoContratante = (presupuestos: PresupuestoHistorico[]) => {
  const [filters, setFilters] = useState<HistoricoFilters>(DEFAULT_FILTERS);

  // Filtrar y ordenar presupuestos
  const filteredAndSortedPresupuestos = useMemo(() => {
    let result = [...presupuestos];

    // Filtro de búsqueda
    if (filters.busqueda) {
      const searchLower = filters.busqueda.toLowerCase();
      result = result.filter(
        (p) =>
          p.folio.toLowerCase().includes(searchLower) ||
          p.contratante.nombre.toLowerCase().includes(searchLower) ||
          p.contratante.rut.includes(searchLower)
      );
    }

    // Filtro de estado
    if (filters.estado !== "all") {
      result = result.filter((p) => p.estado === filters.estado);
    }

    // Filtro de contratante
    if (filters.contratanteId) {
      result = result.filter((p) => p.contratante.id === filters.contratanteId);
    }

    // Filtro de fecha desde
    if (filters.fechaDesde) {
      result = result.filter((p) => new Date(p.fechaInicio) >= new Date(filters.fechaDesde!));
    }

    // Filtro de fecha hasta
    if (filters.fechaHasta) {
      result = result.filter((p) => new Date(p.fechaInicio) <= new Date(filters.fechaHasta!));
    }

    // Filtro de monto mínimo
    if (filters.montoMinimo !== undefined) {
      result = result.filter((p) => p.total >= filters.montoMinimo!);
    }

    // Filtro de monto máximo
    if (filters.montoMaximo !== undefined) {
      result = result.filter((p) => p.total <= filters.montoMaximo!);
    }

    // Ordenar
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.ordenarPor) {
        case "folio":
          comparison = a.folio.localeCompare(b.folio);
          break;
        case "fecha":
          comparison = new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
          break;
        case "monto":
          comparison = a.total - b.total;
          break;
        case "estado":
          comparison = a.estado.localeCompare(b.estado);
          break;
        default:
          comparison = 0;
      }

      return filters.ordenDireccion === "asc" ? comparison : -comparison;
    });

    return result;
  }, [presupuestos, filters]);

  // Calcular estadísticas
  const stats = useMemo((): HistoricoStats => {
    const totalNeto = filteredAndSortedPresupuestos.reduce((sum, p) => sum + p.neto, 0);
    const totalIva = filteredAndSortedPresupuestos.reduce((sum, p) => sum + p.iva, 0);
    const totalGeneral = filteredAndSortedPresupuestos.reduce((sum, p) => sum + p.total, 0);

    const porEstado: Record<EstadoPresupuesto, number> = {
      Borrador: 0,
      Pendiente: 0,
      Aprobado: 0,
      Rechazado: 0,
      "En Proceso": 0,
      Finalizado: 0,
      Cancelado: 0,
    };

    filteredAndSortedPresupuestos.forEach((p) => {
      porEstado[p.estado] = (porEstado[p.estado] || 0) + 1;
    });

    return {
      total: filteredAndSortedPresupuestos.length,
      totalNeto,
      totalIva,
      totalGeneral,
      porEstado,
      promedioMonto: filteredAndSortedPresupuestos.length > 0 ? totalGeneral / filteredAndSortedPresupuestos.length : 0,
    };
  }, [filteredAndSortedPresupuestos]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return (
      filters.busqueda !== "" ||
      filters.estado !== "all" ||
      filters.contratanteId !== "" ||
      filters.fechaDesde !== undefined ||
      filters.fechaHasta !== undefined ||
      filters.montoMinimo !== undefined ||
      filters.montoMaximo !== undefined
    );
  }, [filters]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Obtener lista única de contratantes
  const contratantesUnicos = useMemo(() => {
    const uniqueMap = new Map<string, { id: string; nombre: string; rut: string }>();
    presupuestos.forEach((p) => {
      if (!uniqueMap.has(p.contratante.id)) {
        uniqueMap.set(p.contratante.id, p.contratante);
      }
    });
    return Array.from(uniqueMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [presupuestos]);

  return {
    filters,
    setFilters,
    filteredAndSortedPresupuestos,
    clearFilters,
    hasActiveFilters,
    stats,
    contratantesUnicos,
  };
};
