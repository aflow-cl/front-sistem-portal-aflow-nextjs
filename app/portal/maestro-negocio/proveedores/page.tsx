"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  PlusCircle, 
  Building2, 
  Users, 
  CheckCircle2, 
  Package,
  Search,
  X,
  Shield,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Hooks y tipos
import { useProveedores } from "./hooks/useProveedores";
import { 
  Proveedor, 
  getDisplayName, 
  ESTADO_CONFIG,
  TipoPersona,
  EstadoRegistro
} from "../types/maestroNegocio";

// Servicios
import { fetchProveedores } from "../api/maestroService";

// Componentes
import { AdvancedFilters } from "./components/AdvancedFilters";

export default function ProveedoresPage() {
  // Fetch proveedores
  const {
    data: proveedores = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["proveedores"],
    queryFn: fetchProveedores,
  });

  const {
    filters,
    setFilters,
    filteredAndSortedProveedores,
    clearFilters,
    hasActiveFilters,
    stats,
  } = useProveedores(proveedores);

  const handleCreateNew = () => {
    toast.info("Modal de creación de proveedor en desarrollo");
  };

  const handleEdit = (proveedor: Proveedor) => {
    if (proveedor.esProveedorDefault) {
      toast.warning("El proveedor default solo permite edición parcial");
    }
    toast.info(`Editar proveedor: ${getDisplayName(proveedor)}`);
  };

  const handleDelete = (proveedor: Proveedor) => {
    if (proveedor.esProveedorDefault) {
      toast.error("No se puede eliminar el proveedor default");
      return;
    }
    const action = proveedor.estado === "Activo" ? "desactivar" : "activar";
    if (confirm(`¿Está seguro que desea ${action} este proveedor?`)) {
      toast.success(`Proveedor ${action === "desactivar" ? "desactivado" : "activado"}`);
    }
  };

  const handleViewProductos = (proveedor: Proveedor) => {
    toast.info(`Ver productos de: ${getDisplayName(proveedor)}`);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error al cargar proveedores</h3>
        <p className="text-red-600 text-sm">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Gestión de proveedores y sus productos
        </p>
        <Button
          onClick={handleCreateNew}
          className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Proveedores</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Personas Naturales</p>
              <p className="text-2xl font-bold text-purple-600">{stats.personasNaturales}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Empresas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.empresas}</p>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Productos</p>
              <p className="text-2xl font-bold text-teal-600">{stats.totalProductos}</p>
            </div>
            <div className="bg-teal-50 p-2 rounded-lg">
              <Package className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-[#244F82]" />
          <h3 className="text-sm font-semibold text-gray-900">Filtros de búsqueda</h3>
        </div>

        <div className="flex gap-3">
          {/* Filtros rápidos */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Búsqueda rápida */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="busqueda"
                type="text"
                placeholder="Buscar por RUT, nombre..."
                value={filters.busqueda}
                onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
                className="pl-9 h-10 rounded-xl border-gray-300 focus:border-[#244F82] focus:ring-[#244F82]"
              />
            </div>

            {/* Tipo rápido */}
            <Select
              value={filters.tipoPersona}
              onValueChange={(value: string) => setFilters({ ...filters, tipoPersona: value as TipoPersona | "all" })}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="persona-natural">Persona Natural</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
              </SelectContent>
            </Select>

            {/* Estado rápido */}
            <Select
              value={filters.estado}
              onValueChange={(value: string) => setFilters({ ...filters, estado: value as EstadoRegistro | "all" })}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <AdvancedFilters
              filters={filters}
              onApplyFilters={setFilters}
              onClearFilters={clearFilters}
              hasActiveFilters={Boolean(hasActiveFilters)}
            />
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="default"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900 border-gray-300 h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#244F82]"></div>
            <span className="ml-3 text-gray-600">Cargando proveedores...</span>
          </div>
        ) : filteredAndSortedProveedores.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No se encontraron proveedores</h3>
            <p className="text-sm text-gray-500 mt-1">
              No hay proveedores que coincidan con los filtros aplicados
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nombre / Razón Social</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProveedores.map((proveedor) => {
                  const estadoConfig = ESTADO_CONFIG[proveedor.estado];

                  return (
                    <TableRow key={proveedor.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {proveedor.esProveedorDefault && (
                            <Shield className="w-4 h-4 text-blue-600" />
                          )}
                          <div>
                            <p className="text-gray-900">{getDisplayName(proveedor)}</p>
                            {proveedor.tipoPersona === "empresa" && (
                              <p className="text-xs text-gray-500 mt-0.5">{proveedor.giro}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{proveedor.rut}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            proveedor.tipoPersona === "persona-natural"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {proveedor.tipoPersona === "persona-natural" ? "Persona Natural" : "Empresa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{proveedor.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProductos(proveedor)}
                          className="text-[#244F82] hover:bg-blue-50"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          {proveedor.productos.length}
                        </Button>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(proveedor)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewProductos(proveedor)}>
                              <Package className="mr-2 h-4 w-4" />
                              Ver Productos
                            </DropdownMenuItem>
                            {!proveedor.esProveedorDefault && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(proveedor)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {proveedor.estado === "Activo" ? "Desactivar" : "Activar"}
                              </DropdownMenuItem>
                            )}
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
    </div>
  );
}
