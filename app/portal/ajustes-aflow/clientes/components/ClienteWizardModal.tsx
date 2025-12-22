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
import { ClienteWizardStepper, type WizardStep } from "./ClienteWizardStepper";
import { ClienteBasicForm } from "./ClienteBasicForm";
import { SucursalForm } from "./SucursalForm";
import { UsuarioForm } from "./UsuarioForm";
import { ServiciosSelectionForm } from "./ServiciosSelectionForm";
import { ResumenStep } from "./ResumenStep";
import { createClienteCompleto } from "../../api/ajustesService";
import type {
  ClienteWizardData,
  ClienteBasicData,
  SucursalData,
  UsuarioData,
  ServicioSeleccionado,
} from "../../types/ajustes";

const WIZARD_STEPS: WizardStep[] = [
  { id: 0, title: "Cliente", description: "Datos básicos" },
  { id: 1, title: "Sucursal", description: "Dirección principal" },
  { id: 2, title: "Usuario", description: "Usuario inicial" },
  { id: 3, title: "Servicios", description: "Servicios contratados" },
  { id: 4, title: "Resumen", description: "Confirmación" },
];

interface ClienteWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClienteWizardModal({ open, onOpenChange }: ClienteWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [wizardData, setWizardData] = useState<ClienteWizardData>({
    cliente: null,
    sucursal: null,
    usuario: null,
    servicios: [],
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createClienteCompleto,
    onSuccess: (newCliente) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      toast.success("Cliente creado exitosamente", {
        description: `${newCliente.razonSocial} ha sido registrado en el sistema.`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error("Error al crear cliente", {
        description: error.message || "Ocurrió un error al procesar la solicitud.",
      });
    },
  });

  const handleClose = () => {
    setCurrentStep(0);
    setWizardData({
      cliente: null,
      sucursal: null,
      usuario: null,
      servicios: [],
    });
    onOpenChange(false);
  };

  const handleCancelClick = () => {
    if (wizardData.cliente || wizardData.sucursal || wizardData.usuario) {
      setShowCancelDialog(true);
    } else {
      handleClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    handleClose();
  };

  // Step 1: Cliente Basic Data
  const handleClienteSubmit = (data: ClienteBasicData) => {
    setWizardData((prev) => ({ ...prev, cliente: data }));
    setCurrentStep(1);
    toast.success("Datos del cliente guardados");
  };

  // Step 2: Sucursal
  const handleSucursalSubmit = (data: SucursalData) => {
    setWizardData((prev) => ({ ...prev, sucursal: data }));
    setCurrentStep(2);
    toast.success("Datos de sucursal guardados");
  };

  // Step 3: Usuario
  const handleUsuarioSubmit = (data: UsuarioData) => {
    setWizardData((prev) => ({ ...prev, usuario: data }));
    setCurrentStep(3);
    toast.success("Datos de usuario guardados");
  };

  // Step 4: Servicios
  const handleServiciosSubmit = (data: ServicioSeleccionado[]) => {
    setWizardData((prev) => ({ ...prev, servicios: data }));
    setCurrentStep(4);
    toast.success("Servicios seleccionados");
  };

  // Step 5: Final Submit
  const handleFinalSubmit = () => {
    if (!wizardData.cliente || !wizardData.sucursal || !wizardData.usuario) {
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

  const getClienteNombre = () => {
    if (!wizardData.cliente) return "";
    if (wizardData.cliente.tipoPersona === "persona-natural") {
      return `${wizardData.cliente.nombres} ${wizardData.cliente.apellidos}`;
    }
    return wizardData.cliente.razonSocial || "";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Nuevo Cliente - Asistente de Creación</DialogTitle>
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
          <ClienteWizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

          {/* Step Content */}
          <div className="mt-6">
            {currentStep === 0 && (
              <ClienteBasicForm
                initialData={wizardData.cliente}
                onSubmit={handleClienteSubmit}
                onBack={handleCancelClick}
              />
            )}

            {currentStep === 1 && (
              <SucursalForm
                initialData={wizardData.sucursal}
                clienteNombre={getClienteNombre()}
                onSubmit={handleSucursalSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 2 && (
              <UsuarioForm
                initialData={wizardData.usuario}
                onSubmit={handleUsuarioSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <ServiciosSelectionForm
                initialData={wizardData.servicios}
                onSubmit={handleServiciosSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <ResumenStep
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
            <AlertDialogTitle>¿Cancelar creación de cliente?</AlertDialogTitle>
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
