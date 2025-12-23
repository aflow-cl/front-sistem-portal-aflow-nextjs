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
import type { Direccion } from "../../types/maestroNegocio";

const direccionSchema = z.object({
  nombre: z.string().min(2, "Nombre de sucursal requerido"),
  calle: z.string().min(2, "Calle es requerida"),
  numero: z.string().min(1, "Número es requerido"),
  comuna: z.string().min(2, "Comuna es requerida"),
  ciudadNombre: z.string().min(2, "Ciudad es requerida"),
  regionNombre: z.string().min(2, "Región es requerida"),
  complemento: z.string().optional(),
  contactoNombre: z.string().optional(),
  contactoTelefono: z.string().optional(),
  contactoEmail: z.string().email().optional().or(z.literal("")),
});

type DireccionFormData = z.infer<typeof direccionSchema>;

interface ProveedorDireccionFormProps {
  initialData: Direccion | null;
  proveedorNombre: string;
  onSubmit: (data: Direccion) => void;
  onBack: () => void;
}

export function ProveedorDireccionForm({
  initialData,
  proveedorNombre,
  onSubmit,
  onBack,
}: ProveedorDireccionFormProps) {
  const form = useForm<DireccionFormData>({
    resolver: zodResolver(direccionSchema),
    defaultValues: initialData || {
      nombre: "Oficina Principal",
      calle: "",
      numero: "",
      comuna: "",
      ciudadNombre: "",
      regionNombre: "",
      complemento: "",
      contactoNombre: "",
      contactoTelefono: "",
      contactoEmail: "",
    },
  });

  const handleSubmit = (data: DireccionFormData) => {
    const direccion: Direccion = {
      id: initialData?.id || crypto.randomUUID(),
      nombre: data.nombre,
      regionId: "1", // Mock - en producción usar selector de regiones
      regionNombre: data.regionNombre,
      ciudadId: "1", // Mock
      ciudadNombre: data.ciudadNombre,
      comuna: data.comuna,
      calle: data.calle,
      numero: data.numero,
      complemento: data.complemento,
      esPrincipal: true,
      contactoNombre: data.contactoNombre,
      contactoTelefono: data.contactoTelefono,
      contactoEmail: data.contactoEmail,
      activa: true,
    };
    onSubmit(direccion);
  };

  const handleSkip = () => {
    // Pasar null para indicar que se saltó este paso
    onSubmit(null as unknown as Direccion);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dirección Principal (Opcional)
            </h3>
            <p className="text-sm text-gray-600">
              Agregue la dirección principal del proveedor{" "}
              <span className="font-medium">{proveedorNombre}</span>
            </p>
          </div>

          {/* Nombre de Sucursal */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Sucursal</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Oficina Principal, Bodega Central" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="calle"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Calle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Av. Libertador Bernardo O'Higgins" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1234" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (Opcional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Piso 5, Oficina 501" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ubicación */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Santiago" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ciudadNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Santiago" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regionNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Región</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Metropolitana" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contacto de Sucursal */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Contacto de Sucursal (Opcional)
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contactoNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del contacto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactoTelefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+56 9 1234 5678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactoEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="contacto@empresa.cl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Omitir
            </Button>
            <Button type="submit" className="bg-[#244F82] hover:bg-[#1a3a5f]">
              Siguiente
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
