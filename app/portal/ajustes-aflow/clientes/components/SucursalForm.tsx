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
import { useMemo } from "react";
import { regionesChile } from "../../../presupuesto/crear/data/regionesChile";
import type { SucursalData } from "../../types/ajustes";

// REGIONES_CHILE replaced by regionesChile import

const sucursalSchema = z.object({
  nombre: z.string().min(1, "Nombre de sucursal es requerido"),
  direccion: z.string().min(1, "Dirección es requerida"),
  numero: z.string().optional(),
  complemento: z.string().optional(),
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
      numero: "",
      complemento: "",
      region: "",
      comuna: "",
      telefono: "",
      email: "",
    },
  });

  const watchRegion = watch("region");
  const watchComuna = watch("comuna");

  // Find selected region object
  const selectedRegion = useMemo(() =>
    regionesChile.find(r => r.nombre === watchRegion),
    [watchRegion]
  );
  // Flatten all comunas in the region
  const comunasOptions = useMemo(() => {
    if (!selectedRegion) return [];
    return selectedRegion.ciudades.flatMap(c => c.comunas);
  }, [selectedRegion]);

  const handleFormSubmit = (data: SucursalFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
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

      {/* Dirección, Número y Complemento */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-6">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            {...register("direccion")}
            placeholder="Av. Libertador Bernardo O'Higgins"
            className={errors.direccion ? "border-red-500" : ""}
          />
          {errors.direccion && (
            <p className="text-sm text-red-600 mt-1">{errors.direccion.message}</p>
          )}
        </div>
        <div className="col-span-12 md:col-span-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            {...register("numero")}
            placeholder="123"
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            {...register("complemento")}
            placeholder="Depto, Oficina, etc."
          />
        </div>
      </div>

      {/* Región y Comuna */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="region">Región *</Label>
          <Select
            value={watchRegion}
            onValueChange={(value) => {
              setValue("region", value);
              setValue("comuna", ""); // Reset comuna when region changes
            }}
          >
            <SelectTrigger id="region" className={errors.region ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              {regionesChile.map((region) => (
                <SelectItem key={region.nombre} value={region.nombre}>
                  {region.nombre}
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
          <Select
            value={watchComuna}
            onValueChange={(value) => setValue("comuna", value)}
            disabled={!watchRegion || comunasOptions.length === 0}
          >
            <SelectTrigger id="comuna" className={errors.comuna ? "border-red-500" : ""}>
              <SelectValue placeholder={watchRegion ? "Seleccionar comuna" : "Selecciona primero una región"} />
            </SelectTrigger>
            <SelectContent>
              {comunasOptions.map((comuna) => (
                <SelectItem key={comuna} value={comuna}>
                  {comuna}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.comuna && (
            <p className="text-sm text-red-600 mt-1">{errors.comuna.message}</p>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      <div className="flex justify-between pt-2 border-t mt-2 gap-2">
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
