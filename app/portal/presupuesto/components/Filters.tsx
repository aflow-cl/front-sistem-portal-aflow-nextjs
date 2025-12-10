"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import type { FilterState } from "@/types/presupuesto";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Card className="shadow-sm rounded-2xl border-none bg-gray-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-aflow-orange" />
          <h3 className="text-sm font-semibold text-gray-900">Filtros de búsqueda</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Cliente filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-cliente" className="text-sm font-medium text-gray-700">
              Cliente
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="filter-cliente"
                type="text"
                placeholder="Buscar cliente..."
                value={filters.cliente}
                onChange={(e) => handleInputChange("cliente", e.target.value)}
                className="pl-9 rounded-xl border-gray-200 focus:border-aflow-orange focus:ring-aflow-orange"
              />
            </div>
          </div>

          {/* Estado filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-estado" className="text-sm font-medium text-gray-700">
              Estado
            </Label>
            <select
              id="filter-estado"
              value={filters.estado}
              onChange={(e) => handleInputChange("estado", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-aflow-orange focus:border-aflow-orange"
            >
              <option value="">Todos los estados</option>
              <option value="Borrador">Borrador</option>
              <option value="En revisión">En revisión</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          {/* Fecha filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-fecha" className="text-sm font-medium text-gray-700">
              Fecha
            </Label>
            <Input
              id="filter-fecha"
              type="date"
              value={filters.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              className="rounded-xl border-gray-200 focus:border-aflow-orange focus:ring-aflow-orange"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
