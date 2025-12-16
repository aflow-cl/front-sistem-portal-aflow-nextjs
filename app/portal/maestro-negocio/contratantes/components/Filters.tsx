/**
 * Componente de filtros para Contratantes
 * Permite búsqueda por texto, filtro por tipo y estado
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { ContratanteFilters, TipoPersona, EstadoRegistro } from "../../types/maestroNegocio";

interface FiltersProps {
  filters: ContratanteFilters;
  onFilterChange: (filters: ContratanteFilters) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function Filters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-1">
          <Label htmlFor="busqueda" className="text-sm font-medium text-gray-700">
            Buscar
          </Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="busqueda"
              type="text"
              placeholder="RUT, nombre, razón social, email..."
              value={filters.busqueda}
              onChange={(e) =>
                onFilterChange({ ...filters, busqueda: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Tipo de Persona */}
        <div>
          <Label htmlFor="tipoPersona" className="text-sm font-medium text-gray-700">
            Tipo
          </Label>
          <Select
            value={filters.tipoPersona}
            onValueChange={(value: string) =>
              onFilterChange({ ...filters, tipoPersona: value as TipoPersona | "all" })
            }
          >
            <SelectTrigger id="tipoPersona" className="mt-1.5">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="persona-natural">Persona Natural</SelectItem>
              <SelectItem value="empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div>
          <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
            Estado
          </Label>
          <Select
            value={filters.estado}
            onValueChange={(value: string) =>
              onFilterChange({ ...filters, estado: value as EstadoRegistro | "all" })
            }
          >
            <SelectTrigger id="estado" className="mt-1.5">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de limpiar filtros */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
