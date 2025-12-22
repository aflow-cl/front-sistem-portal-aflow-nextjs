/**
 * Formulario reutilizable de Dirección/Sucursal
 * Usado tanto en el wizard de creación como en la gestión de direcciones
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Building, User, Phone, Mail } from "lucide-react";
import { regionesChile, Ciudad } from "@/app/portal/presupuesto/crear/data/regionesChile";

// Schema de validación
export const direccionSchema = z.object({
  nombre: z.string().min(1, "El nombre de la dirección es obligatorio"),
  regionId: z.string().min(1, "Debe seleccionar una región"),
  ciudadId: z.string().min(1, "Debe seleccionar una ciudad"),
  comuna: z.string().min(1, "Debe seleccionar una comuna"),
  calle: z.string().min(1, "La calle es obligatoria"),
  numero: z.string().min(1, "El número es obligatorio"),
  complemento: z.string().optional(),
  esPrincipal: z.boolean().default(false),
  contactoNombre: z.string().optional(),
  contactoTelefono: z.string().optional(),
  contactoEmail: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type DireccionFormValues = z.infer<typeof direccionSchema>;

interface DireccionFormProps {
  mode: "create" | "edit";
  onSubmit: (data: DireccionFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<DireccionFormValues>;
  isSubmitting?: boolean;
  formId?: string;
  showPrincipalCheckbox?: boolean;
  headerInfo?: {
    title: string;
    description: string;
  };
}

export function DireccionForm({
  mode,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  formId = "direccion-form",
  showPrincipalCheckbox = true,
  headerInfo,
}: DireccionFormProps) {
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<Ciudad[]>([]);
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

  const form = useForm<DireccionFormValues>({
    resolver: zodResolver(direccionSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      regionId: initialData?.regionId || "",
      ciudadId: initialData?.ciudadId || "",
      comuna: initialData?.comuna || "",
      calle: initialData?.calle || "",
      numero: initialData?.numero || "",
      complemento: initialData?.complemento || "",
      esPrincipal: initialData?.esPrincipal ?? false,
      contactoNombre: initialData?.contactoNombre || "",
      contactoTelefono: initialData?.contactoTelefono || "",
      contactoEmail: initialData?.contactoEmail || "",
    },
  });

  const watchRegionId = form.watch("regionId");
  const watchCiudadId = form.watch("ciudadId");

  // Log de debugging (temporal)
  useEffect(() => {
    console.log("📍 DireccionForm - Estado:", {
      regionesDisponibles: regionesChile.length,
      watchRegionId,
      watchCiudadId,
      ciudadesDisponibles: ciudadesDisponibles.length,
      comunasDisponibles: comunasDisponibles.length,
    });
  }, [watchRegionId, watchCiudadId, ciudadesDisponibles, comunasDisponibles]);

  // Actualizar ciudades cuando cambia la región
  useEffect(() => {
    if (watchRegionId) {
      const region = regionesChile.find((r) => r.id.toString() === watchRegionId);
      if (region) {
        console.log("✅ Región seleccionada:", region.nombre, "Ciudades:", region.ciudades.length);
        setCiudadesDisponibles(region.ciudades);
        
        // Solo resetear si la ciudad actual no pertenece a la nueva región
        const currentCiudadId = form.getValues("ciudadId");
        const ciudadExiste = region.ciudades.some(c => c.id.toString() === currentCiudadId);
        
        if (!ciudadExiste) {
          form.setValue("ciudadId", "");
          form.setValue("comuna", "");
          setComunasDisponibles([]);
        }
      }
    } else {
      setCiudadesDisponibles([]);
      setComunasDisponibles([]);
    }
  }, [watchRegionId, form]);

  // Actualizar comunas cuando cambia la ciudad
  useEffect(() => {
    if (watchCiudadId && ciudadesDisponibles.length > 0) {
      const ciudad = ciudadesDisponibles.find((c) => c.id.toString() === watchCiudadId);
      if (ciudad) {
        setComunasDisponibles(ciudad.comunas);
        
        // Solo resetear si la comuna actual no pertenece a la nueva ciudad
        const currentComuna = form.getValues("comuna");
        const comunaExiste = ciudad.comunas.includes(currentComuna);
        
        if (!comunaExiste) {
          form.setValue("comuna", "");
        }
      }
    } else {
      setComunasDisponibles([]);
    }
  }, [watchCiudadId, ciudadesDisponibles, form]);

  // Inicializar cascadas al cargar datos iniciales
  useEffect(() => {
    if (initialData?.regionId) {
      const region = regionesChile.find((r) => r.id.toString() === initialData.regionId);
      if (region) {
        setCiudadesDisponibles(region.ciudades);
        
        if (initialData?.ciudadId) {
          const ciudad = region.ciudades.find((c) => c.id.toString() === initialData.ciudadId);
          if (ciudad) {
            setComunasDisponibles(ciudad.comunas);
          }
        }
      }
    }
  }, [initialData]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      {headerInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-900">
            <span className="font-semibold">{headerInfo.title}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {headerInfo.description}
          </p>
        </div>
      )}

      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre de la Dirección */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Nombre de la Dirección *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...field}
                      placeholder="Ej: Sucursal Principal, Casa Matriz, Bodega Norte"
                      className="pl-9 text-sm sm:text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {/* Checkbox Principal */}
          {showPrincipalCheckbox && (
            <FormField
              control={form.control}
              name="esPrincipal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm sm:text-base">
                      Establecer como dirección principal
                    </FormLabel>
                    <FormDescription className="text-xs sm:text-sm">
                      Esta será la dirección predeterminada para facturación y envíos.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Ubicación */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF7A00]" />
              Ubicación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Región */}
              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Región *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Seleccione región" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]" position="popper" sideOffset={5}>
                        {regionesChile.map((region) => (
                          <SelectItem
                            key={region.id}
                            value={region.id.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {region.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Ciudad */}
              <FormField
                control={form.control}
                name="ciudadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Ciudad *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      defaultValue={field.value}
                      disabled={!watchRegionId}
                    >
                      <FormControl>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Seleccione ciudad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]" position="popper" sideOffset={5}>
                        {ciudadesDisponibles.map((ciudad) => (
                          <SelectItem
                            key={ciudad.id}
                            value={ciudad.id.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {ciudad.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Comuna */}
              <FormField
                control={form.control}
                name="comuna"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs sm:text-sm">Comuna *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      defaultValue={field.value}
                      disabled={!watchCiudadId}
                    >
                      <FormControl>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Seleccione comuna" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]" position="popper" sideOffset={5}>
                        {comunasDisponibles.map((comuna) => (
                          <SelectItem
                            key={comuna}
                            value={comuna}
                            className="text-xs sm:text-sm"
                          >
                            {comuna}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Dirección */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs sm:text-sm">Calle *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej: Av. Apoquindo"
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Número *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234"
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel className="text-xs sm:text-sm">Complemento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Depto 501, Oficina B, etc."
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF7A00]" />
              Contacto en Sucursal (Opcional)
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="contactoNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Nombre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Nombre del contacto"
                          className="pl-9 text-xs sm:text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="contactoTelefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Teléfono</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="+56 9 1234 5678"
                            className="pl-9 text-xs sm:text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactoEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="contacto@ejemplo.cl"
                            className="pl-9 text-xs sm:text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#0033A0] hover:bg-[#0033A0]/90"
            >
              {isSubmitting ? "Guardando..." : mode === "create" ? "Crear Dirección" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
