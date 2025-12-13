"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { fetchBudgets, fetchIndicators, createBudget } from "../api/budgetService";
import { Indicators } from "../components/Indicators";
import { BudgetTableEnhanced } from "../components/BudgetTableEnhanced";
import { AdvancedFilters } from "../components/AdvancedFilters";
import { CreateBudgetModal } from "../components/CreateBudgetModal";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCotizaciones } from "../hooks/useCotizaciones";
import type { CreateBudgetInput, Budget } from "@/types/presupuesto";
import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function ConsultarPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightEstado, setHighlightEstado] = useState(false);

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

  // Use custom hook for filtering and sorting
  const {
    filters,
    setFilters,
    filteredAndSortedBudgets,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    hasActiveFilters,
  } = useCotizaciones(budgets);

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: (newBudget: Budget) => {
      queryClient.setQueryData<Budget[]>(["budgets"], (old) => [newBudget, ...(old || [])]);
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

  // Handle create budget
  const handleCreateBudget = (data: CreateBudgetInput) => {
    createBudgetMutation.mutate(data);
  };

  // Handle filter by status from indicator
  const handleFilterByStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      estado: status,
    }));
    setHighlightEstado(true);
    toast.success("Filtro aplicado", {
      description: `Mostrando presupuestos con estado: ${status}`,
    });
  };

  // Remove highlight after animation
  useEffect(() => {
    if (highlightEstado) {
      const timer = setTimeout(() => setHighlightEstado(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightEstado]);

  // Handle refresh
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
    toast.info("Actualizando cotizaciones...");
  };

  // Show error state
  if (budgetsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCcw className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error al cargar las cotizaciones
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Hubo un problema al obtener los datos. Por favor, intenta nuevamente.
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["budgets"] })}
            className="bg-[#244F82] hover:bg-[#1a3a5f]"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (isBudgetsLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons Row - Clean and aligned */}
      <div className="flex items-center justify-end gap-2 -mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="border-gray-300 hover:bg-gray-50 transition-colors"
          aria-label="Actualizar cotizaciones"
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Actualizar</span>
        </Button>
        <AdvancedFilters
          filters={filters}
          onApplyFilters={setFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Indicators */}
      <Indicators data={indicators} onFilterByStatus={handleFilterByStatus} />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {filteredAndSortedBudgets.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900">{budgets.length}</span>{" "}
          cotizaciones
        </p>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#244F82] hover:text-[#1a3a5f] hover:bg-blue-50 transition-colors"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Budget Table */}
      <BudgetTableEnhanced
        data={filteredAndSortedBudgets}
        loading={isBudgetsLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

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
