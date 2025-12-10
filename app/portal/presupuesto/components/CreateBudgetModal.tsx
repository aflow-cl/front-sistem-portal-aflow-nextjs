"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  Save,
  FileDown,
  Send,
  PlusCircle,
  Trash2,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Palette,
  Mail,
  Package,
} from "lucide-react";
import type { CreateBudgetInput } from "@/types/presupuesto";

// ============================================
// SCHEMA DE VALIDACIÓN CON ZOD
// ============================================

const budgetItemSchema = z.object({
  id: z.string(),
  producto: z.string().min(1, "El producto es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  unidadMedida: z.enum(["UN", "M2", "M3", "KG", "LT", "HR", "DIA", "MES"]),
  cantidad: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precioUnitario: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  iva: z.number().min(0).max(100, "El IVA debe estar entre 0 y 100"),
  utilidad: z.number().min(0).max(100, "La utilidad debe estar entre 0 y 100"),
  total: z.number(),
});

const budgetFormSchema = z.object({
  // 1. Datos Generales
  folio: z.string(),
  fechaCreacion: z.string(),
  clienteNombre: z.string().min(1, "El nombre del cliente es requerido"),
  clienteDireccion: z.string().optional(),
  clienteEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  clienteTelefono: z.string().optional(),
  proyecto: z.string().min(1, "El proyecto o título es requerido"),
  estado: z.enum(["Borrador", "En revisión", "Aprobado", "Rechazado", "Enviado"]),
  moneda: z.enum(["CLP", "USD", "EUR"]),
  tipoCambio: z.number().min(0, "El tipo de cambio debe ser mayor a 0"),

  // 2. Ítems del Presupuesto
  items: z.array(budgetItemSchema).min(1, "Debe agregar al menos un ítem"),

  // 3. Totales y Condiciones
  descuentoPorcentaje: z.number().min(0).max(100),
  descuentoMonto: z.number().min(0),
  condicionesPago: z.string().optional(),
  observacionesInternas: z.string().optional(),

  // 4. Personalización Visual
  colorPrincipal: z.string(),
  formato: z.enum(["Vertical", "Horizontal"]),
  mostrarCantidad: z.boolean(),
  mostrarPrecioUnitario: z.boolean(),
  mostrarIva: z.boolean(),
  mostrarUtilidad: z.boolean(),
  mostrarTotal: z.boolean(),

  // 5. Envío
  adjuntarPDF: z.boolean(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

// ============================================
// PROPS DEL COMPONENTE
// ============================================

interface CreateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBudgetInput) => void;
  isSubmitting: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function CreateBudgetModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateBudgetModalProps) {
  // Inicializar formulario con React Hook Form + Zod
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      folio: `P-${Date.now().toString().slice(-6)}`,
      fechaCreacion: new Date().toISOString().split("T")[0],
      clienteNombre: "",
      clienteDireccion: "",
      clienteEmail: "",
      clienteTelefono: "",
      proyecto: "",
      estado: "Borrador",
      moneda: "CLP",
      tipoCambio: 1,
      items: [
        {
          id: crypto.randomUUID(),
          producto: "",
          descripcion: "",
          unidadMedida: "UN",
          cantidad: 1,
          precioUnitario: 0,
          iva: 19,
          utilidad: 0,
          total: 0,
        },
      ],
      descuentoPorcentaje: 0,
      descuentoMonto: 0,
      condicionesPago: "",
      observacionesInternas: "",
      colorPrincipal: "#1E88E5",
      formato: "Vertical",
      mostrarCantidad: true,
      mostrarPrecioUnitario: true,
      mostrarIva: true,
      mostrarUtilidad: false,
      mostrarTotal: true,
      adjuntarPDF: true,
    },
  });

  // Control de items dinámicos
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch para cálculos automáticos
  const watchItems = form.watch("items");
  const watchDescuentoPorcentaje = form.watch("descuentoPorcentaje");
  const watchDescuentoMonto = form.watch("descuentoMonto");

  // ============================================
  // CÁLCULOS AUTOMÁTICOS DE TOTALES
  // ============================================

  const totales = useMemo(() => {
    // Calcular total de cada ítem
    const itemsConTotal = watchItems.map((item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      const conIva = conUtilidad * (1 + item.iva / 100);
      return conIva;
    });

    const subtotal = itemsConTotal.reduce((acc, total) => acc + total, 0);
    
    // Calcular IVA total (asumiendo que ya está incluido en cada item)
    const ivaTotal = watchItems.reduce((acc, item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      const iva = conUtilidad * (item.iva / 100);
      return acc + iva;
    }, 0);

    // Aplicar descuento
    const descuento = watchDescuentoMonto || (subtotal * watchDescuentoPorcentaje) / 100;
    const totalGeneral = subtotal - descuento;

    return {
      subtotal,
      ivaTotal,
      descuento,
      totalGeneral,
    };
  }, [watchItems, watchDescuentoPorcentaje, watchDescuentoMonto]);

  // Actualizar totales de items individuales
  useEffect(() => {
    watchItems.forEach((item, index) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      const conIva = conUtilidad * (1 + item.iva / 100);
      
      if (item.total !== conIva) {
        form.setValue(`items.${index}.total`, conIva, { shouldValidate: false });
      }
    });
  }, [watchItems, form]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFormSubmit = (values: BudgetFormValues) => {
    // Transformar a formato CreateBudgetInput (adaptación temporal)
    const data: CreateBudgetInput = {
      cliente: values.clienteNombre,
      descripcion: values.proyecto,
      monto: totales.totalGeneral,
    };
    onSubmit(data);
  };

  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      producto: "",
      descripcion: "",
      unidadMedida: "UN",
      cantidad: 1,
      precioUnitario: 0,
      iva: 19,
      utilidad: 0,
      total: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 gap-0 w-[98vw] sm:w-full">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-aflow-blue to-blue-700 text-white p-4 sm:p-6 sticky top-0 z-10 rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 pr-8">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span className="truncate">Crear Nuevo Presupuesto</span>
          </DialogTitle>
        </DialogHeader>

        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* ============================================ */}
            {/* 1. DATOS GENERALES */}
            {/* ============================================ */}
            <Card className="shadow-sm border-aflow-blue/20">
              <CardHeader className="bg-gradient-to-r from-aflow-blue/5 to-blue-50 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-aflow-blue text-sm sm:text-base">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  1. Datos Generales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  
                  {/* Folio */}
                  <FormField
                    control={form.control}
                    name="folio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Folio</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha */}
                  <FormField
                    control={form.control}
                    name="fechaCreacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Fecha de Creación
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Estado */}
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Borrador">Borrador</SelectItem>
                            <SelectItem value="En revisión">En revisión</SelectItem>
                            <SelectItem value="Aprobado">Aprobado</SelectItem>
                            <SelectItem value="Rechazado">Rechazado</SelectItem>
                            <SelectItem value="Enviado">Enviado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cliente Nombre */}
                  <FormField
                    control={form.control}
                    name="clienteNombre"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs font-semibold">
                          Cliente <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Constructora Andes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Proyecto */}
                  <FormField
                    control={form.control}
                    name="proyecto"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel className="text-xs">
                          Proyecto o Título <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Instalación eléctrica edificio corporativo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dirección */}
                  <FormField
                    control={form.control}
                    name="clienteDireccion"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs font-semibold">Dirección del Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Av. Providencia 1234, Santiago" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Moneda */}
                  <FormField
                    control={form.control}
                    name="moneda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Moneda
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLP">CLP</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo de Cambio */}
                  <FormField
                    control={form.control}
                    name="tipoCambio"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs font-semibold">Tipo de Cambio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ============================================ */}
            {/* 2. ÍTEMS DEL PRESUPUESTO */}
            {/* ============================================ */}
            <Card className="shadow-sm border-aflow-blue/20">
              <CardHeader className="bg-gradient-to-r from-aflow-blue/5 to-blue-50 p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-aflow-blue text-sm sm:text-base">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    2. Ítems del Presupuesto
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 w-full sm:w-auto text-xs"
                  >
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Agregar Ítem
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-2 border-gray-200 shadow-sm">
                      <CardContent className="pt-3 sm:pt-4 p-3 sm:p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-xs sm:text-sm text-gray-700">Ítem {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                          {/* Producto */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.producto`}
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel className="text-xs font-semibold">
                                  Producto/Servicio <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Ej: Cable eléctrico 12 AWG" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Unidad de Medida */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.unidadMedida`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Unidad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="UN">UN</SelectItem>
                                    <SelectItem value="M2">M2</SelectItem>
                                    <SelectItem value="M3">M3</SelectItem>
                                    <SelectItem value="KG">KG</SelectItem>
                                    <SelectItem value="LT">LT</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="DIA">DIA</SelectItem>
                                    <SelectItem value="MES">MES</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Cantidad */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.cantidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Cantidad</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Descripción */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.descripcion`}
                            render={({ field }) => (
                              <FormItem className="lg:col-span-4">
                                <FormLabel className="text-xs">Descripción</FormLabel>
                                <FormControl>
                                  <Textarea
                                    rows={2}
                                    placeholder="Descripción detallada del producto o servicio..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Precio Unitario */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.precioUnitario`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Precio Unitario</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* IVA */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.iva`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">IVA (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Utilidad */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.utilidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Utilidad (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="1"
                                    min="0"
                                    max="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Total (readonly) */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.total`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Total</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    readOnly
                                    className="bg-gray-50 font-semibold text-aflow-blue"
                                    value={field.value.toLocaleString("es-CL", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ============================================ */}
            {/* 3. TOTALES Y CONDICIONES */}
            {/* ============================================ */}
            <Card className="shadow-sm border-aflow-blue/20">
              <CardHeader className="bg-gradient-to-r from-aflow-blue/5 to-blue-50 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-aflow-blue text-sm sm:text-base">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  3. Totales y Condiciones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Totales (Columna Izquierda) */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">
                          {totales.subtotal.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">IVA Total:</span>
                        <span className="font-semibold">
                          {totales.ivaTotal.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Descuento:</span>
                        <span className="font-semibold text-red-600">
                          -{totales.descuento.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="h-px bg-gray-300 my-2"></div>
                      <div className="flex justify-between text-base sm:text-lg">
                        <span className="font-bold text-gray-800">Total General:</span>
                        <span className="font-bold text-aflow-blue">
                          {totales.totalGeneral.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Descuentos */}
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="descuentoPorcentaje"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Descuento (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  form.setValue("descuentoMonto", 0);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descuentoMonto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Descuento (Monto)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  form.setValue("descuentoPorcentaje", 0);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Condiciones (Columna Derecha) */}
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="condicionesPago"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Condiciones Comerciales</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Ej: 50% al inicio, 50% al finalizar. Garantía 12 meses."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="observacionesInternas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Observaciones Internas</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Notas privadas del presupuesto..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ============================================ */}
            {/* 4. PERSONALIZACIÓN Y ENVÍO (ACCORDION) */}
            {/* ============================================ */}
            <Accordion type="single" collapsible className="w-full">
              
              {/* Personalización Visual */}
              <AccordionItem value="personalizacion" className="border rounded-xl px-3 sm:px-4 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 text-aflow-blue font-semibold text-xs sm:text-sm">
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    4. Personalización Visual
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    
                    {/* Color Principal */}
                    <FormField
                      control={form.control}
                      name="colorPrincipal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Color Principal</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input type="color" {...field} className="h-10 w-20" />
                              <Input {...field} placeholder="#1E88E5" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Formato Documento */}
                    <FormField
                      control={form.control}
                      name="formato"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Formato Documento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Vertical">Vertical</SelectItem>
                              <SelectItem value="Horizontal">Horizontal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Columnas Visibles */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Mostrar / Ocultar Columnas</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl">
                      
                      <FormField
                        control={form.control}
                        name="mostrarCantidad"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs cursor-pointer">Cantidad</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarPrecioUnitario"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs cursor-pointer">Precio Unit.</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarIva"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs cursor-pointer">IVA</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarUtilidad"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs cursor-pointer">Utilidad</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarTotal"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs cursor-pointer">Total</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Envío y Control */}
              <AccordionItem value="envio" className="border rounded-xl px-3 sm:px-4 shadow-sm mt-3 sm:mt-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 text-aflow-blue font-semibold text-xs sm:text-sm">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    5. Envío y Control
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="clienteEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Correo Electrónico del Cliente</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="cliente@empresa.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Teléfono */}
                    <FormField
                      control={form.control}
                      name="clienteTelefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Teléfono / WhatsApp</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+56 9 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Adjuntar PDF */}
                    <FormField
                      control={form.control}
                      name="adjuntarPDF"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0 sm:col-span-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs cursor-pointer font-normal">
                            Adjuntar PDF del presupuesto al enviar por email
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            </div>
            
            {/* ============================================ */}
            {/* BOTONES DE ACCIÓN (STICKY FOOTER) */}
            {/* ============================================ */}
            <div className="sticky bottom-0 bg-white border-t-2 border-aflow-blue/20 pt-3 sm:pt-4 pb-2 px-3 sm:px-6 rounded-b-xl sm:rounded-b-2xl shadow-lg">
              <div className="flex flex-col gap-2 sm:gap-3">
                
                {/* Guardar Borrador */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.setValue("estado", "Borrador");
                    form.handleSubmit(handleFormSubmit)();
                  }}
                  className="w-full rounded-xl border-2 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Guardar Borrador
                </Button>

                {/* Generar PDF */}
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    // TODO: Implementar generación de PDF
                    alert("Funcionalidad de PDF en desarrollo");
                  }}
                  className="w-full bg-aflow-blue hover:bg-aflow-blue-light text-white rounded-xl text-xs sm:text-sm h-9 sm:h-10"
                >
                  <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Generar PDF
                </Button>

                {/* Enviar Presupuesto */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-xs sm:text-sm h-9 sm:h-10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Enviar Presupuesto
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
