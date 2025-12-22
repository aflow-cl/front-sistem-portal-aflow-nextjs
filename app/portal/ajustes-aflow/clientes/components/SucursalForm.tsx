"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building } from "lucide-react";
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
import type { SucursalData } from "../../types/ajustes";

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

const sucursalSchema = z.object({
  nombre: z.string().min(1, "Nombre de sucursal es requerido"),
  direccion: z.string().min(1, "Dirección es requerida"),
  region: z.string().min(1, "Región es requerida"),
  comuna: z.string().min(1, "Comuna es requerida"),
  telefono: z.string().min(1, "Teléfono es requerido"),
  email: z.string().email("Email inválido"),
});

type SucursalFormValues = z.infer<typeof sucursalSchema>;

interface SucursalFormProps {
  initialData?: SucursalData | null;
  clienteNombre?: string;
  onSubmit: (data: SucursalData) => void;
  onBack: () => void;
}

export function SucursalForm({ initialData, clienteNombre, onSubmit, onBack }: SucursalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SucursalFormValues>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: initialData || {
      nombre: clienteNombre ? `${clienteNombre} - Casa Matriz` : "Casa Matriz",
      direccion: "",
      region: "",
      comuna: "",
      telefono: "",
      email: "",
    },
  });

  const watchRegion = watch("region");

  const handleFormSubmit = (data: SucursalFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Building className="w-5 h-5 text-[#244F82] mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">Sucursal Principal</p>
          <p className="text-sm text-gray-600 mt-1">
            Registra la dirección principal donde opera el cliente. Podrás agregar más sucursales después.
          </p>
        </div>
      </div>

      {/* Nombre de Sucursal */}
      <div>
        <Label htmlFor="nombre">Nombre de Sucursal *</Label>
        <Input
          id="nombre"
          {...register("nombre")}
          placeholder="Casa Matriz"
          className={errors.nombre ? "border-red-500" : ""}
        />
        {errors.nombre && (
          <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <Label htmlFor="direccion">Dirección *</Label>
        <Input
          id="direccion"
          {...register("direccion")}
          placeholder="Av. Libertador Bernardo O'Higgins 123"
          className={errors.direccion ? "border-red-500" : ""}
        />
        {errors.direccion && (
          <p className="text-sm text-red-600 mt-1">{errors.direccion.message}</p>
        )}
      </div>

      {/* Región y Comuna */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="region">Región *</Label>
          <Select
            value={watchRegion}
            onValueChange={(value) => setValue("region", value)}
          >
            <SelectTrigger id="region" className={errors.region ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              {REGIONES_CHILE.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && (
            <p className="text-sm text-red-600 mt-1">{errors.region.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="comuna">Comuna *</Label>
          <Input
            id="comuna"
            {...register("comuna")}
            placeholder="Santiago"
            className={errors.comuna ? "border-red-500" : ""}
            disabled={!watchRegion}
          />
          {errors.comuna && (
            <p className="text-sm text-red-600 mt-1">{errors.comuna.message}</p>
          )}
          {!watchRegion && (
            <p className="text-xs text-gray-500 mt-1">Selecciona primero una región</p>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            {...register("telefono")}
            placeholder="+56 2 2345 6789"
            className={errors.telefono ? "border-red-500" : ""}
          />
          {errors.telefono && (
            <p className="text-sm text-red-600 mt-1">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="sucursal@ejemplo.cl"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button
          type="submit"
          className="bg-[#244F82] hover:bg-[#0c3b64]"
        >
          Siguiente
        </Button>
      </div>
    </form>
  );
}
