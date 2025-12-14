"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { fetchBudgets, createBudget, INDICATOR_GROUPS } from "../api/budgetService";
import { Indicators } from "../components/Indicators";
import { BudgetTableEnhanced } from "../components/BudgetTableEnhanced";
import { AdvancedFilters } from "../components/AdvancedFilters";
import { CreateBudgetModal } from "../components/CreateBudgetModal";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCotizaciones } from "../hooks/useCotizaciones";
import type { CreateBudgetInput, Budget, IndicatorData } from "@/types/presupuesto";
import { useState, useEffect, useMemo } from "react";
import { RefreshCcw } from "lucide-react";

export default function ConsultarPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightEstado, setHighlightEstado] = useState(false);

  // Fetch budgets
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    error: budgetsError,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  // Calculate indicators dynamically from budgets
  const indicators: IndicatorData[] = useMemo(() => {
    const grouped = Object.entries(INDICATOR_GROUPS).map(([groupName, config]) => {
      const count = budgets.filter(budget => 
        (config.estados as readonly string[]).includes(budget.estado)
      ).length;
      
      return {
        label: groupName,
        value: count,
        color: config.color,
        estados: [...config.estados] as string[],
        description: config.description,
      };
    });
    
    return grouped;
  }, [budgets]);

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

  // Handle filter by status from indicator (can be a group or single estado)
  const handleFilterByStatus = (estados: string | string[]) => {
    const estadosArray = Array.isArray(estados) ? estados : [estados];
    
    setFilters((prev) => ({
      ...prev,
      estados: estadosArray,
    }));
    setHighlightEstado(true);
    
    const description = estadosArray.length > 1
      ? `Mostrando presupuestos: ${estadosArray.join(", ")}`
      : `Mostrando presupuestos con estado: ${estadosArray[0]}`;
    
    toast.success("Filtro aplicado", {
      description,
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
      {/* Indicators */}
      <Indicators data={indicators} onFilterByStatus={handleFilterByStatus} />

      {/* Action Bar - Results Summary and Controls */}
      <div className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        {/* Results Summary */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
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
