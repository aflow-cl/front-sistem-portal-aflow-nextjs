"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { fetchBudgets, fetchIndicators, createBudget } from "./api/budgetService";
import { Indicators } from "./components/Indicators";
import { Filters } from "./components/Filters";
import { BudgetTable } from "./components/BudgetTable";
import { CreateBudgetModal } from "./components/CreateBudgetModal";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import type { FilterState, CreateBudgetInput, Budget } from "@/types/presupuesto";

export default function PresupuestoPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    cliente: "",
    estado: "",
    fecha: "",
  });

  // Fetch indicators
  const { data: indicators = [] } = useQuery({
    queryKey: ["indicators"],
    queryFn: fetchIndicators,
  });

  // Fetch budgets
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    error: budgetsError,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: (newBudget: Budget) => {
      // Update cache
      queryClient.setQueryData<Budget[]>(["budgets"], (old) => [newBudget, ...(old || [])]);
      
      // Close modal and show success message
      setIsModalOpen(false);
      toast.success("Presupuesto creado exitosamente", {
        description: `Folio: ${newBudget.folio} - ${newBudget.cliente}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Error al crear presupuesto", {
        description: "Por favor, intenta nuevamente.",
      });
      console.error("Error creating budget:", error);
    },
  });

  // Filter budgets
  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget: Budget) => {
      const matchesCliente = filters.cliente
        ? budget.cliente.toLowerCase().includes(filters.cliente.toLowerCase())
        : true;

      const matchesEstado = filters.estado
        ? budget.estado === filters.estado
        : true;

      const matchesFecha = filters.fecha
        ? budget.fecha === filters.fecha
        : true;

      return matchesCliente && matchesEstado && matchesFecha;
    });
  }, [budgets, filters]);

  // Handle create budget
  const handleCreateBudget = (data: CreateBudgetInput) => {
    createBudgetMutation.mutate(data);
  };

  // Show error state
  if (budgetsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presupuesto</h1>
          <p className="text-gray-600 mt-1">Gestión de presupuestos y cotizaciones</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-800">Error al cargar los presupuestos</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["budgets"] })}
            className="mt-4 bg-aflow-blue hover:bg-aflow-blue-light"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isBudgetsLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Presupuesto</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gestión de presupuestos y cotizaciones</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-aflow-blue hover:bg-aflow-blue-light text-white rounded-xl shadow-sm w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Nuevo Presupuesto</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* Indicators */}
      <Indicators data={indicators} />

      {/* Filters */}
      <Filters filters={filters} onFilterChange={setFilters} />

      {/* Budget Table */}
      <BudgetTable data={filteredBudgets} loading={isBudgetsLoading} />

      {/* Create Modal */}
      <CreateBudgetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateBudget}
        isSubmitting={createBudgetMutation.isPending}
      />
    </div>
  );
}
