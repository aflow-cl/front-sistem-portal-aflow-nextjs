"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Building,
  UserPlus,
  Package,
  Shield,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  fetchClientes,
  deleteCliente,
  toggleClienteStatus,
} from "../api/ajustesService";
import type { Cliente } from "../types/ajustes";
import { ClienteWizardModal } from "./components/ClienteWizardModal";
import { EditClienteModal } from "./components/EditClienteModal";
import {
  AdvancedFilters,
  type ClienteFilters,
} from "./components/AdvancedFilters";

type SortField = "razonSocial" | "email" | "region" | "usuarios" | "fechaCreacion" | "estado";
type SortDirection = "asc" | "desc";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function ClientesPage() {
  const [filters, setFilters] = useState<ClienteFilters>({
    razonSocial: "",
    rut: "",
    email: "",
    region: "all",
    estado: "all",
    fechaCreacionDesde: "",
    fechaCreacionHasta: "",
    usuariosMin: "",
    usuariosMax: "",
  });
  const [sortField, setSortField] = useState<SortField>("fechaCreacion");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [wizardDialogOpen, setWizardDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const queryClient = useQueryClient();

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  // Note: Client creation now handled by wizard modal

  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["clientes"], (old: Cliente[] = []) =>
        old.filter((c) => c.id !== deletedId)
      );
      toast.success("Cliente eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar cliente");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleClienteStatus,
    onSuccess: (updatedCliente) => {
      queryClient.setQueryData(["clientes"], (old: Cliente[] = []) =>
        old.map((c) => (c.id === updatedCliente.id ? updatedCliente : c))
      );
      toast.success(
        `Cliente ${updatedCliente.activo ? "activado" : "desactivado"}`
      );
    },
    onError: () => {
      toast.error("Error al cambiar estado del cliente");
    },
  });

  // Filter logic
  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    
    return clientes.filter((cliente) => {
      // Razón Social
      if (
        filters.razonSocial &&
        !cliente.razonSocial.toLowerCase().includes(filters.razonSocial.toLowerCase())
      ) {
        return false;
      }

      // RUT
      if (
        filters.rut &&
        !cliente.rut.toLowerCase().includes(filters.rut.toLowerCase())
      ) {
        return false;
      }

      // Email
      if (
        filters.email &&
        !cliente.email.toLowerCase().includes(filters.email.toLowerCase())
      ) {
        return false;
      }

      // Región
      if (filters.region !== "all" && cliente.region !== filters.region) {
        return false;
      }

      // Estado
      if (
        filters.estado !== "all" &&
        ((filters.estado === "active" && !cliente.activo) ||
          (filters.estado === "inactive" && cliente.activo))
      ) {
        return false;
      }

      // Fecha Creación Desde
      if (filters.fechaCreacionDesde) {
        const createdDate = new Date(cliente.createdAt);
        const filterDate = new Date(filters.fechaCreacionDesde);
        if (createdDate < filterDate) {
          return false;
        }
      }

      // Fecha Creación Hasta
      if (filters.fechaCreacionHasta) {
        const createdDate = new Date(cliente.createdAt);
        const filterDate = new Date(filters.fechaCreacionHasta);
        if (createdDate > filterDate) {
          return false;
        }
      }

      // Usuarios Mínimo
      if (filters.usuariosMin) {
        const min = parseInt(filters.usuariosMin);
        if (cliente.usuarios.length < min) {
          return false;
        }
      }

      // Usuarios Máximo
      if (filters.usuariosMax) {
        const max = parseInt(filters.usuariosMax);
        if (cliente.usuarios.length > max) {
          return false;
        }
      }

      return true;
    });
  }, [clientes, filters]);

  // Sorting logic
  const sortedClientes = useMemo(() => {
    if (!filteredClientes) return [];

    const sorted = [...filteredClientes].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "razonSocial":
          comparison = a.razonSocial.localeCompare(b.razonSocial);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "region":
          comparison = a.region.localeCompare(b.region);
          break;
        case "usuarios":
          comparison = a.usuarios.length - b.usuarios.length;
          break;
        case "fechaCreacion":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "estado":
          comparison = (a.activo === b.activo) ? 0 : a.activo ? -1 : 1;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredClientes, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 ml-1 text-[#244F82]" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 ml-1 text-[#244F82]" />
    );
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.razonSocial !== "" ||
      filters.rut !== "" ||
      filters.email !== "" ||
      filters.region !== "all" ||
      filters.estado !== "all" ||
      filters.fechaCreacionDesde !== "" ||
      filters.fechaCreacionHasta !== "" ||
      filters.usuariosMin !== "" ||
      filters.usuariosMax !== ""
    );
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      razonSocial: "",
      rut: "",
      email: "",
      region: "all",
      estado: "all",
      fechaCreacionDesde: "",
      fechaCreacionHasta: "",
      usuariosMin: "",
      usuariosMax: "",
    });
  };

  const handleViewDetails = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDetailDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return <ClientesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#244F82]" />
              Gestión de Clientes
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <AdvancedFilters
                filters={filters}
                onApplyFilters={setFilters}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
              <Button
                onClick={() => {
                  setWizardDialogOpen(true);
                }}
                className="bg-[#244F82] hover:bg-[#0c3b64]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Tabla de clientes */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[280px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("razonSocial")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center"
                      >
                        Cliente
                        {getSortIcon("razonSocial")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[200px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("email")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center"
                      >
                        Contacto
                        {getSortIcon("email")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[180px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("region")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center"
                      >
                        Ubicación
                        {getSortIcon("region")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-semibold">Servicios</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("usuarios")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center mx-auto"
                      >
                        Usuarios
                        {getSortIcon("usuarios")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[140px] text-center">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("fechaCreacion")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center mx-auto"
                      >
                        Fecha Creación
                        {getSortIcon("fechaCreacion")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[120px] text-center">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("estado")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center mx-auto"
                      >
                        Estado
                        {getSortIcon("estado")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] w-[100px]">
                      <span className="font-semibold">Acciones</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClientes && sortedClientes.length > 0 ? (
                    sortedClientes.map((cliente) => (
                    <TableRow
                      key={cliente.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewDetails(cliente)}
                    >
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {cliente.razonSocial}
                            </p>
                            <p className="text-sm text-gray-600">
                              RUT: {cliente.rut}
                            </p>
                            {cliente.nombreFantasia && (
                              <p className="text-xs text-gray-500">
                                {cliente.nombreFantasia}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">
                              {cliente.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">
                              {cliente.telefono}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-900">
                              {cliente.comuna}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cliente.region}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {cliente.serviciosContratados.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {cliente.usuarios.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(cliente.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Badge
                            variant={cliente.activo ? "default" : "outline"}
                            className={
                              cliente.activo
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }
                          >
                            {cliente.activo ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {cliente.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right sticky right-0 bg-white shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)] group-hover:bg-gray-50">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(cliente);
                              }}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatusMutation.mutate(cliente.id);
                              }}
                            >
                              {cliente.activo ? (
                                <XCircle className="w-4 h-4 mr-2" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              {cliente.activo ? "Desactivar" : "Activar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    "¿Estás seguro de eliminar este cliente?"
                                  )
                                ) {
                                  deleteMutation.mutate(cliente.id);
                                }
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">
                          No se encontraron clientes
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Stats footer */}
          {sortedClientes && sortedClientes.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {sortedClientes.length} de {clientes?.length || 0}{" "}
                clientes
              </span>
              <span>
                {sortedClientes.filter((c) => c.activo).length} activos
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wizard Modal para Nuevo Cliente */}
      <ClienteWizardModal
        open={wizardDialogOpen}
        onOpenChange={setWizardDialogOpen}
      />

      {/* Edit Modal */}
      <EditClienteModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        cliente={selectedCliente}
      />

      {/* Dialog detalles cliente */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {selectedCliente?.razonSocial}
            </DialogTitle>
          </DialogHeader>
          {selectedCliente && (
            <Tabs defaultValue="general" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="sucursales">
                  Sucursales ({selectedCliente.sucursales.length})
                </TabsTrigger>
                <TabsTrigger value="usuarios">
                  Usuarios ({selectedCliente.usuarios.length})
                </TabsTrigger>
                <TabsTrigger value="perfiles">Perfiles</TabsTrigger>
                <TabsTrigger value="servicios">
                  Servicios ({selectedCliente.serviciosContratados.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">RUT</p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.rut}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Giro</p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.giro}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600">
                      Dirección
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.direccion}, {selectedCliente.comuna},{" "}
                      {selectedCliente.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Teléfono
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.telefono}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.email}
                    </p>
                  </div>
                  {selectedCliente.sitioWeb && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Sitio Web
                      </p>
                      <p className="text-sm text-blue-600">
                        {selectedCliente.sitioWeb}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Contacto Principal
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.contactoPrincipal}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Email Contacto
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedCliente.emailContacto}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sucursales" className="mt-4">
                {selectedCliente.sucursales.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCliente.sucursales.map((sucursal) => (
                      <Card key={sucursal.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {sucursal.nombre}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {sucursal.direccion}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {sucursal.comuna}, {sucursal.region}
                                </p>
                                <div className="flex gap-4 mt-2">
                                  <span className="text-xs text-gray-600">
                                    {sucursal.telefono}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {sucursal.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                sucursal.activa ? "default" : "outline"
                              }
                            >
                              {sucursal.activa ? "Activa" : "Inactiva"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay sucursales registradas</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="usuarios" className="mt-4">
                {selectedCliente.usuarios.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCliente.usuarios.map((usuario) => (
                      <Card key={usuario.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {usuario.nombre} {usuario.apellido}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {usuario.email}
                                </p>
                                <div className="flex gap-3 mt-2">
                                  <Badge variant="outline">
                                    {usuario.perfilNombre}
                                  </Badge>
                                  {usuario.sucursalNombre && (
                                    <span className="text-xs text-gray-600">
                                      {usuario.sucursalNombre}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={usuario.activo ? "default" : "outline"}
                            >
                              {usuario.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay usuarios registrados</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="perfiles" className="mt-4">
                <div className="text-center py-12 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Gestión de perfiles por implementar</p>
                </div>
              </TabsContent>

              <TabsContent value="servicios" className="mt-4">
                {selectedCliente.serviciosContratados.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCliente.serviciosContratados.map((servicio) => (
                      <Card key={servicio.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Package className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {servicio.servicioNombre}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Inicio: {servicio.fechaInicio}
                                </p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                  ${servicio.tarifaMensual.toLocaleString(
                                    "es-CL"
                                  )}{" "}
                                  / mes
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                servicio.estado === "Activo"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                servicio.estado === "Activo"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {servicio.estado}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay servicios contratados</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientesSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
