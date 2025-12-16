/**
 * Modal para crear/editar Contratante
 * Formulario dinámico que muta según RUT (Persona Natural vs Empresa)
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Mail, Phone, FileText, AlertCircle } from "lucide-react";
import { validateRut, formatRut } from "@/lib/utils";
import { toast } from "sonner";
import {
  Contratante,
  CreateContratanteInput,
  UpdateContratanteInput,
  TipoPersona,
} from "../../types/maestroNegocio";

// Schema de validación con Zod
const contratanteSchema = z.object({
  tipoPersona: z.enum(["persona-natural", "empresa"]),
  rut: z
    .string()
    .min(1, "El RUT es obligatorio")
    .refine((val) => validateRut(val), "RUT inválido"),
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
  razonSocial: z.string().optional(),
  giro: z.string().optional(),
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  estado: z.enum(["Activo", "Inactivo"]),
  notas: z.string().optional(),
}).refine(
  (data) => {
    if (data.tipoPersona === "persona-natural") {
      return !!data.nombres && !!data.apellidos;
    }
    return true;
  },
  {
    message: "Nombres y Apellidos son obligatorios para Persona Natural",
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
    message: "Razón Social y Giro son obligatorios para Empresa",
    path: ["razonSocial"],
  }
);

type ContratanteFormValues = z.infer<typeof contratanteSchema>;

interface ContratanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratante?: Contratante | null;
  onSave: (input: CreateContratanteInput | UpdateContratanteInput) => Promise<void>;
}

export function ContratanteModal({
  open,
  onOpenChange,
  contratante,
  onSave,
}: ContratanteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!contratante;

  // Determinar tipo de persona según RUT (regla: RUT < 70M = Persona Natural)
  const determinarTipoPersona = (rut: string): TipoPersona => {
    const cleanRut = rut.replace(/[^0-9]/g, "");
    const rutNumber = parseInt(cleanRut.slice(0, -1), 10);
    return rutNumber < 70000000 ? "persona-natural" : "empresa";
  };

  const form = useForm<ContratanteFormValues>({
    resolver: zodResolver(contratanteSchema),
    defaultValues: {
      tipoPersona: "empresa",
      rut: "",
      nombres: "",
      apellidos: "",
      razonSocial: "",
      giro: "",
      email: "",
      telefono: "",
      estado: "Activo",
      notas: "",
    },
  });

  const watchRut = form.watch("rut");
  const watchTipoPersona = form.watch("tipoPersona");

  // Auto-detectar tipo de persona cuando cambia el RUT
  useEffect(() => {
    if (watchRut && watchRut.length >= 8) {
      const tipoDetectado = determinarTipoPersona(watchRut);
      if (tipoDetectado !== watchTipoPersona) {
        form.setValue("tipoPersona", tipoDetectado);
        toast.info(
          tipoDetectado === "persona-natural"
            ? "RUT detectado: Persona Natural"
            : "RUT detectado: Empresa"
        );
      }
    }
  }, [watchRut, watchTipoPersona, form]);

  // Cargar datos al editar
  useEffect(() => {
    if (contratante && open) {
      form.reset({
        tipoPersona: contratante.tipoPersona,
        rut: contratante.rut,
        nombres: contratante.tipoPersona === "persona-natural" ? contratante.nombres : "",
        apellidos: contratante.tipoPersona === "persona-natural" ? contratante.apellidos : "",
        razonSocial: contratante.tipoPersona === "empresa" ? contratante.razonSocial : "",
        giro: contratante.tipoPersona === "empresa" ? contratante.giro : "",
        email: contratante.email,
        telefono: contratante.telefono,
        estado: contratante.estado,
        notas: contratante.notas || "",
      });
    } else if (!open) {
      form.reset();
    }
  }, [contratante, open, form]);

  // Handler de RUT con formato
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    form.setValue("rut", formatted);
  };

  // Submit
  const onSubmit = async (data: ContratanteFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await onSave({
          id: contratante!.id,
          ...data,
        } as UpdateContratanteInput);
      } else {
        await onSave(data as CreateContratanteInput);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Error al guardar", {
        description: error instanceof Error ? error.message : "Intente nuevamente",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isEditing ? (
              <>
                <FileText className="w-5 h-5 text-[#244F82]" />
                Editar Contratante
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-[#FF7A00]" />
                Nuevo Contratante
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Detección automática del tipo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Detección automática de tipo
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  El tipo se detecta según el RUT: menor a 70.000.000 = Persona Natural,
                  mayor o igual = Empresa
                </p>
              </div>
            </div>

            {/* Badge de tipo actual */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Tipo detectado:</span>
              <Badge
                variant="outline"
                className={
                  watchTipoPersona === "persona-natural"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }
              >
                {watchTipoPersona === "persona-natural" ? (
                  <><User className="w-3 h-3 mr-1" /> Persona Natural</>
                ) : (
                  <><Building2 className="w-3 h-3 mr-1" /> Empresa</>
                )}
              </Badge>
            </div>

            <Separator />

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
                      onChange={handleRutChange}
                      maxLength={12}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos condicionales según tipo */}
            {watchTipoPersona === "persona-natural" ? (
              <div className="grid grid-cols-2 gap-4">
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
                        <Input {...field} placeholder="Pérez González" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Empresa Ejemplo SpA" />
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
                      <FormLabel>Giro Comercial *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Construcción y Servicios" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Separator />

            {/* Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="contacto@ejemplo.cl"
                          className="pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="+56 9 1234 5678"
                          className="pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notas */}
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Información adicional sobre el contratante..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FF7A00] hover:bg-[#FF7A00]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
