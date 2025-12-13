"use client";

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
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, X, Check } from "lucide-react";
import type { FilterState } from "@/types/presupuesto";
import { useState } from "react";
import { toast } from "sonner";

interface AdvancedFiltersProps {
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AdvancedFilters({
  filters,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpen(false);
    toast.success("Filtros aplicados correctamente");
  };

  const handleClear = () => {
    const emptyFilters: FilterState = {
      cliente: "",
      estado: "",
      fecha: "",
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
    toast.info("Filtros limpiados");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalFilters(filters);
    }
    setOpen(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          className={
            hasActiveFilters
              ? "bg-[#244F82] hover:bg-[#1a3a5f]"
              : "border-gray-300 hover:bg-gray-50"
          }
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avanzados
          {hasActiveFilters && (
            <span className="ml-2 bg-white text-[#244F82] rounded-full px-2 py-0.5 text-xs font-semibold">
              Activo
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-gray-900">
            Filtros Avanzados
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            Refina tu búsqueda de cotizaciones aplicando múltiples criterios
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* Folio */}
            <div className="space-y-2">
              <Label htmlFor="folio" className="text-sm font-medium text-gray-700">
                Folio
              </Label>
              <Input
                id="folio"
                placeholder="Ej: COT-2025-001"
                value={localFilters.folio || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, folio: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-sm font-medium text-gray-700">
                Cliente
              </Label>
              <Input
                id="cliente"
                placeholder="Buscar por nombre de cliente..."
                value={localFilters.cliente}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, cliente: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado
              </Label>
              <Select
                value={localFilters.estado}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, estado: value })
                }
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos los estados</SelectItem>
                  <SelectItem value="Borrador">Borrador</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Autor */}
            <div className="space-y-2">
              <Label htmlFor="autor" className="text-sm font-medium text-gray-700">
                Autor
              </Label>
              <Input
                id="autor"
                placeholder="Buscar por autor..."
                value={localFilters.autor || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, autor: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Rango de Fechas de Creación */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Rango de Fechas de Creación
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fechaInicio" className="text-xs text-gray-600">
                    Desde
                  </Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={localFilters.fechaInicio || ""}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, fechaInicio: e.target.value })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin" className="text-xs text-gray-600">
                    Hasta
                  </Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={localFilters.fechaFin || ""}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, fechaFin: e.target.value })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
              </div>
            </div>

            {/* Rango de Fechas de Cierre */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Rango de Fechas de Cierre
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fechaCierreInicio" className="text-xs text-gray-600">
                    Desde
                  </Label>
                  <Input
                    id="fechaCierreInicio"
                    type="date"
                    value={localFilters.fechaCierreInicio || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        fechaCierreInicio: e.target.value,
                      })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaCierreFin" className="text-xs text-gray-600">
                    Hasta
                  </Label>
                  <Input
                    id="fechaCierreFin"
                    type="date"
                    value={localFilters.fechaCierreFin || ""}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, fechaCierreFin: e.target.value })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
              </div>
            </div>

            {/* Rango de Monto */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Rango de Monto (CLP)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="montoMin" className="text-xs text-gray-600">
                    Mínimo
                  </Label>
                  <Input
                    id="montoMin"
                    type="number"
                    placeholder="0"
                    value={localFilters.montoMin || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        montoMin: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
                <div>
                  <Label htmlFor="montoMax" className="text-xs text-gray-600">
                    Máximo
                  </Label>
                  <Input
                    id="montoMax"
                    type="number"
                    placeholder="999999999"
                    value={localFilters.montoMax || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        montoMax: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-[#244F82] hover:bg-[#1a3a5f]"
          >
            <Check className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
