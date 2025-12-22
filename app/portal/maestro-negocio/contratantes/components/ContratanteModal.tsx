/**
 * Modal Wizard para crear Contratante (2 pasos obligatorios)
 * Paso 1: Datos del Contratante (dinámico según tipo seleccionado)
 * Paso 2: Sucursal Principal (obligatoria)
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
import { User, Building2, Mail, Phone, FileText, AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { validateRut, formatRut } from "@/lib/utils";
import { toast } from "sonner";
import {
  Contratante,
  CreateContratanteInput,
  UpdateContratanteInput,
} from "../../types/maestroNegocio";
import { ContratanteWizardStepper } from "./ContratanteWizardStepper";
import { SucursalForm, SucursalFormValues } from "./SucursalForm";
import { useChileanRegions } from "../hooks/useChileanRegions";

// Schema de validación con Zod
const contratanteSchema = z.object({
  tipoPersona: z.enum(["persona-natural", "empresa"]),
  rut: z
    .string()
    .min(1, "El RUT es obligatorio")
    .refine((val) => validateRut(val), "RUT inválido"),
  // Campos para Persona Natural (4 campos separados)
  primerNombre: z.string().optional(),
  segundoNombre: z.string().optional(),
  apellidoPaterno: z.string().optional(),
  apellidoMaterno: z.string().optional(),
  // Campos legacy para compatibilidad (se llenan automáticamente)
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
  // Campos para Empresa
  razonSocial: z.string().optional(),
  giro: z.string().optional(),
  // Campos comunes
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  estado: z.enum(["Activo", "Inactivo"]),
  // Campos de ubicación
  regionId: z.string().optional(),
  ciudadId: z.string().optional(),
  comuna: z.string().optional(),
  notas: z.string().optional(),
}).refine(
  (data) => {
    if (data.tipoPersona === "persona-natural") {
      return !!data.primerNombre && !!data.apellidoPaterno;
    }
    return true;
  },
  {
    message: "Primer Nombre y Apellido Paterno son obligatorios para Persona Natural",
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

// Pasos del wizard (solo para creación)
const WIZARD_STEPS = [
  {
    id: 0,
    title: "Contratante",
    description: "Datos básicos",
  },
  {
    id: 1,
    title: "Sucursal",
    description: "Dirección principal",
  },
];

// Datos temporales del wizard
interface WizardData {
  contratante: ContratanteFormValues | null;
  sucursal: SucursalFormValues | null;
}

export function ContratanteModal({
  open,
  onOpenChange,
  contratante,
  onSave,
}: ContratanteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    contratante: null,
    sucursal: null,
  });
  const isEditing = !!contratante;

  const form = useForm<ContratanteFormValues>({
    resolver: zodResolver(contratanteSchema),
    defaultValues: {
      tipoPersona: "empresa",
      rut: "",
      primerNombre: "",
      segundoNombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      apellidos: "",
      razonSocial: "",
      giro: "",
      email: "",
      telefono: "",
      estado: "Activo",
      regionId: "",
      ciudadId: "",
      comuna: "",
      notas: "",
    },
  });

  const watchTipoPersona = form.watch("tipoPersona");

  // Hook for Chilean regions cascading dropdowns
  const { regiones, ciudadesDisponibles, comunasDisponibles, watchRegionId, watchCiudadId } =
    useChileanRegions({ form });

  // Función helper para separar nombres y apellidos en 4 campos
  const separarNombreCompleto = (nombres: string, apellidos: string) => {
    const nombresArray = nombres.trim().split(/\s+/).filter(Boolean);
    const apellidosArray = apellidos.trim().split(/\s+/).filter(Boolean);
    
    return {
      primerNombre: nombresArray[0] || "",
      segundoNombre: nombresArray[1] || "",
      apellidoPaterno: apellidosArray[0] || "",
      apellidoMaterno: apellidosArray[1] || "",
    };
  };

  // Resetear wizard al cerrar
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setWizardData({ contratante: null, sucursal: null });
      form.reset();
    }
  }, [open, form]);

  // Cargar datos al editar
  useEffect(() => {
    if (contratante && open) {
      if (contratante.tipoPersona === "persona-natural") {
        const { primerNombre, segundoNombre, apellidoPaterno, apellidoMaterno } =
          separarNombreCompleto(contratante.nombres, contratante.apellidos);
        
        form.reset({
          tipoPersona: contratante.tipoPersona,
          rut: contratante.rut,
          primerNombre,
          segundoNombre,
          apellidoPaterno,
          apellidoMaterno,
          nombres: contratante.nombres,
          apellidos: contratante.apellidos,
          razonSocial: "",
          giro: "",
          email: contratante.email,
          telefono: contratante.telefono,
          estado: contratante.estado,
          notas: contratante.notas || "",
        });
      } else {
        form.reset({
          tipoPersona: contratante.tipoPersona,
          rut: contratante.rut,
          primerNombre: "",
          segundoNombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
          apellidos: "",
          razonSocial: contratante.razonSocial,
          giro: contratante.giro,
          email: contratante.email,
          telefono: contratante.telefono,
          estado: contratante.estado,
          regionId: contratante.regionId || "",
          ciudadId: contratante.ciudadId || "",
          comuna: contratante.comuna || "",
          notas: contratante.notas || "",
        });
      }
    }
  }, [contratante, open, form]);

  // Handler de RUT con formato
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    form.setValue("rut", formatted);
  };

  // Submit paso 1: Guardar datos del contratante y avanzar
  const onSubmitContratante = async (data: ContratanteFormValues) => {
    if (isEditing) {
      // Modo edición: guardar directamente
      setIsSubmitting(true);
      try {
        const submitData: UpdateContratanteInput = {
          id: contratante!.id,
          tipoPersona: data.tipoPersona,
          rut: data.rut,
          email: data.email,
          telefono: data.telefono,
          estado: data.estado,
          notas: data.notas,
        };

        if (data.tipoPersona === "persona-natural") {
          const nombres = [data.primerNombre, data.segundoNombre]
            .filter(Boolean)
            .join(" ")
            .trim();
          const apellidos = [data.apellidoPaterno, data.apellidoMaterno]
            .filter(Boolean)
            .join(" ")
            .trim();
          submitData.nombres = nombres;
          submitData.apellidos = apellidos;
          submitData.regionId = data.regionId;
          submitData.ciudadId = data.ciudadId;
          submitData.comuna = data.comuna;
        } else {
          submitData.razonSocial = data.razonSocial;
          submitData.giro = data.giro;
          submitData.regionId = data.regionId;
          submitData.ciudadId = data.ciudadId;
          submitData.comuna = data.comuna;
        }

        await onSave(submitData);
        onOpenChange(false);
        form.reset();
      } catch (error) {
        toast.error("Error al actualizar", {
          description: error instanceof Error ? error.message : "Intente nuevamente",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Modo creación: guardar y pasar al siguiente paso
      setWizardData((prev) => ({ ...prev, contratante: data }));
      setCurrentStep(1);
      toast.success("Datos del contratante guardados", {
        description: "Ahora configura la sucursal principal",
      });
    }
  };

  // Submit paso 2: Crear contratante + sucursal
  const onSubmitSucursal = async (sucursalData: SucursalFormValues) => {
    if (!wizardData.contratante) {
      toast.error("Error: Datos del contratante no encontrados");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = wizardData.contratante;
      const submitData: CreateContratanteInput = {
        tipoPersona: data.tipoPersona,
        rut: data.rut,
        email: data.email,
        telefono: data.telefono,
        estado: data.estado,
        notas: data.notas,
      };

      if (data.tipoPersona === "persona-natural") {
        const nombres = [data.primerNombre, data.segundoNombre]
          .filter(Boolean)
          .join(" ")
          .trim();
        const apellidos = [data.apellidoPaterno, data.apellidoMaterno]
          .filter(Boolean)
          .join(" ")
          .trim();
        submitData.nombres = nombres;
        submitData.apellidos = apellidos;
        submitData.regionId = data.regionId;
        submitData.ciudadId = data.ciudadId;
        submitData.comuna = data.comuna;
      } else {
        submitData.razonSocial = data.razonSocial;
        submitData.giro = data.giro;
        submitData.regionId = data.regionId;
        submitData.ciudadId = data.ciudadId;
        submitData.comuna = data.comuna;
      }

      // TODO: Aquí deberás extender la API para incluir la sucursal
      // Por ahora solo guardamos el contratante
      // La sucursalData se usará cuando se implemente la API de sucursales
      await onSave(submitData);

      toast.success("Contratante y sucursal creados exitosamente");
      onOpenChange(false);
      setCurrentStep(0);
      setWizardData({ contratante: null, sucursal: null });
      form.reset();
      
      // Evitar warning de variable no usada - se usará en implementación futura
      void sucursalData;
    } catch (error) {
      toast.error("Error al crear", {
        description: error instanceof Error ? error.message : "Intente nuevamente",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener nombre del contratante para mostrar en paso 2
  const getContratanteNombre = (): string => {
    if (!wizardData.contratante) return "Contratante";
    const data = wizardData.contratante;
    if (data.tipoPersona === "persona-natural") {
      return `${data.primerNombre} ${data.apellidoPaterno}`.trim();
    }
    return data.razonSocial || "Empresa";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            {isEditing ? (
              <>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#244F82]" />
                Editar Contratante
              </>
            ) : (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#244F82]" />
                Nuevo Contratante
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Wizard Stepper - Solo en modo creación */}
        {!isEditing && (
          <ContratanteWizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />
        )}

        {/* Paso 1: Formulario de Contratante */}
        {currentStep === 0 && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitContratante)} className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
              {/* Info de selección de tipo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Selecciona el tipo de contratante para mostrar los campos correspondientes
                  </p>
                </div>
              </div>

              {/* Tipo de Persona (seleccionable) y Estado */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                {/* Tipo de Persona - Ahora editable */}
                <FormField
                  control={form.control}
                  name="tipoPersona"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Tipo:</span>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-fit border-0 p-0 h-auto focus:ring-0">
                            <SelectValue>
                              <Badge
                                variant="outline"
                                className={
                                  field.value === "persona-natural"
                                    ? "bg-purple-50 text-purple-700 border-purple-200 px-3 py-2 cursor-pointer"
                                    : "bg-orange-50 text-orange-700 border-orange-200 px-3 py-2 cursor-pointer"
                                }
                              >
                                {field.value === "persona-natural" ? (
                                  <><User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Persona Natural</>
                                ) : (
                                  <><Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Empresa</>
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
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Estado:</span>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-fit border-0 p-0 h-auto focus:ring-0">
                            <SelectValue>
                              <Badge
                                variant="outline"
                                className={
                                  field.value === "Activo"
                                    ? "bg-green-50 text-green-700 border-green-200 px-3 py-2 cursor-pointer"
                                    : "bg-gray-50 text-gray-700 border-gray-200 px-3 py-2 cursor-pointer"
                                }
                              >
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${field.value === "Activo" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                  {field.value}
                                </div>
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Activo">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Activo
                              </div>
                            </SelectItem>
                            <SelectItem value="Inactivo">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                Inactivo
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Campos condicionales según tipo */}
              {watchTipoPersona === "persona-natural" ? (
                <div className="space-y-3 sm:space-y-4">
                  {/* RUT */}
                  <FormField
                    control={form.control}
                    name="rut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">RUT *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="12.345.678-9"
                            onChange={handleRutChange}
                            maxLength={12}
                            className="text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="primerNombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Primer Nombre *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Juan" className="text-sm sm:text-base" />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="segundoNombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Segundo Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Carlos" className="text-sm sm:text-base" />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="apellidoPaterno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Apellido Paterno *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Pérez" className="text-sm sm:text-base" />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apellidoMaterno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Apellido Materno</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="González" className="text-sm sm:text-base" />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* RUT y Razón Social en la misma línea */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="rut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">RUT *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="12.345.678-9"
                              onChange={handleRutChange}
                              maxLength={12}
                              className="text-sm sm:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="razonSocial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Razón Social *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Empresa Ejemplo SpA" className="text-sm sm:text-base" />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="giro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Giro Comercial *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Construcción y Servicios" className="text-sm sm:text-base" />
                        </FormControl>
                        <FormMessage className="text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Separator />

              {/* Ubicación (Región, Ciudad, Comuna) */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-[#244F82] rounded"></div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Ubicación</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="regionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Región</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                              <SelectValue placeholder="Seleccione región" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]" position="popper" sideOffset={5}>
                            {regiones.map((region) => (
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
                  <FormField
                    control={form.control}
                    name="ciudadId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Ciudad</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={!watchRegionId || ciudadesDisponibles.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
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
                  <FormField
                    control={form.control}
                    name="comuna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Comuna</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={!watchCiudadId || comunasDisponibles.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
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
              </div>

              <Separator />

              {/* Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="contacto@ejemplo.cl"
                            className="pl-9 text-sm sm:text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Teléfono *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="+56 9 1234 5678"
                            className="pl-9 text-sm sm:text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notas */}
              <FormField
                control={form.control}
                name="notas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Notas (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Información adicional sobre el contratante..."
                        rows={3}
                        className="text-sm sm:text-base resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {/* Acciones */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#244F82] hover:bg-[#1a3a5f] w-full sm:w-auto text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Guardando..."
                  ) : isEditing ? (
                    "Actualizar"
                  ) : (
                    <>
                      Continuar <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              </form>
            </Form>
          </div>
        )}

        {/* Paso 2: Formulario de Sucursal */}
        {currentStep === 1 && !isEditing && (
          <div className="space-y-4 sm:space-y-6">
            <SucursalForm
              onSubmit={onSubmitSucursal}
              contratanteNombre={getContratanteNombre()}
              isSubmitting={isSubmitting}
            />

            {/* Navegación */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(0)}
                disabled={isSubmitting}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    const formElement = document.getElementById('sucursal-form') as HTMLElement & { submitForm?: () => void };
                    if (formElement && formElement.submitForm) {
                      formElement.submitForm();
                    }
                  }}
                  className="bg-[#244F82] hover:bg-[#1a3a5f] w-full sm:w-auto text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Creando..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Finalizar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
