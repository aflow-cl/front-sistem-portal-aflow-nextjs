/**
 * Componente de filtros avanzados para Contratantes
 * Usa Sheet lateral para mostrar filtros de forma organizada
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { ContratanteFilters } from "../../types/maestroNegocio";
import { SortField, SortDirection } from "../hooks/useContratantes";
import { regionesChile } from "@/app/portal/presupuesto/crear/data/regionesChile";

interface AdvancedFiltersSheetProps {
  filters: ContratanteFilters;
  sortField: SortField;
  sortDirection: SortDirection;
  onApplyFilters: (filters: ContratanteFilters, sortField: SortField, sortDirection: SortDirection) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AdvancedFiltersSheet({
  filters,
  sortField,
  sortDirection,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
}: AdvancedFiltersSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ContratanteFilters>(filters);
  const [localSortField, setLocalSortField] = useState<SortField>(sortField);
  const [localSortDirection, setLocalSortDirection] = useState<SortDirection>(sortDirection);

  // Sincronizar con props cuando cambian
  useEffect(() => {
    setLocalFilters(filters);
    setLocalSortField(sortField);
    setLocalSortDirection(sortDirection);
  }, [filters, sortField, sortDirection]);

  // Resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setLocalSortField(sortField);
      setLocalSortDirection(sortDirection);
    }
  }, [isOpen, filters, sortField, sortDirection]);

  const handleApply = () => {
    onApplyFilters(localFilters, localSortField, localSortDirection);
    setIsOpen(false);
  };

  const handleClear = () => {
    const defaultFilters: ContratanteFilters = {
      busqueda: "",
      tipoPersona: "all",
      estado: "all",
      regionId: "all",
    };
    setLocalFilters(defaultFilters);
    setLocalSortField("fechaCreacion");
    setLocalSortDirection("desc");
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="border-[#244F82] text-[#244F82] hover:bg-blue-50 relative h-10"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros Avanzados
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avanzados</SheetTitle>
          <SheetDescription>
            Personaliza tu búsqueda de contratantes
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="busqueda">Búsqueda</Label>
            <Input
              id="busqueda"
              type="text"
              placeholder="RUT, nombre, razón social, email..."
              value={localFilters.busqueda}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, busqueda: e.target.value })
              }
            />
            <p className="text-xs text-gray-500">
              Busca por RUT, nombre, razón social o email
            </p>
          </div>

          {/* Tipo de Persona */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Persona</Label>
            <Select
              value={localFilters.tipoPersona}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  tipoPersona: value as ContratanteFilters["tipoPersona"],
                })
              }
            >
              <SelectTrigger id="tipo">
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
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={localFilters.estado}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  estado: value as ContratanteFilters["estado"],
                })
              }
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Región */}
          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Select
              value={localFilters.regionId || "all"}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  regionId: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Todas las regiones" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regionesChile.map((region) => (
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {region.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenamiento */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-base font-semibold">Ordenamiento</Label>
            
            <div className="space-y-2">
              <Label htmlFor="ordenarPor" className="text-sm">
                Ordenar por
              </Label>
              <Select
                value={localSortField}
                onValueChange={(value) => setLocalSortField(value as SortField)}
              >
                <SelectTrigger id="ordenarPor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nombre">Nombre</SelectItem>
                  <SelectItem value="rut">RUT</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="estado">Estado</SelectItem>
                  <SelectItem value="fechaCreacion">Fecha de Creación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-sm">
                Dirección
              </Label>
              <Select
                value={localSortDirection}
                onValueChange={(value) => setLocalSortDirection(value as SortDirection)}
              >
                <SelectTrigger id="direccion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente (A-Z, 0-9)</SelectItem>
                  <SelectItem value="desc">Descendente (Z-A, 9-0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-6 mt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Limpiar
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#0033A0] hover:bg-[#0033A0]/90"
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
