"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TipoPersonaSelector } from "@/components/ui/tipo-persona-selector";
import type { ProveedorBasicData } from "./ProveedorWizardModal";

const baseSchema = z.object({
  tipoPersona: z.enum(["persona-natural", "empresa"]),
  rut: z.string().min(1, "RUT es requerido").refine(
    (val) => {
      // Simple RUT validation
      const cleaned = val.replace(/[^0-9Kk]/g, '');
      return cleaned.length >= 8 && cleaned.length <= 9;
    },
    { message: "RUT inv\u00e1lido" }
  ),
});

const personaNaturalSchema = baseSchema.extend({
  tipoPersona: z.literal("persona-natural"),
  nombres: z.string().min(2, "Nombres son requeridos"),
  apellidos: z.string().min(2, "Apellidos son requeridos"),
});

const empresaSchema = baseSchema.extend({
  tipoPersona: z.literal("empresa"),
  razonSocial: z.string().min(2, "Razón Social es requerida"),
  giro: z.string().min(2, "Giro es requerido"),
});

const proveedorBasicSchema = z.discriminatedUnion("tipoPersona", [
  personaNaturalSchema,
  empresaSchema,
]);

type ProveedorBasicFormData = z.infer<typeof proveedorBasicSchema>;

interface ProveedorBasicFormProps {
  initialData: ProveedorBasicData | null;
  onSubmit: (data: ProveedorBasicData) => void;
  onBack: () => void;
}

export function ProveedorBasicForm({
  initialData,
  onSubmit,
  onBack,
}: ProveedorBasicFormProps) {
  const form = useForm<ProveedorBasicFormData>({
    resolver: zodResolver(proveedorBasicSchema),
    defaultValues: initialData || {
      tipoPersona: "empresa",
      rut: "",
      razonSocial: "",
      giro: "",
    },
  });

  const tipoPersona = form.watch("tipoPersona");

  const handleSubmit = (data: ProveedorBasicFormData) => {
    onSubmit(data);
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simple RUT formatting
    let value = e.target.value.replace(/[^0-9Kk]/g, '');
    if (value.length > 1) {
      const body = value.slice(0, -1);
      const dv = value.slice(-1);
      value = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
    }
    form.setValue("rut", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Datos Básicos del Proveedor</h3>
          <p className="text-sm text-gray-600">
            Ingrese la información básica del proveedor. Todos los campos son requeridos.
          </p>

          {/* Tipo de Persona */}
          <FormField
            control={form.control}
            name="tipoPersona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Persona *</FormLabel>
                <FormControl>
                  <TipoPersonaSelector
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RUT */}
          <FormField
            control={form.control}
            name="rut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="12.345.678-9"
                    onChange={handleRUTChange}
                    maxLength={12}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos condicionales según tipo de persona */}
          {tipoPersona === "persona-natural" && (
            <>
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Juan Carlos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="González Pérez" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {tipoPersona === "empresa" && (
            <>
              <FormField
                control={form.control}
                name="razonSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Empresa Proveedora Ltda." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="giro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giro *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Comercio de productos y servicios" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#244F82] hover:bg-[#1a3a5f]">
            Siguiente
          </Button>
        </div>
      </form>
    </Form>
  );
}
