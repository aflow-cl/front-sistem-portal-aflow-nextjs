"use client";

import { useEffect } from "react";
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
import { Save, X } from "lucide-react";
import { createProducto, updateProducto } from "../../api/maestroService";
import type {
  Proveedor,
  Producto,
  CreateProductoInput,
  UpdateProductoInput,
  UnidadMedida,
  EstadoRegistro,
} from "../../types/maestroNegocio";

interface ProductoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor: Proveedor;
  producto?: Producto | null;
}

interface FormData {
  nombre: string;
  descripcion: string;
  valorInterno: number;
  unidadMedida: UnidadMedida;
  estado: EstadoRegistro;
  codigo?: string;
  categoria?: string;
}

const UNIDADES_MEDIDA: UnidadMedida[] = ["UN", "M2", "M3", "ML", "KG", "HR", "GL", "DIA"];

export function ProductoFormModal({
  open,
  onOpenChange,
  proveedor,
  producto,
}: ProductoFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!producto;

  const form = useForm<FormData>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      valorInterno: 0,
      unidadMedida: "UN",
      estado: "Activo",
      codigo: "",
      categoria: "",
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = form;

  // Cargar datos del producto si está editando
  useEffect(() => {
    if (producto) {
      reset({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        valorInterno: producto.valorInterno,
        unidadMedida: producto.unidadMedida,
        estado: producto.estado,
        codigo: producto.codigo || "",
        categoria: producto.categoria || "",
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        valorInterno: 0,
        unidadMedida: "UN",
        estado: "Activo",
        codigo: "",
        categoria: "",
      });
    }
  }, [producto, reset]);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const input: CreateProductoInput = {
        proveedorId: proveedor.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        valorInterno: data.valorInterno,
        unidadMedida: data.unidadMedida,
        estado: data.estado,
        codigo: data.codigo || undefined,
        categoria: data.categoria || undefined,
      };
      return createProducto(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Producto creado exitosamente");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error al crear producto", {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!producto) throw new Error("No hay producto para actualizar");

      const input: UpdateProductoInput = {
        id: producto.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        valorInterno: data.valorInterno,
        unidadMedida: data.unidadMedida,
        estado: data.estado,
        codigo: data.codigo || undefined,
        categoria: data.categoria || undefined,
      };
      return updateProducto(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Producto actualizado exitosamente");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar producto", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique la información del producto"
              : "Complete los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              {...register("nombre", { required: "El nombre es requerido" })}
              placeholder="Ej: Cemento Portland"
            />
            {errors.nombre && (
              <p className="text-xs text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          {/* Código y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código/SKU</Label>
              <Input
                id="codigo"
                {...register("codigo")}
                placeholder="Ej: CEM-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                {...register("categoria")}
                placeholder="Ej: Materiales"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              {...register("descripcion", { required: "La descripción es requerida" })}
              placeholder="Descripción detallada del producto..."
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Valor y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorInterno">Valor Interno *</Label>
              <Input
                id="valorInterno"
                type="number"
                step="0.01"
                min="0"
                {...register("valorInterno", {
                  required: "El valor es requerido",
                  valueAsNumber: true,
                  min: { value: 0, message: "El valor debe ser positivo" },
                })}
                placeholder="0.00"
              />
              {errors.valorInterno && (
                <p className="text-xs text-red-600">{errors.valorInterno.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
              <Select
                value={watch("unidadMedida")}
                onValueChange={(value) => setValue("unidadMedida", value as UnidadMedida)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES_MEDIDA.map((unidad) => (
                    <SelectItem key={unidad} value={unidad}>
                      {unidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select
              value={watch("estado")}
              onValueChange={(value) => setValue("estado", value as EstadoRegistro)}
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

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#244F82] hover:bg-[#1a3a5f]"
              disabled={isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {isPending
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                ? "Actualizar"
                : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
