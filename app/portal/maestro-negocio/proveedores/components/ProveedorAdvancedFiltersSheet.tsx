"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { TipoPersona, EstadoRegistro } from "../../types/maestroNegocio";
import type { ExtendedProveedorFilters } from "../hooks/useProveedores";

const initialFilters: ExtendedProveedorFilters = {
  busqueda: "",
  tipoPersona: "all",
  estado: "all",
  email: "",
  giro: "",
  productosMin: undefined,
  productosMax: undefined,
};

interface ProveedorAdvancedFiltersSheetProps {
  filters: ExtendedProveedorFilters;
  onApplyFilters: (filters: ExtendedProveedorFilters) => void;
  onClearFilters: () => void;
}

export function ProveedorAdvancedFiltersSheet({
  filters,
  onApplyFilters,
  onClearFilters,
}: ProveedorAdvancedFiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState<ExtendedProveedorFilters>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = <K extends keyof ExtendedProveedorFilters>(
    field: K,
    value: ExtendedProveedorFilters[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFilters(initialFilters);
    onClearFilters();
  };

  const countActiveFilters = () => {
    let count = 0;
    if (localFilters.busqueda) count++;
    if (localFilters.tipoPersona !== "all") count++;
    if (localFilters.estado !== "all") count++;
    if (localFilters.email) count++;
    if (localFilters.giro) count++;
    if (localFilters.productosMin !== undefined) count++;
    if (localFilters.productosMax !== undefined) count++;
    return count;
  };

  const activeCount = countActiveFilters();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avanzados
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avanzados</SheetTitle>
          <SheetDescription>
            Configure filtros detallados para buscar proveedores específicos
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Búsqueda General */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-900">Búsqueda General</h3>

            <div className="space-y-2">
              <Label htmlFor="filter-busqueda">Búsqueda</Label>
              <Input
                id="filter-busqueda"
                placeholder="RUT, nombre, email..."
                value={localFilters.busqueda}
                onChange={(e) => handleFilterChange("busqueda", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-tipo">Tipo de Persona</Label>
              <Select
                value={localFilters.tipoPersona}
                onValueChange={(value) =>
                  handleFilterChange("tipoPersona", value as TipoPersona | "all")
                }
              >
                <SelectTrigger id="filter-tipo">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="persona-natural">Persona Natural</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-estado">Estado</Label>
              <Select
                value={localFilters.estado}
                onValueChange={(value) =>
                  handleFilterChange("estado", value as EstadoRegistro | "all")
                }
              >
                <SelectTrigger id="filter-estado">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-900">Detalles Adicionales</h3>

            <div className="space-y-2">
              <Label htmlFor="filter-email">Email</Label>
              <Input
                id="filter-email"
                type="email"
                placeholder="contacto@empresa.cl"
                value={localFilters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-giro">Giro Comercial</Label>
              <Input
                id="filter-giro"
                placeholder="Ej: Construcción, Tecnología..."
                value={localFilters.giro}
                onChange={(e) => handleFilterChange("giro", e.target.value)}
              />
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-900">Productos</h3>

            <div className="space-y-2">
              <Label>Cantidad de Productos</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Input
                    placeholder="Mínimo"
                    type="number"
                    min="0"
                    value={localFilters.productosMin ?? ""}
                    onChange={(e) =>
                      handleFilterChange("productosMin", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    placeholder="Máximo"
                    type="number"
                    min="0"
                    value={localFilters.productosMax ?? ""}
                    onChange={(e) =>
                      handleFilterChange("productosMax", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Count */}
          {countActiveFilters() > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">{countActiveFilters()}</span>{" "}
                filtro(s) activo(s)
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
              disabled={countActiveFilters() === 0}
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-[#244F82] hover:bg-[#1a3a5f]"
            >
              Aplicar Filtros
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
