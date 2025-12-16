"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Componentes
import { Indicators } from "./components/Indicators";
import { Filters } from "./components/Filters";
import { ContratantesTable } from "./components/ContratantesTable";
import { ContratanteModal } from "./components/ContratanteModal";
import { DireccionesModal } from "./components/DireccionesModal";

// Hooks y tipos
import { useContratantes } from "./hooks/useContratantes";
import { 
  Contratante, 
  CreateContratanteInput, 
  UpdateContratanteInput,
  TipoPersona,
  EstadoRegistro
} from "../types/maestroNegocio";

// Servicios
import {
  fetchContratantes,
  createContratante,
  updateContratante,
  deleteContratante,
} from "../api/maestroService";

export default function ContratantesPage() {
  const queryClient = useQueryClient();
  const [selectedContratante, setSelectedContratante] = useState<Contratante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDireccionesModalOpen, setIsDireccionesModalOpen] = useState(false);

  // Fetch contratantes
  const {
    data: contratantes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contratantes"],
    queryFn: fetchContratantes,
  });

  // Hook personalizado para filtrado y ordenamiento
  const {
    filters,
    setFilters,
    filteredAndSortedContratantes,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    hasActiveFilters,
    stats,
  } = useContratantes(contratantes);

  // Mutation para eliminar/desactivar
  const deleteMutation = useMutation({
    mutationFn: deleteContratante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Estado actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar estado", {
        description: error instanceof Error ? error.message : "Intente nuevamente",
      });
    },
  });

  // Mutation para crear
  const createMutation = useMutation({
    mutationFn: createContratante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Contratante creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear contratante", {
        description: error instanceof Error ? error.message : "Intente nuevamente",
      });
    },
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: updateContratante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Contratante actualizado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar contratante", {
        description: error instanceof Error ? error.message : "Intente nuevamente",
      });
    },
  });

  // Handlers
  const handleFilterClick = (filterType: string, value: string) => {
    if (filterType === "estado") {
      // Toggle: si el mismo filtro está activo, limpiarlo
      if (filters.estado === value) {
        setFilters({ ...filters, estado: "all" });
      } else {
        setFilters({ ...filters, estado: value as EstadoRegistro });
      }
    } else if (filterType === "tipoPersona") {
      if (filters.tipoPersona === value) {
        setFilters({ ...filters, tipoPersona: "all" });
      } else {
        setFilters({ ...filters, tipoPersona: value as TipoPersona });
      }
    }
  };

  const handleEdit = (contratante: Contratante) => {
    setSelectedContratante(contratante);
    setIsModalOpen(true);
  };

  const handleDelete = (contratante: Contratante) => {
    const action = contratante.estado === "Activo" ? "desactivar" : "activar";
    
    if (confirm(`¿Está seguro que desea ${action} este contratante?`)) {
      deleteMutation.mutate(contratante.id);
    }
  };

  const handleViewDirecciones = (contratante: Contratante) => {
    setSelectedContratante(contratante);
    setIsDireccionesModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedContratante(null);
    setIsModalOpen(true);
  };

  const handleSave = async (input: CreateContratanteInput | UpdateContratanteInput) => {
    if ("id" in input) {
      await updateMutation.mutateAsync(input as UpdateContratanteInput);
    } else {
      await createMutation.mutateAsync(input as CreateContratanteInput);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar contratantes</h3>
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de acción */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Gestión de contratantes del sistema
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuevo Contratante
        </Button>
      </div>

      {/* Indicadores */}
      <Indicators
        stats={stats}
        activeFilters={{ estado: filters.estado }}
        onFilterClick={handleFilterClick}
      />

      {/* Filtros */}
      <Filters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={!!hasActiveFilters}
      />

      {/* Resumen de resultados */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {filteredAndSortedContratantes.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900">{contratantes.length}</span>{" "}
          contratante{contratantes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabla */}
      <ContratantesTable
        contratantes={filteredAndSortedContratantes}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDirecciones={handleViewDirecciones}
        isLoading={isLoading}
      />

      {/* Modal de Creación/Edición */}
      <ContratanteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        contratante={selectedContratante}
        onSave={handleSave}
      />

      {/* Modal de Direcciones */}
      <DireccionesModal
        open={isDireccionesModalOpen}
        onOpenChange={setIsDireccionesModalOpen}
        contratante={selectedContratante}
      />
    </div>
  );
}
