"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Zap,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  fetchServicios, 
  toggleServicioStatus,
  createServicio,
  updateServicio 
} from "../api/ajustesService";
import type { Servicio, CreateServicioInput } from "../types/ajustes";

const CATEGORIAS = ["Software", "Consultoría", "Soporte", "Infraestructura"];

const CATEGORIA_COLORS: Record<string, string> = {
  Software: "bg-blue-100 text-blue-800 border-blue-300",
  Consultoría: "bg-purple-100 text-purple-800 border-purple-300",
  Soporte: "bg-green-100 text-green-800 border-green-300",
  Infraestructura: "bg-orange-100 text-orange-800 border-orange-300",
};

// Esquema de validación con Zod
const servicioFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  codigo: z.string().min(1, "El código es requerido"),
  categoria: z.enum(["Software", "Consultoría", "Soporte", "Infraestructura"], {
    required_error: "Selecciona una categoría",
  }),
  descripcion: z.string().min(1, "La descripción es requerida"),
  tarifas: z
    .array(
      z.object({
        plan: z.string().min(1, "El título del plan es requerido"),
        precioMensual: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
        precioAnual: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
        descripcion: z.string().min(1, "La descripción del plan es requerida"),
        caracteristicas: z
          .array(z.string().min(1, "La descripción no puede estar vacía"))
          .min(1, "Debes agregar al menos 1 descripción")
          .max(15, "Puedes agregar máximo 15 descripciones"),
      })
    )
    .min(1, "Debes agregar al menos 1 plan")
    .max(5, "Puedes agregar máximo 5 planes"),
});

type ServicioFormData = z.infer<typeof servicioFormSchema>;

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null
  );

  const queryClient = useQueryClient();

  // React Hook Form
  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioFormSchema),
    defaultValues: {
      nombre: "",
      codigo: "",
      categoria: "Software",
      descripcion: "",
      tarifas: [
        {
          plan: "",
          precioMensual: 0,
          precioAnual: 0,
          descripcion: "",
          caracteristicas: [""],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tarifas",
  });

  const { data: servicios, isLoading } = useQuery({
    queryKey: ["servicios"],
    queryFn: fetchServicios,
  });

  const createMutation = useMutation({
    mutationFn: createServicio,
    onSuccess: (newServicio) => {
      queryClient.setQueryData(["servicios"], (old: Servicio[] = []) => [
        ...old,
        newServicio,
      ]);
      toast.success("Servicio creado exitosamente");
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Error al crear el servicio");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateServicioInput> }) =>
      updateServicio(id, data),
    onSuccess: (updatedServicio) => {
      queryClient.setQueryData(["servicios"], (old: Servicio[] = []) =>
        old.map((s) => (s.id === updatedServicio.id ? updatedServicio : s))
      );
      toast.success("Servicio actualizado exitosamente");
      setDialogOpen(false);
      setEditingServicio(null);
      form.reset();
    },
    onError: () => {
      toast.error("Error al actualizar el servicio");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleServicioStatus,
    onSuccess: (updatedServicio) => {
      queryClient.setQueryData(["servicios"], (old: Servicio[] = []) =>
        old.map((s) => (s.id === updatedServicio.id ? updatedServicio : s))
      );
      toast.success(
        `Servicio ${updatedServicio.activo ? "activado" : "desactivado"}`
      );
    },
    onError: () => {
      toast.error("Error al cambiar estado del servicio");
    },
  });

  // Cargar datos al editar
  useEffect(() => {
    if (editingServicio) {
      form.reset({
        nombre: editingServicio.nombre,
        codigo: editingServicio.codigo,
        categoria: editingServicio.categoria,
        descripcion: editingServicio.descripcion,
        tarifas: editingServicio.tarifas.length > 0 
          ? editingServicio.tarifas.map(t => ({
              ...t,
              caracteristicas: t.caracteristicas.length > 0 ? t.caracteristicas : [""]
            }))
          : [{
              plan: "",
              precioMensual: 0,
              precioAnual: 0,
              descripcion: "",
              caracteristicas: [""],
            }],
      });
    } else {
      form.reset({
        nombre: "",
        codigo: "",
        categoria: "Software",
        descripcion: "",
        tarifas: [
          {
            plan: "",
            precioMensual: 0,
            precioAnual: 0,
            descripcion: "",
            caracteristicas: [""],
          },
        ],
      });
    }
  }, [editingServicio, form]);

  const filteredServicios = servicios?.filter((servicio) => {
    const matchesSearch =
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria =
      filterCategoria === "all" || servicio.categoria === filterCategoria;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && servicio.activo) ||
      (filterStatus === "inactive" && !servicio.activo);
    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const handleOpenDialog = (servicio?: Servicio) => {
    if (servicio) {
      setEditingServicio(servicio);
    } else {
      setEditingServicio(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingServicio(null);
    form.reset();
  };

  const handleViewDetails = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setDetailDialogOpen(true);
  };

  const onSubmit = (data: ServicioFormData) => {
    if (editingServicio) {
      updateMutation.mutate({
        id: editingServicio.id,
        data: data as CreateServicioInput,
      });
    } else {
      createMutation.mutate(data as CreateServicioInput);
    }
  };

  const handleAddPlan = () => {
    if (fields.length < 5) {
      append({
        plan: "",
        precioMensual: 0,
        precioAnual: 0,
        descripcion: "",
        caracteristicas: [""],
      });
    }
  };

  const handleRemovePlan = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <ServiciosSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#244F82]" />
              Catálogo de Servicios
            </CardTitle>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#244F82] hover:bg-[#0c3b64]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {CATEGORIAS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServicios && filteredServicios.length > 0 ? (
              filteredServicios.map((servicio) => (
                <Card
                  key={servicio.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(servicio)}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(servicio);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatusMutation.mutate(servicio.id);
                          }}
                        >
                          {servicio.activo ? (
                            <XCircle className="w-4 h-4 text-orange-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Contenido */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {servicio.nombre}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 mb-3">
                      {servicio.codigo}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {servicio.descripcion}
                    </p>

                    {/* Categoría */}
                    <Badge className={CATEGORIA_COLORS[servicio.categoria]}>
                      {servicio.categoria}
                    </Badge>

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-100" />

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Clientes activos</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {servicio.clientesActivos}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Planes disponibles</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {servicio.tarifas.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Zap className="w-4 h-4" />
                          <span>Estado</span>
                        </div>
                        <Badge
                          variant={servicio.activo ? "default" : "outline"}
                          className={
                            servicio.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {servicio.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>

                    {/* Precio desde */}
                    {servicio.tarifas.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Desde</p>
                        <p className="text-2xl font-bold text-[#244F82]">
                          {formatCurrency(
                            Math.min(
                              ...servicio.tarifas.map((t) => t.precioMensual)
                            )
                          )}
                          <span className="text-sm font-normal text-gray-600">
                            /mes
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No se encontraron servicios</p>
              </div>
            )}
          </div>

          {/* Stats footer */}
          {filteredServicios && filteredServicios.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {filteredServicios.length} de{" "}
                {servicios?.length || 0} servicios
              </span>
              <span>
                {filteredServicios.filter((s) => s.activo).length} activos
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar servicio */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Servicio *</Label>
                  <Input
                    id="nombre"
                    {...form.register("nombre")}
                    placeholder="Portal de Presupuestos"
                  />
                  {form.formState.errors.nombre && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    {...form.register("codigo")}
                    placeholder="AFLOW-PRE"
                  />
                  {form.formState.errors.codigo && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.codigo.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={form.watch("categoria")}
                  onValueChange={(value) =>
                    form.setValue("categoria", value as "Software" | "Consultoría" | "Soporte" | "Infraestructura")
                  }
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoria && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.categoria.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  {...form.register("descripcion")}
                  placeholder="Describe el servicio..."
                  rows={3}
                />
                {form.formState.errors.descripcion && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.descripcion.message}
                  </p>
                )}
              </div>
            </div>

            {/* Planes y Tarifas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Planes y Tarifas
                </h3>
                <Badge variant="outline" className="text-gray-600">
                  {fields.length} de 5 planes
                </Badge>
              </div>

              {form.formState.errors.tarifas?.root && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.tarifas.root.message}
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field, planIndex) => {
                  const caracteristicasFieldArray = form.watch(`tarifas.${planIndex}.caracteristicas`) || [];
                  
                  return (
                    <Card key={field.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Plan {planIndex + 1}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemovePlan(planIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`tarifas.${planIndex}.plan`}>
                              Título del Plan *
                            </Label>
                            <Input
                              {...form.register(`tarifas.${planIndex}.plan`)}
                              placeholder="Ej: Básico, Profesional, Enterprise"
                            />
                            {form.formState.errors.tarifas?.[planIndex]?.plan && (
                              <p className="text-sm text-red-600 mt-1">
                                {form.formState.errors.tarifas[planIndex]?.plan?.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`tarifas.${planIndex}.precioMensual`}>
                                Precio Mensual (CLP) *
                              </Label>
                              <Input
                                type="number"
                                {...form.register(`tarifas.${planIndex}.precioMensual`)}
                                placeholder="0"
                              />
                              {form.formState.errors.tarifas?.[planIndex]
                                ?.precioMensual && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    form.formState.errors.tarifas[planIndex]
                                      ?.precioMensual?.message
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`tarifas.${planIndex}.precioAnual`}>
                                Precio Anual (CLP) *
                              </Label>
                              <Input
                                type="number"
                                {...form.register(`tarifas.${planIndex}.precioAnual`)}
                                placeholder="0"
                              />
                              {form.formState.errors.tarifas?.[planIndex]
                                ?.precioAnual && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    form.formState.errors.tarifas[planIndex]
                                      ?.precioAnual?.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`tarifas.${planIndex}.descripcion`}>
                              Descripción Corta del Plan *
                            </Label>
                            <Textarea
                              {...form.register(`tarifas.${planIndex}.descripcion`)}
                              placeholder="Ej: Ideal para pequeñas empresas"
                              rows={2}
                            />
                            {form.formState.errors.tarifas?.[planIndex]
                              ?.descripcion && (
                              <p className="text-sm text-red-600 mt-1">
                                {
                                  form.formState.errors.tarifas[planIndex]
                                    ?.descripcion?.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Descripciones del Plan (Características) */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Descripciones del Plan *</Label>
                              <Badge variant="outline" className="text-xs">
                                {caracteristicasFieldArray.length} de 15
                              </Badge>
                            </div>
                            
                            {form.formState.errors.tarifas?.[planIndex]?.caracteristicas?.root && (
                              <p className="text-sm text-red-600">
                                {form.formState.errors.tarifas[planIndex]?.caracteristicas?.root?.message}
                              </p>
                            )}

                            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                              {caracteristicasFieldArray.map((_, descIndex) => (
                                <div key={descIndex} className="flex gap-2 items-start">
                                  <div className="flex-1">
                                    <Input
                                      {...form.register(`tarifas.${planIndex}.caracteristicas.${descIndex}`)}
                                      placeholder={`Descripción ${descIndex + 1}`}
                                      className="bg-white"
                                    />
                                    {form.formState.errors.tarifas?.[planIndex]?.caracteristicas?.[descIndex] && (
                                      <p className="text-xs text-red-600 mt-1">
                                        {form.formState.errors.tarifas[planIndex]?.caracteristicas?.[descIndex]?.message}
                                      </p>
                                    )}
                                  </div>
                                  {caracteristicasFieldArray.length > 1 && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const currentCaract = form.getValues(`tarifas.${planIndex}.caracteristicas`);
                                        form.setValue(
                                          `tarifas.${planIndex}.caracteristicas`,
                                          currentCaract.filter((_, i) => i !== descIndex)
                                        );
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}

                              {caracteristicasFieldArray.length < 15 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const currentCaract = form.getValues(`tarifas.${planIndex}.caracteristicas`);
                                    form.setValue(
                                      `tarifas.${planIndex}.caracteristicas`,
                                      [...currentCaract, ""]
                                    );
                                  }}
                                  className="w-full border-dashed mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar Descripción ({caracteristicasFieldArray.length}/15)
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPlan}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Plan ({fields.length}/5)
                </Button>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Puedes agregar entre 1 y 5 planes. Cada plan puede
                tener de 1 a 15 descripciones. Asegúrate de completar todos los campos
                requeridos antes de guardar.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#244F82] hover:bg-[#0c3b64]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Guardando..."
                  : editingServicio
                  ? "Actualizar Servicio"
                  : "Crear Servicio"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog detalles servicio */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              {selectedServicio?.nombre}
            </DialogTitle>
          </DialogHeader>
          {selectedServicio && (
            <div className="space-y-6 mt-4">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Código</p>
                  <p className="text-sm font-mono text-gray-900">
                    {selectedServicio.codigo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Categoría</p>
                  <Badge className={CATEGORIA_COLORS[selectedServicio.categoria]}>
                    {selectedServicio.categoria}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Descripción
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedServicio.descripcion}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Clientes Activos
                  </p>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {selectedServicio.clientesActivos}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <Badge
                    variant={selectedServicio.activo ? "default" : "outline"}
                    className={
                      selectedServicio.activo
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {selectedServicio.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              {/* Planes y tarifas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Planes y Tarifas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedServicio.tarifas.map((tarifa, index) => (
                    <Card
                      key={index}
                      className={
                        tarifa.plan === "Professional"
                          ? "border-[#244F82] border-2"
                          : ""
                      }
                    >
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-bold text-gray-900">
                            {tarifa.plan}
                          </h4>
                          {tarifa.plan === "Professional" && (
                            <Badge className="mt-1 bg-[#244F82]">
                              Más Popular
                            </Badge>
                          )}
                        </div>
                        <div className="text-center mb-4">
                          <p className="text-3xl font-bold text-[#244F82]">
                            {formatCurrency(tarifa.precioMensual)}
                          </p>
                          <p className="text-sm text-gray-600">/mes</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCurrency(tarifa.precioAnual)} /año
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {tarifa.descripcion}
                        </p>
                        <div className="space-y-2">
                          {tarifa.caracteristicas.map((caract, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{caract}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiciosSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
