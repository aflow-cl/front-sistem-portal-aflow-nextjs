"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Building,
  UserPlus,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  toggleClienteStatus,
} from "../api/ajustesService";
import type { Cliente, CreateClienteInput } from "../types/ajustes";

const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const queryClient = useQueryClient();

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  const createMutation = useMutation({
    mutationFn: createCliente,
    onSuccess: (newCliente) => {
      queryClient.setQueryData(["clientes"], (old: Cliente[] = []) => [
        ...old,
        newCliente,
      ]);
      toast.success("Cliente creado exitosamente");
      setDialogOpen(false);
      setEditingCliente(null);
    },
    onError: () => {
      toast.error("Error al crear cliente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClienteInput> }) =>
      updateCliente(id, data),
    onSuccess: (updatedCliente) => {
      queryClient.setQueryData(["clientes"], (old: Cliente[] = []) =>
        old.map((c) => (c.id === updatedCliente.id ? updatedCliente : c))
      );
      toast.success("Cliente actualizado exitosamente");
      setDialogOpen(false);
      setEditingCliente(null);
    },
    onError: () => {
      toast.error("Error al actualizar cliente");
    },
  });

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

  const filteredClientes = clientes?.filter((cliente) => {
    const matchesSearch =
      cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      filterRegion === "all" || cliente.region === filterRegion;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && cliente.activo) ||
      (filterStatus === "inactive" && !cliente.activo);
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateClienteInput = {
      rut: formData.get("rut") as string,
      razonSocial: formData.get("razonSocial") as string,
      nombreFantasia: formData.get("nombreFantasia") as string,
      giro: formData.get("giro") as string,
      direccion: formData.get("direccion") as string,
      region: formData.get("region") as string,
      comuna: formData.get("comuna") as string,
      telefono: formData.get("telefono") as string,
      email: formData.get("email") as string,
      sitioWeb: formData.get("sitioWeb") as string,
      contactoPrincipal: formData.get("contactoPrincipal") as string,
      emailContacto: formData.get("emailContacto") as string,
    };

    if (editingCliente) {
      updateMutation.mutate({ id: editingCliente.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleViewDetails = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDetailDialogOpen(true);
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
            <Button
              onClick={() => {
                setEditingCliente(null);
                setDialogOpen(true);
              }}
              className="bg-[#244F82] hover:bg-[#0c3b64]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por razón social, RUT o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {REGIONES_CHILE.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
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

          {/* Tabla de clientes */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes && filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {cliente.serviciosContratados.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
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
                                setEditingCliente(cliente);
                                setDialogOpen(true);
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
                    <TableCell colSpan={6} className="text-center py-12">
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

          {/* Stats footer */}
          {filteredClientes && filteredClientes.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {filteredClientes.length} de {clientes?.length || 0}{" "}
                clientes
              </span>
              <span>
                {filteredClientes.filter((c) => c.activo).length} activos
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar cliente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  name="rut"
                  defaultValue={editingCliente?.rut}
                  placeholder="76.123.456-0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  name="razonSocial"
                  defaultValue={editingCliente?.razonSocial}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nombreFantasia">Nombre Fantasía</Label>
                <Input
                  id="nombreFantasia"
                  name="nombreFantasia"
                  defaultValue={editingCliente?.nombreFantasia}
                />
              </div>
              <div>
                <Label htmlFor="giro">Giro *</Label>
                <Input
                  id="giro"
                  name="giro"
                  defaultValue={editingCliente?.giro}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  defaultValue={editingCliente?.direccion}
                  required
                />
              </div>
              <div>
                <Label htmlFor="region">Región *</Label>
                <Select
                  name="region"
                  defaultValue={editingCliente?.region}
                  required
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Seleccionar región" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONES_CHILE.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comuna">Comuna *</Label>
                <Input
                  id="comuna"
                  name="comuna"
                  defaultValue={editingCliente?.comuna}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  defaultValue={editingCliente?.telefono}
                  placeholder="+56 2 2345 6789"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingCliente?.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <Input
                  id="sitioWeb"
                  name="sitioWeb"
                  defaultValue={editingCliente?.sitioWeb}
                  placeholder="www.ejemplo.cl"
                />
              </div>
              <div>
                <Label htmlFor="contactoPrincipal">Contacto Principal *</Label>
                <Input
                  id="contactoPrincipal"
                  name="contactoPrincipal"
                  defaultValue={editingCliente?.contactoPrincipal}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emailContacto">Email Contacto *</Label>
                <Input
                  id="emailContacto"
                  name="emailContacto"
                  type="email"
                  defaultValue={editingCliente?.emailContacto}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#244F82] hover:bg-[#0c3b64]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingCliente ? "Actualizar" : "Crear"} Cliente
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
