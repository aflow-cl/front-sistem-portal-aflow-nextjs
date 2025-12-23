"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

export interface ClienteFilters {
  razonSocial: string;
  rut: string;
  email: string;
  region: string;
  estado: string;
  fechaCreacionDesde: string;
  fechaCreacionHasta: string;
  usuariosMin: string;
  usuariosMax: string;
}

interface AdvancedFiltersProps {
  filters: ClienteFilters;
  onApplyFilters: (filters: ClienteFilters) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AdvancedFilters({
  filters,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ClienteFilters>(filters);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpen(false);
    toast.success("Filtros aplicados correctamente");
  };

  const handleClear = () => {
    onClearFilters();
    setOpen(false);
    toast.info("Filtros limpiados");
  };

  const updateFilter = (key: keyof ClienteFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`relative ${
            hasActiveFilters
              ? "border-[#244F82] bg-[#244F82]/5 hover:bg-[#244F82]/10"
              : ""
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros Avanzados
          {hasActiveFilters && (
            <Badge className="ml-2 h-5 bg-white text-[#244F82] hover:bg-white border border-[#244F82]">
              Activo
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Avanzados
          </SheetTitle>
          <SheetDescription>
            Refina tu búsqueda con filtros específicos
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Razón Social */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón Social</Label>
              <Input
                id="razonSocial"
                placeholder="Buscar por razón social..."
                value={localFilters.razonSocial}
                onChange={(e) => updateFilter("razonSocial", e.target.value)}
              />
            </div>

            {/* RUT */}
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                placeholder="Ej: 12345678-9"
                value={localFilters.rut}
                onChange={(e) => updateFilter("rut", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.cl"
                value={localFilters.email}
                onChange={(e) => updateFilter("email", e.target.value)}
              />
            </div>

            {/* Región */}
            <div className="space-y-2">
              <Label htmlFor="region">Región</Label>
              <Select
                value={localFilters.region}
                onValueChange={(value) => updateFilter("region", value)}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {REGIONES_CHILE.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={localFilters.estado}
                onValueChange={(value) => updateFilter("estado", value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Creación */}
            <div className="space-y-2">
              <Label>Fecha de Creación</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fechaDesde" className="text-xs text-gray-600">
                    Desde
                  </Label>
                  <Input
                    id="fechaDesde"
                    type="date"
                    value={localFilters.fechaCreacionDesde}
                    onChange={(e) =>
                      updateFilter("fechaCreacionDesde", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fechaHasta" className="text-xs text-gray-600">
                    Hasta
                  </Label>
                  <Input
                    id="fechaHasta"
                    type="date"
                    value={localFilters.fechaCreacionHasta}
                    onChange={(e) =>
                      updateFilter("fechaCreacionHasta", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Número de Usuarios */}
            <div className="space-y-2">
              <Label>Cantidad de Usuarios</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="usuariosMin" className="text-xs text-gray-600">
                    Mínimo
                  </Label>
                  <Input
                    id="usuariosMin"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={localFilters.usuariosMin}
                    onChange={(e) => updateFilter("usuariosMin", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="usuariosMax" className="text-xs text-gray-600">
                    Máximo
                  </Label>
                  <Input
                    id="usuariosMax"
                    type="number"
                    min="0"
                    placeholder="999"
                    value={localFilters.usuariosMax}
                    onChange={(e) => updateFilter("usuariosMax", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex gap-2 pt-4 border-t">
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
            className="flex-1 bg-[#244F82] hover:bg-[#0c3b64]"
          >
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
