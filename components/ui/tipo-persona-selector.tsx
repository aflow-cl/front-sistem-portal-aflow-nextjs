"use client";

import { User, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TipoPersona = "persona-natural" | "empresa";

interface TipoPersonaSelectorProps {
  value: TipoPersona;
  onValueChange: (value: TipoPersona) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * TipoPersonaSelector - Selector estandarizado para tipo de persona
 * 
 * Componente reutilizable que implementa el diseño de badge + dropdown
 * usado en el módulo de contratantes como referencia.
 * 
 * @param value - Valor actual: "persona-natural" | "empresa"
 * @param onValueChange - Callback cuando cambia la selección
 * @param label - Texto del label (default: "Tipo:")
 * @param disabled - Deshabilitar el selector
 * @param className - Clases adicionales para el contenedor
 */
export function TipoPersonaSelector({
  value,
  onValueChange,
  label = "Tipo:",
  disabled = false,
  className = "",
}: TipoPersonaSelectorProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
      <Select onValueChange={onValueChange} value={value} disabled={disabled}>
        <SelectTrigger className="w-fit border-0 p-0 h-auto focus:ring-0">
          <SelectValue>
            <Badge
              variant="outline"
              className={
                value === "persona-natural"
                  ? "bg-purple-50 text-purple-700 border-purple-200 px-3 py-2 cursor-pointer"
                  : "bg-orange-50 text-orange-700 border-orange-200 px-3 py-2 cursor-pointer"
              }
            >
              {value === "persona-natural" ? (
                <>
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Persona Natural
                </>
              ) : (
                <>
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Empresa
                </>
              )}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="persona-natural">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Persona Natural
            </div>
          </SelectItem>
          <SelectItem value="empresa">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Empresa
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
