/**
 * Componente de filtros avanzados para histórico de presupuestos
 */

"use client";

import { useState } from "react";
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
import { SlidersHorizontal, X } from "lucide-react";
import { HistoricoFilters, EstadoPresupuesto } from "../types/historico";

interface AdvancedFiltersProps {
  filters: HistoricoFilters;
  onApplyFilters: (filters: HistoricoFilters) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  contratantes?: Array<{ id: string; nombre: string; rut: string }>;
}

export const AdvancedFilters = ({
  filters,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
  contratantes = [],
}: AdvancedFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<HistoricoFilters>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
    setLocalFilters({
      busqueda: "",
      estado: "all",
      contratanteId: "",
      ordenarPor: "fecha",
      ordenDireccion: "desc",
    });
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
            Personaliza tu búsqueda con filtros específicos
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Filtro por Contratante */}
          <div className="space-y-2">
            <Label htmlFor="contratante">Contratante</Label>
            <Select
              value={localFilters.contratanteId}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, contratanteId: value })
              }
            >
              <SelectTrigger id="contratante">
                <SelectValue placeholder="Todos los contratantes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los contratantes</SelectItem>
                {contratantes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nombre} - {c.rut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={localFilters.estado}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  estado: value as EstadoPresupuesto | "all",
                })
              }
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Todos los estados" />
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
          </div>

          {/* Rango de Fechas */}
          <div className="space-y-4">
            <Label>Rango de Fechas</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fechaDesde" className="text-xs text-gray-600">
                  Desde
                </Label>
                <Input
                  id="fechaDesde"
                  type="date"
                  value={localFilters.fechaDesde || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      fechaDesde: e.target.value || undefined,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaHasta" className="text-xs text-gray-600">
                  Hasta
                </Label>
                <Input
                  id="fechaHasta"
                  type="date"
                  value={localFilters.fechaHasta || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      fechaHasta: e.target.value || undefined,
                    })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rango de Montos */}
          <div className="space-y-4">
            <Label>Rango de Montos (Total)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="montoMinimo" className="text-xs text-gray-600">
                  Monto Mínimo
                </Label>
                <Input
                  id="montoMinimo"
                  type="number"
                  placeholder="$0"
                  value={localFilters.montoMinimo || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      montoMinimo: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="montoMaximo" className="text-xs text-gray-600">
                  Monto Máximo
                </Label>
                <Input
                  id="montoMaximo"
                  type="number"
                  placeholder="Sin límite"
                  value={localFilters.montoMaximo || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      montoMaximo: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="space-y-4">
            <Label>Ordenamiento</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ordenarPor" className="text-xs text-gray-600">
                  Ordenar Por
                </Label>
                <Select
                  value={localFilters.ordenarPor}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      ordenarPor: value as "folio" | "fecha" | "monto" | "estado",
                    })
                  }
                >
                  <SelectTrigger id="ordenarPor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="folio">Folio</SelectItem>
                    <SelectItem value="fecha">Fecha</SelectItem>
                    <SelectItem value="monto">Monto</SelectItem>
                    <SelectItem value="estado">Estado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordenDireccion" className="text-xs text-gray-600">
                  Dirección
                </Label>
                <Select
                  value={localFilters.ordenDireccion}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      ordenDireccion: value as "asc" | "desc",
                    })
                  }
                >
                  <SelectTrigger id="ordenDireccion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascendente</SelectItem>
                    <SelectItem value="desc">Descendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-[#244F82] hover:bg-[#244F82]/90"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
