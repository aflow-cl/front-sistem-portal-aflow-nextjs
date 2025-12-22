/**
 * Hook personalizado para gestionar Proveedores
 * Similar a useContratantes pero con lógica específica de proveedores
 */

import { useMemo, useState } from "react";
import { Proveedor, ProveedorFilters, getDisplayName } from "../../types/maestroNegocio";

export type SortField = "nombre" | "rut" | "email" | "estado" | "fechaCreacion" | "productos";
export type SortDirection = "asc" | "desc";

export interface ExtendedProveedorFilters extends ProveedorFilters {
  email?: string;
  giro?: string;
  productosMin?: number;
  productosMax?: number;
}

export function useProveedores(proveedores: Proveedor[]) {
  const [filters, setFilters] = useState<ExtendedProveedorFilters>({
    busqueda: "",
    tipoPersona: "all",
    estado: "all",
    email: "",
    giro: "",
    productosMin: undefined,
    productosMax: undefined,
  });

  const [sortField, setSortField] = useState<SortField>("fechaCreacion");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedProveedores = useMemo(() => {
    let result = [...proveedores];

    // Aplicar filtros
    const searchLower = filters.busqueda.toLowerCase();
    const emailLower = filters.email?.toLowerCase() || "";
    const giroLower = filters.giro?.toLowerCase() || "";
    
    result = result.filter((proveedor) => {
      // Búsqueda general
      const matchesBusqueda =
        !filters.busqueda ||
        proveedor.rut.toLowerCase().includes(searchLower) ||
        proveedor.email.toLowerCase().includes(searchLower) ||
        getDisplayName(proveedor).toLowerCase().includes(searchLower);

      // Tipo de persona
      const matchesTipo =
        filters.tipoPersona === "all" || proveedor.tipoPersona === filters.tipoPersona;

      // Estado
      const matchesEstado =
        filters.estado === "all" || proveedor.estado === filters.estado;

      // Email específico
      const matchesEmail =
        !filters.email ||
        proveedor.email.toLowerCase().includes(emailLower);

      // Giro (solo para empresas)
      const matchesGiro =
        !filters.giro ||
        (proveedor.tipoPersona === "empresa" && 
         proveedor.giro?.toLowerCase().includes(giroLower));

      // Rango de productos
      const matchesProductosMin =
        filters.productosMin === undefined ||
        proveedor.productos.length >= filters.productosMin;

      const matchesProductosMax =
        filters.productosMax === undefined ||
        proveedor.productos.length <= filters.productosMax;

      return matchesBusqueda && matchesTipo && matchesEstado && 
             matchesEmail && matchesGiro && matchesProductosMin && matchesProductosMax;
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
        case "productos":
          comparison = a.productos.length - b.productos.length;
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
  }, [proveedores, filters, sortField, sortDirection]);

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
      email: "",
      giro: "",
      productosMin: undefined,
      productosMax: undefined,
    });
  };

  const hasActiveFilters = Boolean(
    filters.busqueda || 
    (filters.tipoPersona !== "all") || 
    (filters.estado !== "all") ||
    filters.email ||
    filters.giro ||
    filters.productosMin !== undefined ||
    filters.productosMax !== undefined
  );

  // Estadísticas
  const stats = useMemo(() => {
    const total = proveedores.length;
    const activos = proveedores.filter((p) => p.estado === "Activo").length;
    const personas = proveedores.filter((p) => p.tipoPersona === "persona-natural").length;
    const empresas = proveedores.filter((p) => p.tipoPersona === "empresa").length;
    const totalProductos = proveedores.reduce((sum, p) => sum + p.productos.length, 0);

    return {
      total,
      activos,
      inactivos: total - activos,
      personasNaturales: personas,
      empresas,
      totalProductos,
    };
  }, [proveedores]);

  return {
    filters,
    setFilters,
    filteredAndSortedProveedores,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    hasActiveFilters,
    stats,
  };
}

