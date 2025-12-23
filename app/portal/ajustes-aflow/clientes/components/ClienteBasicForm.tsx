"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipoPersonaSelector } from "@/components/ui/tipo-persona-selector";
import { toast } from "sonner";
import type { ClienteBasicData, TipoPersona } from "../../types/ajustes";

const clienteBasicSchema = z.object({
  tipoPersona: z.enum(["persona-natural", "empresa"]),
  rut: z.string().min(1, "RUT es requerido"),
  // Persona Natural
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
  // Empresa
  razonSocial: z.string().optional(),
  nombreFantasia: z.string().optional(),
  giro: z.string().optional(),
  // Común
  telefono: z.string().min(1, "Teléfono es requerido"),
  email: z.string().email("Email inválido"),
  sitioWeb: z.string().optional(),
}).refine(
  (data) => {
    if (data.tipoPersona === "persona-natural") {
      return !!data.nombres && !!data.apellidos;
    }
    return true;
  },
  {
    message: "Nombres y apellidos son requeridos para persona natural",
    path: ["nombres"],
  }
).refine(
  (data) => {
    if (data.tipoPersona === "empresa") {
      return !!data.razonSocial && !!data.giro;
    }
    return true;
  },
  {
    message: "Razón social y giro son requeridos para empresa",
    path: ["razonSocial"],
  }
);

type ClienteBasicFormValues = z.infer<typeof clienteBasicSchema>;

interface ClienteBasicFormProps {
  initialData?: ClienteBasicData | null;
  onSubmit: (data: ClienteBasicData) => void;
  onBack?: () => void;
}

// Función para detectar tipo de persona basado en RUT
function detectTipoPersona(rut: string): TipoPersona {
  const rutNumerico = parseInt(rut.replace(/\D/g, ""));
  return rutNumerico >= 70000000 ? "empresa" : "persona-natural";
}

export function ClienteBasicForm({ initialData, onSubmit, onBack }: ClienteBasicFormProps) {
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>(
    initialData?.tipoPersona || "empresa"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClienteBasicFormValues>({
    resolver: zodResolver(clienteBasicSchema),
    defaultValues: initialData || {
      tipoPersona: "empresa",
      rut: "",
      telefono: "",
      email: "",
    },
  });

  const watchRut = watch("rut");

  // Auto-detectar tipo de persona al cambiar RUT
  useEffect(() => {
    if (watchRut && watchRut.length >= 8) {
      const detectedTipo = detectTipoPersona(watchRut);
      setTipoPersona(detectedTipo);
      setValue("tipoPersona", detectedTipo);
    }
  }, [watchRut, setValue]);

  const handleFormSubmit = (data: ClienteBasicFormValues) => {
    // Validación adicional
    if (data.tipoPersona === "persona-natural") {
      if (!data.nombres || !data.apellidos) {
        toast.error("Nombres y apellidos son requeridos para persona natural");
        return;
      }
    } else {
      if (!data.razonSocial || !data.giro) {
        toast.error("Razón social y giro son requeridos para empresa");
        return;
      }
    }

    onSubmit(data as ClienteBasicData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Selector de Tipo de Persona */}
      <div className="bg-white border border-gray-200 rounded-lg p-1">
        <TipoPersonaSelector
          value={tipoPersona}
          onValueChange={(value) => {
            setTipoPersona(value);
            setValue("tipoPersona", value);
          }}
          label="Tipo de Cliente:"
        />
      </div>

      {/* RUT */}
      <div>
        <Label htmlFor="rut">RUT *</Label>
        <Input
          id="rut"
          {...register("rut")}
          placeholder={tipoPersona === "empresa" ? "76.123.456-0" : "12.345.678-9"}
          className={errors.rut ? "border-red-500" : ""}
        />
        {errors.rut && (
          <p className="text-sm text-red-600 mt-1">{errors.rut.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Se detectará automáticamente si es persona natural o empresa
        </p>
      </div>

      {/* Campos Persona Natural */}
      {tipoPersona === "persona-natural" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombres">Nombres *</Label>
              <Input
                id="nombres"
                {...register("nombres")}
                placeholder="Juan Carlos"
                className={errors.nombres ? "border-red-500" : ""}
              />
              {errors.nombres && (
                <p className="text-sm text-red-600 mt-1">{errors.nombres.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                {...register("apellidos")}
                placeholder="García López"
                className={errors.apellidos ? "border-red-500" : ""}
              />
              {errors.apellidos && (
                <p className="text-sm text-red-600 mt-1">{errors.apellidos.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Campos Empresa */}
      {tipoPersona === "empresa" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="razonSocial">Razón Social *</Label>
              <Input
                id="razonSocial"
                {...register("razonSocial")}
                placeholder="Empresa S.A."
                className={errors.razonSocial ? "border-red-500" : ""}
              />
              {errors.razonSocial && (
                <p className="text-sm text-red-600 mt-1">{errors.razonSocial.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nombreFantasia">Nombre Fantasía</Label>
              <Input
                id="nombreFantasia"
                {...register("nombreFantasia")}
                placeholder="Mi Empresa"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="giro">Giro *</Label>
            <Input
              id="giro"
              {...register("giro")}
              placeholder="Servicios de Consultoría"
              className={errors.giro ? "border-red-500" : ""}
            />
            {errors.giro && (
              <p className="text-sm text-red-600 mt-1">{errors.giro.message}</p>
            )}
          </div>
        </>
      )}

      {/* Campos Comunes */}
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
            placeholder="contacto@ejemplo.cl"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="sitioWeb">Sitio Web</Label>
        <Input
          id="sitioWeb"
          {...register("sitioWeb")}
          placeholder="www.ejemplo.cl"
        />
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-4 border-t">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className="ml-auto bg-[#244F82] hover:bg-[#0c3b64]"
        >
          Siguiente
        </Button>
      </div>
    </form>
  );
}
