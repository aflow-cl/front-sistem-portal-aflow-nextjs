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
import { useState } from "react";
import { toast } from "sonner";
import { TipoPersona, EstadoRegistro } from "../../types/maestroNegocio";

export interface ProveedorFilters {
  busqueda: string;
  tipoPersona: TipoPersona | "all";
  estado: EstadoRegistro | "all";
  email?: string;
  giro?: string;
  telefono?: string;
  productosMin?: number;
  productosMax?: number;
}

interface AdvancedFiltersProps {
  filters: ProveedorFilters;
  onApplyFilters: (filters: ProveedorFilters) => void;
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
  const [localFilters, setLocalFilters] = useState<ProveedorFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpen(false);
    toast.success("Filtros aplicados correctamente");
  };

  const handleClear = () => {
    const emptyFilters: ProveedorFilters = {
      busqueda: "",
      tipoPersona: "all",
      estado: "all",
      email: "",
      giro: "",
      productosMin: undefined,
      productosMax: undefined,
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
            Refina tu búsqueda de proveedores aplicando múltiples criterios
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* RUT / Nombre / Email */}
            <div className="space-y-2">
              <Label htmlFor="busqueda" className="text-sm font-medium text-gray-700">
                Búsqueda General
              </Label>
              <Input
                id="busqueda"
                placeholder="RUT, nombre, razón social, email..."
                value={localFilters.busqueda}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, busqueda: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Tipo de Persona */}
            <div className="space-y-2">
              <Label htmlFor="tipoPersona" className="text-sm font-medium text-gray-700">
                Tipo de Persona
              </Label>
              <Select
                value={localFilters.tipoPersona}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, tipoPersona: value as TipoPersona | "all" })
                }
              >
                <SelectTrigger className="border-gray-300">
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
              <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado
              </Label>
              <Select
                value={localFilters.estado}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, estado: value as EstadoRegistro | "all" })
                }
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={localFilters.email || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, email: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Giro (solo para empresas) */}
            <div className="space-y-2">
              <Label htmlFor="giro" className="text-sm font-medium text-gray-700">
                Giro Comercial
              </Label>
              <Input
                id="giro"
                placeholder="Buscar por giro..."
                value={localFilters.giro || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, giro: e.target.value })
                }
                className="border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
              <p className="text-xs text-gray-500">
                Solo aplica para empresas
              </p>
            </div>

            {/* Rango de Productos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Cantidad de Productos
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="productosMin" className="text-xs text-gray-600">
                    Mínimo
                  </Label>
                  <Input
                    id="productosMin"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={localFilters.productosMin || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        productosMin: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="border-gray-300 focus:border-[#244F82]"
                  />
                </div>
                <div>
                  <Label htmlFor="productosMax" className="text-xs text-gray-600">
                    Máximo
                  </Label>
                  <Input
                    id="productosMax"
                    type="number"
                    min="0"
                    placeholder="999"
                    value={localFilters.productosMax || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        productosMax: e.target.value ? parseInt(e.target.value) : undefined,
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
