"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Package } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { CreateProductoInput, UnidadMedida } from "../../types/maestroNegocio";

const UNIDADES_MEDIDA: UnidadMedida[] = ["UN", "M2", "M3", "ML", "KG", "HR", "GL", "DIA"];

const productoSchema = z.object({
  nombre: z.string().min(2, "Nombre es requerido"),
  descripcion: z.string().min(5, "Descripción debe tener al menos 5 caracteres"),
  valorInterno: z.number().min(0, "Valor debe ser mayor a 0"),
  unidadMedida: z.enum(["UN", "M2", "M3", "ML", "KG", "HR", "GL", "DIA"]),
  codigo: z.string().optional(),
  categoria: z.string().optional(),
});

const productosFormSchema = z.object({
  productos: z.array(productoSchema).optional(),
});

type ProductosFormData = z.infer<typeof productosFormSchema>;

interface ProductosFormProps {
  initialData: CreateProductoInput[];
  onSubmit: (data: CreateProductoInput[]) => void;
  onBack: () => void;
}

export function ProductosForm({
  initialData,
  onSubmit,
  onBack,
}: ProductosFormProps) {
  const form = useForm<ProductosFormData>({
    resolver: zodResolver(productosFormSchema),
    defaultValues: {
      productos: initialData.length > 0 ? initialData : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productos",
  });

  const handleSubmit = (data: ProductosFormData) => {
    const productosData: CreateProductoInput[] = (data.productos || []).map((p) => ({
      proveedorId: "", // Se asignará cuando se cree el proveedor
      nombre: p.nombre,
      descripcion: p.descripcion,
      valorInterno: p.valorInterno,
      unidadMedida: p.unidadMedida,
      estado: "Activo",
      codigo: p.codigo,
      categoria: p.categoria,
    }));
    
    onSubmit(productosData);
  };

  const handleSkip = () => {
    onSubmit([]);
  };

  const addProducto = () => {
    append({
      nombre: "",
      descripcion: "",
      valorInterno: 0,
      unidadMedida: "UN",
      codigo: "",
      categoria: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Catálogo de Productos (Opcional)
              </h3>
              <p className="text-sm text-gray-600">
                Agregue los productos o servicios que ofrece este proveedor
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addProducto}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </Button>
          </div>

          {fields.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  No hay productos agregados
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Puede agregar productos ahora o hacerlo después
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProducto}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Primer Producto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Producto #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Nombre */}
                        <FormField
                          control={form.control}
                          name={`productos.${index}.nombre`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nombre del producto" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Código */}
                        <FormField
                          control={form.control}
                          name={`productos.${index}.codigo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código/SKU</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="PRO-001" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Descripción */}
                      <FormField
                        control={form.control}
                        name={`productos.${index}.descripcion`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Descripción detallada del producto"
                                rows={2}
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        {/* Valor Interno */}
                        <FormField
                          control={form.control}
                          name={`productos.${index}.valorInterno`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="0"
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Unidad de Medida */}
                        <FormField
                          control={form.control}
                          name={`productos.${index}.unidadMedida`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidad *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unidad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {UNIDADES_MEDIDA.map((unidad) => (
                                    <SelectItem key={unidad} value={unidad}>
                                      {unidad}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Categoría */}
                        <FormField
                          control={form.control}
                          name={`productos.${index}.categoria`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Material, Servicio..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Omitir
            </Button>
            <Button type="submit" className="bg-[#244F82] hover:bg-[#1a3a5f]">
              Siguiente
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
