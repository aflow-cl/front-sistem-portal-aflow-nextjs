/**
 * Página principal del módulo Histórico de Contratantes
 * Muestra el historial completo de presupuestos con filtros avanzados
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

// Servicios y hooks
import { fetchHistoricoPresupuestos } from "./api/historicoService";
import { useHistoricoContratante } from "./hooks/useHistoricoContratante";

// Componentes
import { Indicators } from "./components/Indicators";
import { HistoricoTable } from "./components/HistoricoTable";
import { AdvancedFilters } from "./components/AdvancedFilters";

// Tipos
import { PresupuestoHistorico, EstadoPresupuesto } from "./types/historico";

export default function HistoricoContratantePage() {
  // Fetch datos
  const {
    data: presupuestos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["historico-presupuestos"],
    queryFn: fetchHistoricoPresupuestos,
  });

  // Hook personalizado para filtros y estadísticas
  const {
    filters,
    setFilters,
    filteredAndSortedPresupuestos,
    clearFilters,
    hasActiveFilters,
    stats,
    contratantesUnicos,
  } = useHistoricoContratante(presupuestos);

  // Handlers
  const handleViewDetails = (presupuesto: PresupuestoHistorico) => {
    toast.info(`Ver detalles completos de ${presupuesto.folio}`);
    // TODO: Implementar navegación a página de detalles
    // router.push(`/portal/historico-contratante/${presupuesto.id}`);
  };

  const handleExportExcel = () => {
    toast.success("Exportando a Excel...");
    // TODO: Implementar exportación a Excel
  };

  const handleExportPDF = () => {
    toast.success("Exportando a PDF...");
    // TODO: Implementar exportación a PDF
  };

  // Manejo de errores
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">
          Error al cargar el histórico
        </h3>
        <p className="text-red-600 text-sm">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Histórico de Contratantes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza y gestiona el historial completo de presupuestos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Indicadores */}
      <Indicators stats={stats} isLoading={isLoading} />

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#244F82]" />
          <h3 className="text-sm font-semibold text-gray-900">
            Filtros de búsqueda
          </h3>
          {hasActiveFilters && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              {filteredAndSortedPresupuestos.length} resultados
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {/* Filtros rápidos */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Búsqueda rápida */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por folio, contratante, RUT..."
                value={filters.busqueda}
                onChange={(e) =>
                  setFilters({ ...filters, busqueda: e.target.value })
                }
                className="pl-9 h-10 rounded-xl border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Filtro de Estado */}
            <Select
              value={filters.estado}
              onValueChange={(value: string) =>
                setFilters({
                  ...filters,
                  estado: value as EstadoPresupuesto | "all",
                })
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobado">Aprobado</SelectItem>
                <SelectItem value="Rechazado">Rechazado</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro de Contratante */}
            <Select
              value={filters.contratanteId}
              onValueChange={(value: string) =>
                setFilters({ ...filters, contratanteId: value })
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300">
                <SelectValue placeholder="Contratante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los contratantes</SelectItem>
                {contratantesUnicos.map((contratante) => (
                  <SelectItem key={contratante.id} value={contratante.id}>
                    {contratante.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <AdvancedFilters
              filters={filters}
              onApplyFilters={setFilters}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              contratantes={contratantesUnicos}
            />

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="default"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900 border-gray-300 h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de histórico */}
      <HistoricoTable
        presupuestos={filteredAndSortedPresupuestos}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Resumen de filtros activos */}
      {hasActiveFilters && filteredAndSortedPresupuestos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Mostrando <span className="font-bold">{filteredAndSortedPresupuestos.length}</span>{" "}
                de <span className="font-bold">{presupuestos.length}</span> presupuestos
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:bg-blue-100"
            >
              Ver todos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
