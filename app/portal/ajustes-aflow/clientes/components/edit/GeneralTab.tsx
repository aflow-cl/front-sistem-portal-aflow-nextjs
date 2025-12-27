"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Cliente } from "../../../types/ajustes";

const generalSchema = z.object({
  rut: z.string().min(1, "RUT es requerido"),
  razonSocial: z.string().min(1, "Razón social es requerida"),
  nombreFantasia: z.string().optional(),
  giro: z.string().min(1, "Giro es requerido"),
  direccion: z.string().min(1, "Dirección es requerida"),
  region: z.string().min(1, "Región es requerida"),
  comuna: z.string().min(1, "Comuna es requerida"),
  telefono: z.string().min(1, "Teléfono es requerido"),
  email: z.string().email("Email inválido"),
  sitioWeb: z.string().optional(),
  contactoPrincipal: z.string().min(1, "Contacto principal es requerido"),
  // emailContacto eliminado
});

type GeneralFormValues = z.infer<typeof generalSchema>;

interface GeneralTabProps {
  cliente: Cliente;
  onUpdate: (data: Partial<Cliente>) => void;
}

export function GeneralTab({ cliente, onUpdate }: GeneralTabProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      rut: cliente.rut,
      razonSocial: cliente.razonSocial,
      nombreFantasia: cliente.nombreFantasia || "",
      giro: cliente.giro,
      direccion: cliente.direccion,
      region: cliente.region,
      comuna: cliente.comuna,
      telefono: cliente.telefono,
      email: cliente.email,
      sitioWeb: cliente.sitioWeb || "",
      contactoPrincipal: cliente.contactoPrincipal,
      // emailContacto eliminado
    },
  });

  const onSubmit = (data: GeneralFormValues) => {
    onUpdate(data);
  };

  return (
    <form onBlur={handleSubmit(onSubmit)} className="space-y-3 pt-2 pb-2 mt-1 mb-1">
      <Card>
        <CardHeader className="pt-2 pb-2">
          <CardTitle className="text-base flex items-center justify-between mt-0 mb-0">
            Información General
            <Badge variant={cliente.activo ? "default" : "outline"}>
              {cliente.activo ? "Activo" : "Inactivo"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                {...register("rut")}
                className={errors.rut ? "border-red-500" : ""}
              />
              {errors.rut && (
                <p className="text-xs text-red-500 mt-1">{errors.rut.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="razonSocial">Razón Social *</Label>
              <Input
                id="razonSocial"
                {...register("razonSocial")}
                className={errors.razonSocial ? "border-red-500" : ""}
              />
              {errors.razonSocial && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.razonSocial.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="nombreFantasia">Nombre Fantasía</Label>
              <Input id="nombreFantasia" {...register("nombreFantasia")} />
            </div>
            <div>
              <Label htmlFor="giro">Giro *</Label>
              <Input
                id="giro"
                {...register("giro")}
                className={errors.giro ? "border-red-500" : ""}
              />
              {errors.giro && (
                <p className="text-xs text-red-500 mt-1">{errors.giro.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pt-2 pb-2">
          <CardTitle className="text-base mt-0 mb-0">Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                {...register("telefono")}
                placeholder="+56 9 1234 5678"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sitioWeb">Sitio Web</Label>
              <Input
                id="sitioWeb"
                {...register("sitioWeb")}
                placeholder="www.ejemplo.cl"
              />
            </div>
            <div>
              <Label htmlFor="contactoPrincipal">Contacto Principal *</Label>
              <Input
                id="contactoPrincipal"
                {...register("contactoPrincipal")}
                className={errors.contactoPrincipal ? "border-red-500" : ""}
              />
              {errors.contactoPrincipal && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.contactoPrincipal.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              {/* Email Contacto eliminado */}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 text-center">
        Los cambios se guardan automáticamente al salir de cada campo
      </p>
    </form>
  );
}
