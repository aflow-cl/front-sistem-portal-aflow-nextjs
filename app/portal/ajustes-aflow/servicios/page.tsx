"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp,
  Zap,
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
  createServicio,
  updateServicio,
  toggleServicioStatus,
} from "../api/ajustesService";
import type { Servicio, CreateServicioInput, TarifaServicio } from "../types/ajustes";

const CATEGORIAS = ["Software", "Consultoría", "Soporte", "Infraestructura"];

const PLANES: Array<TarifaServicio["plan"]> = [
  "Basic",
  "Professional",
  "Enterprise",
];

const CATEGORIA_COLORS: Record<string, string> = {
  Software: "bg-blue-100 text-blue-800 border-blue-300",
  Consultoría: "bg-purple-100 text-purple-800 border-purple-300",
  Soporte: "bg-green-100 text-green-800 border-green-300",
  Infraestructura: "bg-orange-100 text-orange-800 border-orange-300",
};

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
      setEditingServicio(null);
    },
    onError: () => {
      toast.error("Error al crear servicio");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateServicioInput>;
    }) => updateServicio(id, data),
    onSuccess: (updatedServicio) => {
      queryClient.setQueryData(["servicios"], (old: Servicio[] = []) =>
        old.map((s) => (s.id === updatedServicio.id ? updatedServicio : s))
      );
      toast.success("Servicio actualizado exitosamente");
      setDialogOpen(false);
      setEditingServicio(null);
    },
    onError: () => {
      toast.error("Error al actualizar servicio");
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

  const handleViewDetails = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setDetailDialogOpen(true);
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

      {/* Dialog crear/editar servicio - Simplificado para mantener el código conciso */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Servicio *</Label>
                <Input
                  id="nombre"
                  defaultValue={editingServicio?.nombre}
                  placeholder="Portal de Presupuestos"
                  required
                />
              </div>
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  defaultValue={editingServicio?.codigo}
                  placeholder="AFLOW-PRE"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="categoria">Categoría *</Label>
              <Select defaultValue={editingServicio?.categoria}>
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
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                defaultValue={editingServicio?.descripcion}
                placeholder="Describe el servicio..."
                rows={3}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> La configuración de tarifas y planes se
                realiza después de crear el servicio básico. Este formulario
                crea la estructura inicial.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingServicio(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Simplificado - en producción implementar lógica completa
                  toast.info(
                    "Funcionalidad completa de formulario pendiente de implementación detallada"
                  );
                  setDialogOpen(false);
                }}
                className="bg-[#244F82] hover:bg-[#0c3b64]"
              >
                {editingServicio ? "Actualizar" : "Crear"} Servicio
              </Button>
            </div>
          </div>
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
