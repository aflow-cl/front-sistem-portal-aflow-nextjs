import { useState, useMemo } from "react";
import type {
  Cliente,
  Perfil,
  Servicio,
  ClienteFilterState,
  PerfilFilterState,
  ServicioFilterState,
} from "../types/ajustes";

// ============================================
// Hook para Clientes
// ============================================

export function useClienteFilters(clientes: Cliente[] = []) {
  const [filters, setFilters] = useState<ClienteFilterState>({
    busqueda: "",
    region: "all",
    activo: "all",
  });

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        cliente.razonSocial
          .toLowerCase()
          .includes(filters.busqueda.toLowerCase()) ||
        cliente.rut.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filters.busqueda.toLowerCase());

      const matchesRegion =
        filters.region === "all" || cliente.region === filters.region;

      const matchesActivo =
        filters.activo === "all" ||
        (filters.activo === "active" && cliente.activo) ||
        (filters.activo === "inactive" && !cliente.activo);

      return matchesSearch && matchesRegion && matchesActivo;
    });
  }, [clientes, filters]);

  const clearFilters = () => {
    setFilters({
      busqueda: "",
      region: "all",
      activo: "all",
    });
  };

  const hasActiveFilters =
    filters.busqueda !== "" ||
    filters.region !== "all" ||
    filters.activo !== "all";

  return {
    filters,
    setFilters,
    filteredClientes,
    clearFilters,
    hasActiveFilters,
  };
}

// ============================================
// Hook para Perfiles
// ============================================

export function usePerfilFilters(perfiles: Perfil[] = []) {
  const [filters, setFilters] = useState<PerfilFilterState>({
    busqueda: "",
    nivel: "all",
    activo: "all",
  });

  const filteredPerfiles = useMemo(() => {
    return perfiles.filter((perfil) => {
      const matchesSearch = perfil.nombre
        .toLowerCase()
        .includes(filters.busqueda.toLowerCase());

      const matchesNivel =
        filters.nivel === "all" || perfil.nivel === filters.nivel;

      const matchesActivo =
        filters.activo === "all" ||
        (filters.activo === "active" && perfil.activo) ||
        (filters.activo === "inactive" && !perfil.activo);

      return matchesSearch && matchesNivel && matchesActivo;
    });
  }, [perfiles, filters]);

  const clearFilters = () => {
    setFilters({
      busqueda: "",
      nivel: "all",
      activo: "all",
    });
  };

  const hasActiveFilters =
    filters.busqueda !== "" ||
    filters.nivel !== "all" ||
    filters.activo !== "all";

  return {
    filters,
    setFilters,
    filteredPerfiles,
    clearFilters,
    hasActiveFilters,
  };
}

// ============================================
// Hook para Servicios
// ============================================

export function useServicioFilters(servicios: Servicio[] = []) {
  const [filters, setFilters] = useState<ServicioFilterState>({
    busqueda: "",
    categoria: "all",
    activo: "all",
  });

  const filteredServicios = useMemo(() => {
    return servicios.filter((servicio) => {
      const matchesSearch =
        servicio.nombre
          .toLowerCase()
          .includes(filters.busqueda.toLowerCase()) ||
        servicio.codigo.toLowerCase().includes(filters.busqueda.toLowerCase());

      const matchesCategoria =
        filters.categoria === "all" || servicio.categoria === filters.categoria;

      const matchesActivo =
        filters.activo === "all" ||
        (filters.activo === "active" && servicio.activo) ||
        (filters.activo === "inactive" && !servicio.activo);

      return matchesSearch && matchesCategoria && matchesActivo;
    });
  }, [servicios, filters]);

  const clearFilters = () => {
    setFilters({
      busqueda: "",
      categoria: "all",
      activo: "all",
    });
  };

  const hasActiveFilters =
    filters.busqueda !== "" ||
    filters.categoria !== "all" ||
    filters.activo !== "all";

  return {
    filters,
    setFilters,
    filteredServicios,
    clearFilters,
    hasActiveFilters,
  };
}

// ============================================
// Hook para Analytics/Stats
// ============================================

export function useAjustesStats(
  clientes: Cliente[] = [],
  perfiles: Perfil[] = [],
  servicios: Servicio[] = []
) {
  const stats = useMemo(() => {
    const clientesActivos = clientes.filter((c) => c.activo).length;
    const serviciosActivos = servicios.filter((s) => s.activo).length;
    const totalUsuarios = clientes.reduce(
      (sum, c) => sum + c.usuarios.length,
      0
    );
    const usuariosAsignados = perfiles.reduce(
      (sum, p) => sum + p.usuariosAsignados,
      0
    );

    return {
      totalClientes: clientes.length,
      clientesActivos,
      porcentajeClientesActivos:
        clientes.length > 0
          ? Math.round((clientesActivos / clientes.length) * 100)
          : 0,
      totalUsuarios,
      totalPerfiles: perfiles.length,
      usuariosAsignados,
      totalServicios: servicios.length,
      serviciosActivos,
      porcentajeServiciosActivos:
        servicios.length > 0
          ? Math.round((serviciosActivos / servicios.length) * 100)
          : 0,
    };
  }, [clientes, perfiles, servicios]);

  return stats;
}

// ============================================
// Hook para Currency Formatting
// ============================================

export function useCurrencyFormatter() {
  const formatCurrency = (amount: number, currency: string = "CLP") => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number, currency: string = "CLP") => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
      notation: "compact",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    formatCurrency,
    formatCompactCurrency,
  };
}

// ============================================
// Hook para Date Formatting
// ============================================

export function useDateFormatter() {
  const formatDate = (dateString: string, format: "short" | "long" = "short") => {
    const date = new Date(dateString);

    if (format === "short") {
      return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return formatDate(dateString, "short");
  };

  return {
    formatDate,
    formatRelativeDate,
  };
}
