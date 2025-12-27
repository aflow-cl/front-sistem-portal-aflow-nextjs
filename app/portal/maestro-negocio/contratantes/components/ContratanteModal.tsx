/**
 * Modal Wizard para crear Contratante (3 pasos)
 * Paso 1: Datos del Contratante (sin ubicación)
 * Paso 2: Sucursal Principal (con ubicación simplificada)
 * Paso 3: Resumen y confirmación
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileText, User, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { validateRut } from "@/lib/utils";
import { toast } from "sonner";
import {
  Contratante,
  CreateContratanteInput,
  UpdateContratanteInput,
} from "../../types/maestroNegocio";
import { ContratanteWizardStepper } from "./ContratanteWizardStepper";
import { SucursalForm, SucursalFormValues } from "./SucursalForm";
import { ContratanteForm } from "./ContratanteForm";
import { ContratanteResumen } from "./ContratanteResumen";

// Schema de validación con Zod (sin ubicación)
const contratanteSchema = z.object({
  tipoPersona: z.enum(["persona-natural", "empresa"]),
  rut: z
    .string()
    .min(1, "El RUT es obligatorio")
    .refine((val) => validateRut(val), "RUT inválido"),
  // Campos para Persona Natural
  primerNombre: z.string().optional(),
  segundoNombre: z.string().optional(),
  apellidoPaterno: z.string().optional(),
  apellidoMaterno: z.string().optional(),
  // Campos legacy
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
  // Campos para Empresa
  razonSocial: z.string().optional(),
  giro: z.string().optional(),
  // Campos comunes
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  estado: z.enum(["Activo", "Inactivo"]),
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

export type ContratanteFormValues = z.infer<typeof contratanteSchema>;

interface ContratanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratante?: Contratante | null;
  onSave: (input: CreateContratanteInput | UpdateContratanteInput) => Promise<void>;
}

// Pasos del wizard
const WIZARD_STEPS = [
  {
    id: 0,
    title: "Datos Básicos",
    description: "Información del contratante",
  },
  {
    id: 1,
    title: "Sucursal",
    description: "Dirección principal",
  },
  {
    id: 2,
    title: "Resumen",
    description: "Confirmación",
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
      notas: "",
    },
  });

  // Función helper para separar nombres y apellidos
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
          notas: contratante.notas || "",
        });
      }
    }
  }, [contratante, open, form]);

  // Submit paso 1: Guardar datos del contratante y avanzar
  const onSubmitContratante = async (data: ContratanteFormValues) => {
    if (isEditing) {
      // Modo edición: guardar directamente (sin sucursal por ahora en este flujo)
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
        } else {
          submitData.razonSocial = data.razonSocial;
          submitData.giro = data.giro;
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
      // Modo creación: guardar en estado y avanzar
      setWizardData((prev) => ({ ...prev, contratante: data }));
      setCurrentStep(1);
    }
  };

  // Submit paso 2: Guardar sucursal y finalizar
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
      } else {
        submitData.razonSocial = data.razonSocial;
        submitData.giro = data.giro;
      }

      // TODO: Enviar también los datos de la sucursal cuando la API lo soporte
      // Por ahora guardamos el contratante y simulamos que se guardó la sucursal
      await onSave(submitData);

      setWizardData(prev => ({ ...prev, sucursal: sucursalData }));
      setCurrentStep(2); // Ir al resumen

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

  const handleCreateNew = () => {
    setCurrentStep(0);
    setWizardData({ contratante: null, sucursal: null });
    form.reset();
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
              <div className="flex-1 overflow-y-auto">
                <ContratanteForm
                  form={form}
                  onSubmit={onSubmitContratante}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Acciones Paso 1 */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t mt-4">
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
                  onClick={form.handleSubmit(onSubmitContratante)}
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
            </Form>
          </div>
        )}

        {/* Paso 2: Formulario de Sucursal */}
        {currentStep === 1 && !isEditing && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2">
              <SucursalForm
                onSubmit={onSubmitSucursal}
                contratanteNombre={getContratanteNombre()}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Navegación Paso 2 */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-3 pt-4 border-t mt-4">
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

        {/* Paso 3: Resumen */}
        {currentStep === 2 && !isEditing && (
          <ContratanteResumen
            contratante={wizardData.contratante}
            sucursal={wizardData.sucursal}
            onClose={() => onOpenChange(false)}
            onCreateNew={handleCreateNew}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
