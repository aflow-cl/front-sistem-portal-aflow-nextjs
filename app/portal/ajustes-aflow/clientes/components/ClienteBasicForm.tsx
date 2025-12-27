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
  primerNombre: z.string().optional(),
  segundoNombre: z.string().optional(),
  apellidoPaterno: z.string().optional(),
  apellidoMaterno: z.string().optional(),
  // Empresa
  razonSocial: z.string().optional(),
  nombreFantasia: z.string().optional(),
  giro: z.string().optional(),
  // Común
  telefono: z.string().min(1, "Teléfono es requerido"),
  email: z.string().email("Email inválido"),
  sitioWeb: z.string().optional(),
    nombreContacto: z.string().min(1, "Nombre completo de contacto es requerido"),
}).refine(
  (data) => {
    if (data.tipoPersona === "persona-natural") {
      return !!data.primerNombre && !!data.apellidoPaterno;
    }
    return true;
  },
  {
    message: "Primer nombre y apellido paterno son requeridos para persona natural",
    path: ["primerNombre"],
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
      nombreContacto: "",
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
      if (!data.primerNombre || !data.apellidoPaterno) {
        toast.error("Primer nombre y apellido paterno son requeridos para persona natural");
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2 p-2">
      {/* Selector de Tipo de Persona */}
      <div className="bg-white border border-gray-200 rounded-lg p-0.5 mb-1">
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
      <div className="mt-0 mb-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <Label htmlFor="primerNombre">Primer Nombre *</Label>
              <Input
                id="primerNombre"
                {...register("primerNombre")}
                placeholder="Juan"
                className={errors.primerNombre ? "border-red-500" : ""}
              />
              {errors.primerNombre && (
                <p className="text-sm text-red-600 mt-1">{errors.primerNombre.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="segundoNombre">Segundo Nombre</Label>
              <Input
                id="segundoNombre"
                {...register("segundoNombre")}
                placeholder="Carlos"
                className={errors.segundoNombre ? "border-red-500" : ""}
              />
              {errors.segundoNombre && (
                <p className="text-sm text-red-600 mt-1">{errors.segundoNombre.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
            <div>
              <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
              <Input
                id="apellidoPaterno"
                {...register("apellidoPaterno")}
                placeholder="García"
                className={errors.apellidoPaterno ? "border-red-500" : ""}
              />
              {errors.apellidoPaterno && (
                <p className="text-sm text-red-600 mt-1">{errors.apellidoPaterno.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
              <Input
                id="apellidoMaterno"
                {...register("apellidoMaterno")}
                placeholder="López"
                className={errors.apellidoMaterno ? "border-red-500" : ""}
              />
              {errors.apellidoMaterno && (
                <p className="text-sm text-red-600 mt-1">{errors.apellidoMaterno.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Campos Empresa */}
      {tipoPersona === "empresa" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
          {/* Nombre completo de contacto */}
          {/* Nombre completo de contacto y sitio web en la misma fila */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1 mb-1">
        <div className="col-span-6">
          <Label htmlFor="nombreContacto">Nombre completo de contacto *</Label>
          <Input
            id="nombreContacto"
            {...register("nombreContacto")}
            placeholder="Ej: Juan Pérez"
            className={errors.nombreContacto ? "border-red-500" : ""}
          />
          {errors.nombreContacto && (
            <p className="text-sm text-red-600 mt-1">{errors.nombreContacto.message}</p>
          )}
        </div>
        <div className="col-span-6">
          <Label htmlFor="sitioWeb">Sitio Web</Label>
          <Input
            id="sitioWeb"
            {...register("sitioWeb")}
            placeholder="www.ejemplo.cl"
          />
        </div>
      </div>
     
      {/* Botones de Navegación */}
      <div className="flex justify-between pt-1 border-t mt-1 gap-1">
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
