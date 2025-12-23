"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save, X, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipoPersonaSelector } from "@/components/ui/tipo-persona-selector";
import { updateProveedor } from "../../api/maestroService";
import type { 
  Proveedor, 
  UpdateProveedorInput,
  TipoPersona,
  EstadoRegistro 
} from "../../types/maestroNegocio";
import { getDisplayName } from "../../types/maestroNegocio";
import { ProductoCRUDSection } from "./ProductoCRUDSection";

interface ProveedorEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor: Proveedor | null;
}

interface FormData {
  tipoPersona: TipoPersona;
  rut: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  giro?: string;
  email: string;
  telefono: string;
  estado: EstadoRegistro;
  notas?: string;
}

export function ProveedorEditModal({
  open,
  onOpenChange,
  proveedor,
}: ProveedorEditModalProps) {
  const [activeTab, setActiveTab] = useState("datos");
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: proveedor
      ? {
          tipoPersona: proveedor.tipoPersona,
          rut: proveedor.rut,
          nombres: proveedor.tipoPersona === "persona-natural" ? proveedor.nombres : "",
          apellidos: proveedor.tipoPersona === "persona-natural" ? proveedor.apellidos : "",
          razonSocial: proveedor.tipoPersona === "empresa" ? proveedor.razonSocial : "",
          giro: proveedor.tipoPersona === "empresa" ? proveedor.giro : "",
          email: proveedor.email,
          telefono: proveedor.telefono,
          estado: proveedor.estado,
          notas: proveedor.notas || "",
        }
      : undefined,
  });

  const { register, handleSubmit, watch, formState: { errors, isDirty } } = form;
  const tipoPersona = watch("tipoPersona");

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!proveedor) throw new Error("No hay proveedor seleccionado");

      const updateData: UpdateProveedorInput = {
        id: proveedor.id,
        tipoPersona: data.tipoPersona,
        rut: data.rut,
        email: data.email,
        telefono: data.telefono,
        estado: data.estado,
        notas: data.notas,
      };

      if (data.tipoPersona === "persona-natural") {
        updateData.nombres = data.nombres;
        updateData.apellidos = data.apellidos;
      } else {
        updateData.razonSocial = data.razonSocial;
        updateData.giro = data.giro;
      }

      return updateProveedor(updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Proveedor actualizado exitosamente");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar proveedor", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    if (isDirty && !confirm("¿Desea cerrar sin guardar los cambios?")) {
      return;
    }
    onOpenChange(false);
  };

  if (!proveedor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Editar Proveedor: {getDisplayName(proveedor)}
          </DialogTitle>
          <DialogDescription>
            Modifique la información del proveedor y gestione su catálogo de productos
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datos">Datos del Proveedor</TabsTrigger>
            <TabsTrigger value="productos" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Productos ({proveedor.productos?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* TAB: Datos del Proveedor */}
          <TabsContent value="datos" className="flex-1 overflow-y-auto px-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-4">
              {/* Tipo de Persona */}
              <div className="space-y-2">
                <Label>Tipo de Persona</Label>
                <TipoPersonaSelector
                  value={tipoPersona}
                  onValueChange={(value) => form.setValue("tipoPersona", value)}
                  disabled={true}
                />
                <p className="text-xs text-gray-500">
                  No se puede cambiar el tipo de persona después de crear el proveedor
                </p>
              </div>

              {/* RUT */}
              <div className="space-y-2">
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  {...register("rut", { required: "RUT es requerido" })}
                  placeholder="12.345.678-9"
                  disabled={true}
                />
                <p className="text-xs text-gray-500">
                  El RUT no puede ser modificado
                </p>
              </div>

              {/* Campos según tipo de persona */}
              {tipoPersona === "persona-natural" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres *</Label>
                    <Input
                      id="nombres"
                      {...register("nombres", { required: "Nombres son requeridos" })}
                      placeholder="Juan Carlos"
                    />
                    {errors.nombres && (
                      <p className="text-xs text-red-600">{errors.nombres.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      {...register("apellidos", { required: "Apellidos son requeridos" })}
                      placeholder="Pérez González"
                    />
                    {errors.apellidos && (
                      <p className="text-xs text-red-600">{errors.apellidos.message}</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="razonSocial">Razón Social *</Label>
                    <Input
                      id="razonSocial"
                      {...register("razonSocial", { required: "Razón social es requerida" })}
                      placeholder="Empresa S.A."
                    />
                    {errors.razonSocial && (
                      <p className="text-xs text-red-600">{errors.razonSocial.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="giro">Giro Comercial *</Label>
                    <Input
                      id="giro"
                      {...register("giro", { required: "Giro es requerido" })}
                      placeholder="Construcción y servicios"
                    />
                    {errors.giro && (
                      <p className="text-xs text-red-600">{errors.giro.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    placeholder="contacto@empresa.cl"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    {...register("telefono", { required: "Teléfono es requerido" })}
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.telefono && (
                    <p className="text-xs text-red-600">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select
                  value={watch("estado")}
                  onValueChange={(value) => form.setValue("estado", value as EstadoRegistro)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  {...register("notas")}
                  placeholder="Notas adicionales sobre el proveedor..."
                  rows={3}
                />
              </div>

              {/* Advertencia si hay cambios */}
              {isDirty && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Hay cambios sin guardar. Asegúrese de guardar antes de cerrar.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#244F82] hover:bg-[#1a3a5f]"
                  disabled={updateMutation.isPending || !isDirty}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB: Productos */}
          <TabsContent value="productos" className="flex-1 overflow-hidden">
            <ProductoCRUDSection proveedor={proveedor} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
