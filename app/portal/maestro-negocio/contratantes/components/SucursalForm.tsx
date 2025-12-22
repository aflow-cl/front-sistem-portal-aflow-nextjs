/**
 * Formulario de Sucursal para el wizard de creación de Contratante
 * Ahora utiliza el componente DireccionForm reutilizable
 */

"use client";

import { useEffect, useRef } from "react";
import { DireccionForm, DireccionFormValues } from "./DireccionForm";

export type SucursalFormValues = DireccionFormValues;

interface SucursalFormProps {
  onSubmit: (data: SucursalFormValues) => void;
  initialData?: Partial<SucursalFormValues>;
  contratanteNombre: string;
  isSubmitting?: boolean;
}

export function SucursalForm({
  onSubmit,
  initialData,
  contratanteNombre,
  isSubmitting,
}: SucursalFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  // Exponer el método submit al componente padre
  useEffect(() => {
    const formElement = document.getElementById('sucursal-form') as HTMLFormElement;
    if (formElement) {
      formRef.current = formElement;
      (formElement as HTMLFormElement & { submitForm?: () => void }).submitForm = () => {
        // Disparar el submit del formulario
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      };
    }
  }, []);

  // Wrapper para no mostrar botones de acción (el wizard los maneja)
  const handleSubmit = (data: DireccionFormValues) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    // No hacer nada, el wizard maneja la navegación
  };

  return (
    <div>
      <DireccionForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={{
          nombre: "Sucursal Principal",
          esPrincipal: true,
          ...initialData,
        }}
        isSubmitting={isSubmitting}
        formId="sucursal-form"
        showPrincipalCheckbox={true}
        headerInfo={{
          title: `Creando sucursal para: ${contratanteNombre}`,
          description: "Esta será la dirección principal del contratante.",
        }}
      />
      
      {/* Ocultar los botones del form usando CSS ya que el wizard tiene sus propios botones */}
      <style jsx global>{`
        #sucursal-form button[type="submit"],
        #sucursal-form button[type="button"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

