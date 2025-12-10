"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, Save } from "lucide-react";
import type { CreateBudgetInput } from "@/types/presupuesto";

interface CreateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBudgetInput) => void;
  isSubmitting: boolean;
}

export function CreateBudgetModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateBudgetModalProps) {
  const [formData, setFormData] = useState<CreateBudgetInput>({
    cliente: "",
    descripcion: "",
    monto: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateBudgetInput, string>>>({});

  const handleInputChange = (field: keyof CreateBudgetInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBudgetInput, string>> = {};

    if (!formData.cliente.trim()) {
      newErrors.cliente = "El cliente es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.monto || formData.monto <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ cliente: "", descripcion: "", monto: 0 });
      setErrors({});
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-lg mx-4 shadow-2xl rounded-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Crear Nuevo Presupuesto
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-sm font-medium text-gray-700">
                Cliente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cliente"
                type="text"
                placeholder="Ej: Constructora Andes"
                value={formData.cliente}
                onChange={(e) => handleInputChange("cliente", e.target.value)}
                disabled={isSubmitting}
                className={`rounded-xl ${
                  errors.cliente ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.cliente && (
                <p className="text-xs text-red-500 mt-1">{errors.cliente}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="descripcion"
                rows={3}
                placeholder="Describe el proyecto o servicio..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-aflow-orange focus:border-aflow-orange resize-none ${
                  errors.descripcion
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.descripcion && (
                <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>
              )}
            </div>

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="monto" className="text-sm font-medium text-gray-700">
                Monto (CLP) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="monto"
                type="number"
                min="0"
                step="1"
                placeholder="Ej: 50000"
                value={formData.monto || ""}
                onChange={(e) => handleInputChange("monto", parseFloat(e.target.value) || 0)}
                disabled={isSubmitting}
                className={`rounded-xl ${
                  errors.monto ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.monto && (
                <p className="text-xs text-red-500 mt-1">{errors.monto}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-aflow-orange hover:bg-orange-600 text-white rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
