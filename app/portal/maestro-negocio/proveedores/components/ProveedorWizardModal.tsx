"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ProveedorWizardStepper, type WizardStep } from "./ProveedorWizardStepper";
import { ProveedorBasicForm } from "./ProveedorBasicForm";
import { ProveedorContactForm } from "./ProveedorContactForm";
import { ProveedorDireccionForm } from "./ProveedorDireccionForm";
import { ProductosForm } from "./ProductosForm";
import { ProveedorResumenStep } from "./ProveedorResumenStep";
import { createProveedor } from "../../api/maestroService";
import type {
  CreateProveedorInput,
  Direccion,
  CreateProductoInput,
} from "../../types/maestroNegocio";

const WIZARD_STEPS: WizardStep[] = [
  { id: 0, title: "Proveedor", description: "Datos básicos" },
  { id: 1, title: "Contacto", description: "Email y teléfono" },
  { id: 2, title: "Sucursal", description: "Dirección principal" },
  { id: 3, title: "Productos", description: "Catálogo de productos" },
  { id: 4, title: "Resumen", description: "Confirmación" },
];

export interface ProveedorBasicData {
  tipoPersona: "persona-natural" | "empresa";
  rut: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  giro?: string;
}

export interface ProveedorContactData {
  email: string;
  telefono: string;
  notas?: string;
}

export interface ProveedorWizardData {
  basic: ProveedorBasicData | null;
  contact: ProveedorContactData | null;
  direccion: Direccion | null;
  productos: CreateProductoInput[];
}

interface ProveedorWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProveedorWizardModal({ open, onOpenChange }: ProveedorWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [wizardData, setWizardData] = useState<ProveedorWizardData>({
    basic: null,
    contact: null,
    direccion: null,
    productos: [],
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: ProveedorWizardData) => {
      if (!data.basic || !data.contact) {
        throw new Error("Datos incompletos");
      }

      const proveedorInput: CreateProveedorInput = {
        tipoPersona: data.basic.tipoPersona,
        rut: data.basic.rut,
        nombres: data.basic.nombres,
        apellidos: data.basic.apellidos,
        razonSocial: data.basic.razonSocial,
        giro: data.basic.giro,
        email: data.contact.email,
        telefono: data.contact.telefono,
        estado: "Activo",
        notas: data.contact.notas,
      };

      return createProveedor(proveedorInput);
    },
    onSuccess: (newProveedor) => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      
      const displayName = newProveedor.tipoPersona === "empresa" 
        ? newProveedor.razonSocial 
        : `${newProveedor.nombres} ${newProveedor.apellidos}`;
      
      toast.success("Proveedor creado exitosamente", {
        description: `${displayName} ha sido registrado en el sistema.`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error("Error al crear proveedor", {
        description: error.message || "Ocurrió un error al procesar la solicitud.",
      });
    },
  });

  const handleClose = () => {
    setCurrentStep(0);
    setWizardData({
      basic: null,
      contact: null,
      direccion: null,
      productos: [],
    });
    onOpenChange(false);
  };

  const handleCancelClick = () => {
    if (wizardData.basic || wizardData.contact || wizardData.direccion || wizardData.productos.length > 0) {
      setShowCancelDialog(true);
    } else {
      handleClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    handleClose();
  };

  // Step handlers
  const handleBasicSubmit = (data: ProveedorBasicData) => {
    setWizardData((prev) => ({ ...prev, basic: data }));
    setCurrentStep(1);
    toast.success("Datos básicos guardados");
  };

  const handleContactSubmit = (data: ProveedorContactData) => {
    setWizardData((prev) => ({ ...prev, contact: data }));
    setCurrentStep(2);
    toast.success("Datos de contacto guardados");
  };

  const handleDireccionSubmit = (data: Direccion) => {
    setWizardData((prev) => ({ ...prev, direccion: data }));
    setCurrentStep(3);
    toast.success("Dirección guardada");
  };

  const handleProductosSubmit = (data: CreateProductoInput[]) => {
    setWizardData((prev) => ({ ...prev, productos: data }));
    setCurrentStep(4);
    toast.success(`${data.length} producto(s) agregado(s)`);
  };

  const handleFinalSubmit = () => {
    if (!wizardData.basic || !wizardData.contact) {
      toast.error("Faltan datos requeridos");
      return;
    }

    createMutation.mutate(wizardData);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Nuevo Proveedor - Asistente de Creación</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelClick}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Wizard Stepper */}
          <ProveedorWizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

          {/* Step Content */}
          <div className="mt-6">
            {currentStep === 0 && (
              <ProveedorBasicForm
                initialData={wizardData.basic}
                onSubmit={handleBasicSubmit}
                onBack={handleCancelClick}
              />
            )}

            {currentStep === 1 && (
              <ProveedorContactForm
                initialData={wizardData.contact}
                onSubmit={handleContactSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 2 && (
              <ProveedorDireccionForm
                initialData={wizardData.direccion}
                proveedorNombre={
                  wizardData.basic?.tipoPersona === "empresa"
                    ? wizardData.basic.razonSocial || ""
                    : `${wizardData.basic?.nombres || ""} ${wizardData.basic?.apellidos || ""}`
                }
                onSubmit={handleDireccionSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <ProductosForm
                initialData={wizardData.productos}
                onSubmit={handleProductosSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <ProveedorResumenStep
                wizardData={wizardData}
                onSubmit={handleFinalSubmit}
                onBack={handleBack}
                onEdit={handleEditStep}
                isSubmitting={createMutation.isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar creación de proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Se perderán todos los datos ingresados en el asistente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
