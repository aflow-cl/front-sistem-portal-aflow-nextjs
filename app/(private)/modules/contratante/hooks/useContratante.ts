"use client";

import { useState, useEffect, useCallback } from "react";
import { contratanteService } from "../services/contratante.service";
import type { Contratante, ContratanteFormData, ContratanteFilters } from "../types/contratante";
import type { LoadingState } from "@/types";

/**
 * Hook para manejar las operaciones CRUD de Contratante
 */
export function useContratante() {
  const [contratantes, setContratantes] = useState<Contratante[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los contratantes
  const loadAll = useCallback(async () => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const data = await contratanteService.getAll();
      setContratantes(data);
      setState("success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar contratantes";
      setError(errorMessage);
      setState("error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear contratante
  const create = async (data: ContratanteFormData): Promise<Contratante | null> => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const newContratante = await contratanteService.create(data);
      setContratantes((prev) => [...prev, newContratante]);
      
      setState("success");
      return newContratante;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear contratante";
      setError(errorMessage);
      setState("error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contratante
  const update = async (id: string, data: Partial<ContratanteFormData>): Promise<Contratante | null> => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const updatedContratante = await contratanteService.update(id, data);
      
      if (updatedContratante) {
        setContratantes((prev) =>
          prev.map((c) => (c.id === id ? updatedContratante : c))
        );
      }
      
      setState("success");
      return updatedContratante;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar contratante";
      setError(errorMessage);
      setState("error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar contratante
  const remove = async (id: string): Promise<boolean> => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const success = await contratanteService.delete(id);
      
      if (success) {
        setContratantes((prev) => prev.filter((c) => c.id !== id));
      }
      
      setState("success");
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar contratante";
      setError(errorMessage);
      setState("error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar contratantes
  const search = async (query: string): Promise<Contratante[]> => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const results = await contratanteService.search(query);
      setState("success");
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al buscar contratantes";
      setError(errorMessage);
      setState("error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filtrar contratantes localmente
  const filter = useCallback((filters: ContratanteFilters): Contratante[] => {
    let filtered = [...contratantes];

    // Filtrar por búsqueda de texto
    if (filters.search) {
      const lowerQuery = filters.search.toLowerCase();
      filtered = filtered.filter((c) => {
        const searchText = `${c.nombreCompleto || c.razonSocial} ${c.rut} ${c.correo}`.toLowerCase();
        return searchText.includes(lowerQuery);
      });
    }

    // Filtrar por tipo
    if (filters.tipo && filters.tipo !== "all") {
      filtered = filtered.filter((c) => c.tipo === filters.tipo);
    }

    // Filtrar por estado activo
    if (filters.activo !== undefined && filters.activo !== "all") {
      filtered = filtered.filter((c) => c.activo === filters.activo);
    }

    return filtered;
  }, [contratantes]);

  // Cargar datos al montar
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    contratantes,
    loading,
    state,
    error,
    loadAll,
    create,
    update,
    remove,
    search,
    filter,
  };
}
