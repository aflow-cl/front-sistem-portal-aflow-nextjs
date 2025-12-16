"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Package,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Edit,
  Trash2,
  MoreVertical,
  PackageOpen,
  Layers,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Tipos
import { ESTADO_CONFIG } from "../types/maestroNegocio";

// Servicios
import { fetchServicios, fetchPacks } from "../api/maestroService";

export default function ServiciosPage() {
  const [activeTab, setActiveTab] = useState("servicios");
  const [searchServicios, setSearchServicios] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");

  // Fetch servicios
  const { data: servicios = [], isLoading: loadingServicios } = useQuery({
    queryKey: ["servicios"],
    queryFn: fetchServicios,
  });

  // Fetch packs
  const { data: packs = [], isLoading: loadingPacks } = useQuery({
    queryKey: ["packs"],
    queryFn: fetchPacks,
  });

  // Filtros
  const filteredServicios = servicios.filter((s) => {
    const matchSearch =
      !searchServicios ||
      s.nombre.toLowerCase().includes(searchServicios.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchServicios.toLowerCase()) ||
      s.codigo?.toLowerCase().includes(searchServicios.toLowerCase());

    const matchEstado = estadoFilter === "all" || s.estado === estadoFilter;

    return matchSearch && matchEstado;
  });

  const filteredPacks = packs.filter((p) => {
    const matchSearch =
      !searchServicios ||
      p.nombre.toLowerCase().includes(searchServicios.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchServicios.toLowerCase());

    const matchEstado = estadoFilter === "all" || p.estado === estadoFilter;

    return matchSearch && matchEstado;
  });

  // Stats
  const statsServicios = {
    total: servicios.length,
    activos: servicios.filter((s) => s.estado === "Activo").length,
    inactivos: servicios.filter((s) => s.estado === "Inactivo").length,
  };

  const statsPacks = {
    total: packs.length,
    activos: packs.filter((p) => p.estado === "Activo").length,
    inactivos: packs.filter((p) => p.estado === "Inactivo").length,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Gestión de servicios individuales y packs reutilizables
        </p>
        <Button
          onClick={() => toast.info("Modal de creación en desarrollo")}
          className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {activeTab === "servicios" ? "Nuevo Servicio" : "Nuevo Pack"}
        </Button>
      </div>

      {/* Tabs: Servicios vs Packs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="servicios" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Servicios ({statsServicios.total})
          </TabsTrigger>
          <TabsTrigger value="packs" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Packs ({statsPacks.total})
          </TabsTrigger>
        </TabsList>

        {/* SERVICIOS */}
        <TabsContent value="servicios" className="space-y-6 mt-6">
          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Servicios</p>
                  <p className="text-2xl font-bold text-blue-600">{statsServicios.total}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{statsServicios.activos}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-600">{statsServicios.inactivos}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Buscar</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, descripción, código..."
                    value={searchServicios}
                    onChange={(e) => setSearchServicios(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchServicios || estadoFilter !== "all") && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchServicios("");
                    setEstadoFilter("all");
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>

          {/* Tabla Servicios */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {loadingServicios ? (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#244F82]"></div>
                <span className="ml-3 text-gray-600">Cargando servicios...</span>
              </div>
            ) : filteredServicios.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No se encontraron servicios</h3>
              </div>
            ) : (
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Nombre</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Valor Base</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServicios.map((servicio) => {
                      const estadoConfig = ESTADO_CONFIG[servicio.estado];
                      return (
                        <TableRow key={servicio.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div>
                              <p className="text-gray-900">{servicio.nombre}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{servicio.descripcion}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {servicio.codigo || "-"}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{servicio.categoria || "-"}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(servicio.valorBase)}</TableCell>
                          <TableCell>{servicio.unidadMedida || "-"}</TableCell>
                          <TableCell>
                            <Badge className={estadoConfig.badgeClass}>{estadoConfig.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info("Editar servicio")}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toast.info("Cambiar estado")}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {servicio.estado === "Activo" ? "Desactivar" : "Activar"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        {/* PACKS */}
        <TabsContent value="packs" className="space-y-6 mt-6">
          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Packs</p>
                  <p className="text-2xl font-bold text-purple-600">{statsPacks.total}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{statsPacks.activos}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-600">{statsPacks.inactivos}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros (reutilizar los mismos) */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Buscar</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, descripción..."
                    value={searchServicios}
                    onChange={(e) => setSearchServicios(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grid de Packs (vista de tarjetas) */}
          {loadingPacks ? (
            <div className="bg-white rounded-xl border p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#244F82]"></div>
              <span className="ml-3 text-gray-600">Cargando packs...</span>
            </div>
          ) : filteredPacks.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No se encontraron packs</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPacks.map((pack) => {
                const estadoConfig = ESTADO_CONFIG[pack.estado];
                return (
                  <Card key={pack.id} className="p-5 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{pack.nombre}</h3>
                        <Badge className={estadoConfig.badgeClass}>{estadoConfig.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{pack.descripcion}</p>
                      <Separator />
                      <div className="space-y-1.5">
                        <p className="text-xs text-gray-500">Items incluidos: {pack.items.length}</p>
                        <p className="text-xl font-bold text-[#244F82]">{formatCurrency(pack.valorTotal)}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toast.info("Ver detalle del pack")}
                        >
                          Ver Detalle
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Editar pack")}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
