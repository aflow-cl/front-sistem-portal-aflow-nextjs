"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PlusCircle,
  Trash2,
  Building2,
  DollarSign,
  Package,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { createBudget } from "../api/budgetService";
import type { CreateBudgetInput, Budget } from "@/types/presupuesto";

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

  // 5. Entrega y Envío
  plazoEntrega: z.string().optional(),
  enviarEmail: z.boolean(),
  emailsDestino: z.string().optional(),

  // 6. Aprobaciones
  requiereAprobacion: z.boolean(),
  aprobadores: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export default function CrearPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      folio: `COT-${Date.now()}`,
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
      condicionesPago: "50% anticipo, 50% contra entrega",
      observacionesInternas: "",
      colorPrincipal: "#1E88E5",
      formato: "Vertical",
      mostrarCantidad: true,
      mostrarPrecioUnitario: true,
      mostrarIva: true,
      plazoEntrega: "15 días hábiles",
      enviarEmail: false,
      emailsDestino: "",
      requiereAprobacion: false,
      aprobadores: "",
    },
  });

  // Field arrays
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch form values for calculations
  const items = form.watch("items");
  const descuentoPorcentaje = form.watch("descuentoPorcentaje");

  // Calculate totals
  const totales = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      return sum + conUtilidad;
    }, 0);

    const iva = items.reduce((sum, item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      return sum + conUtilidad * (item.iva / 100);
    }, 0);

    const descuento = subtotal * (descuentoPorcentaje / 100);
    const total = subtotal + iva - descuento;

    return { subtotal, iva, descuento, total };
  }, [items, descuentoPorcentaje]);

  // Update item totals
  useEffect(() => {
    items.forEach((item, index) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      const conIva = conUtilidad * (1 + item.iva / 100);
      const total = conIva;

      if (item.total !== total) {
        form.setValue(`items.${index}.total`, total, { shouldValidate: false });
      }
    });
  }, [items, form]);

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: (newBudget: Budget) => {
      queryClient.setQueryData<Budget[]>(["budgets"], (old) => [newBudget, ...(old || [])]);
      toast.success("Presupuesto creado exitosamente", {
        description: `Folio: ${newBudget.folio} - ${newBudget.cliente}`,
      });
      router.push("/portal/presupuesto/consultar");
    },
    onError: (error: Error) => {
      toast.error("Error al crear presupuesto", {
        description: "Por favor, intenta nuevamente.",
      });
      console.error("Error creating budget:", error);
    },
  });

  // Handle form submit
  const onSubmit = (data: BudgetFormValues) => {
    const budgetInput: CreateBudgetInput = {
      cliente: data.clienteNombre,
      proyecto: data.proyecto,
      estado: data.estado,
      items: data.items,
      subtotal: totales.subtotal,
      iva: totales.iva,
      total: totales.total,
      moneda: data.moneda,
      observaciones: data.observacionesInternas,
    };

    createBudgetMutation.mutate(budgetInput);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Nueva Cotización</h2>
          <p className="text-sm text-gray-600">Complete el formulario para crear un nuevo presupuesto</p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="multiple" defaultValue={["datos-generales", "items"]} className="space-y-4">
            {/* 1. Datos Generales */}
            <AccordionItem value="datos-generales" className="bg-white rounded-2xl border border-gray-200 px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-aflow-blue" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Datos Generales</h3>
                    <p className="text-sm text-gray-600">Información del cliente y proyecto</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="folio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Folio</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaCreacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Creación</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clienteNombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Cliente *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Empresa o persona" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clienteEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email del Cliente</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="cliente@ejemplo.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clienteTelefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+56 9 1234 5678" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proyecto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proyecto / Título *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nombre del proyecto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="moneda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLP">CLP - Peso Chileno</SelectItem>
                            <SelectItem value="USD">USD - Dólar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="clienteDireccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Dirección completa del cliente" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Ítems del Presupuesto */}
            <AccordionItem value="items" className="bg-white rounded-2xl border border-gray-200 px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Ítems del Presupuesto</h3>
                    <p className="text-sm text-gray-600">Productos y servicios a cotizar ({fields.length} ítems)</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Ítem #{index + 1}</CardTitle>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.producto`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Producto / Servicio *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nombre del producto" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.unidadMedida`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidad de Medida</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="UN">Unidad</SelectItem>
                                  <SelectItem value="M2">Metro cuadrado</SelectItem>
                                  <SelectItem value="M3">Metro cúbico</SelectItem>
                                  <SelectItem value="KG">Kilogramo</SelectItem>
                                  <SelectItem value="LT">Litro</SelectItem>
                                  <SelectItem value="HR">Hora</SelectItem>
                                  <SelectItem value="DIA">Día</SelectItem>
                                  <SelectItem value="MES">Mes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.cantidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cantidad *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.precioUnitario`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio Unitario *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.utilidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Utilidad (%)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.1"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.iva`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IVA (%)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.1"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`items.${index}.descripcion`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descripción detallada del producto o servicio" rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total del ítem</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${items[index]?.total?.toLocaleString("es-CL") || "0"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
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
                    })
                  }
                  className="w-full border-dashed border-2 h-12 text-aflow-blue hover:bg-blue-50"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar Ítem
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Totales y Condiciones */}
            <AccordionItem value="totales" className="bg-white rounded-2xl border border-gray-200 px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Totales y Condiciones</h3>
                    <p className="text-sm text-gray-600">Descuentos y términos de pago</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Card className="bg-gray-50">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${totales.subtotal.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA:</span>
                      <span className="font-medium">${totales.iva.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento:</span>
                      <span className="font-medium text-red-600">-${totales.descuento.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-aflow-blue">${totales.total.toLocaleString("es-CL")}</span>
                    </div>
                  </CardContent>
                </Card>
                <FormField
                  control={form.control}
                  name="descuentoPorcentaje"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descuento (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condicionesPago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condiciones de Pago</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Ej: 50% anticipo, 50% contra entrega" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plazoEntrega"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plazo de Entrega</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: 15 días hábiles" />
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
                      <FormLabel>Observaciones Internas</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Notas internas (no visibles para el cliente)" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end bg-white p-6 rounded-2xl border border-gray-200 sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createBudgetMutation.isPending}
              className="bg-aflow-blue hover:bg-aflow-blue-light text-white w-full sm:w-auto"
            >
              {createBudgetMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Presupuesto
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
