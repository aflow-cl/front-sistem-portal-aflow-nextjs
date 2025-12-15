"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Menu as MenuIcon,
  Search,
  Eye,
  EyeOff,
  GripVertical,
  Edit2,
  Shield,
  Home,
  Calculator,
  Briefcase,
  Settings,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  fetchOpcionesMenu,
  updateOpcionMenu,
  fetchPerfiles,
} from "../api/ajustesService";
import type { OpcionMenu } from "../types/ajustes";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Calculator,
  Briefcase,
  Settings,
  FileText,
  PlusCircle,
  MenuIcon,
  Shield,
};

export default function OpcionesMenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpcion, setEditingOpcion] = useState<OpcionMenu | null>(null);
  const [selectedPerfiles, setSelectedPerfiles] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: opciones, isLoading: loadingOpciones } = useQuery({
    queryKey: ["opciones-menu"],
    queryFn: fetchOpcionesMenu,
  });

  const { data: perfiles, isLoading: loadingPerfiles } = useQuery({
    queryKey: ["perfiles"],
    queryFn: fetchPerfiles,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpcionMenu> }) =>
      updateOpcionMenu(id, data),
    onSuccess: (updatedOpcion) => {
      queryClient.setQueryData(["opciones-menu"], (old: OpcionMenu[] = []) =>
        old.map((o) => (o.id === updatedOpcion.id ? updatedOpcion : o))
      );
      toast.success("Opción actualizada exitosamente");
      if (dialogOpen) {
        setDialogOpen(false);
        setEditingOpcion(null);
      }
    },
    onError: () => {
      toast.error("Error al actualizar opción");
    },
  });

  const filteredOpciones = opciones?.filter((opcion) =>
    opcion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar opciones: principales y submódulos
  const opcionesPrincipales = filteredOpciones?.filter((o) => !o.esSubmenu);
  const submodulos = filteredOpciones?.filter((o) => o.esSubmenu);

  const toggleVisibilidad = (opcion: OpcionMenu) => {
    updateMutation.mutate({
      id: opcion.id,
      data: { visible: !opcion.visible },
    });
  };

  const handleOpenDialog = (opcion: OpcionMenu) => {
    setEditingOpcion(opcion);
    setSelectedPerfiles(opcion.perfilesAsignados);
    setDialogOpen(true);
  };

  const handleSubmitPerfiles = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOpcion) {
      updateMutation.mutate({
        id: editingOpcion.id,
        data: { perfilesAsignados: selectedPerfiles },
      });
    }
  };

  const togglePerfil = (perfilId: string) => {
    setSelectedPerfiles((prev) =>
      prev.includes(perfilId)
        ? prev.filter((id) => id !== perfilId)
        : [...prev, perfilId]
    );
  };

  if (loadingOpciones || loadingPerfiles) {
    return <OpcionesMenuSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <MenuIcon className="w-5 h-5 text-[#244F82]" />
              Opciones de Menú
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar opción de menú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Información */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Gestión de menú:</strong> Configura la visibilidad y
              permisos de cada opción del menú principal. Las opciones
              deshabilitadas no aparecerán para los usuarios con perfiles sin
              acceso.
            </p>
          </div>

          {/* Opciones principales */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Opciones Principales
              </h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">Orden</TableHead>
                      <TableHead>Opción</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Perfiles</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opcionesPrincipales && opcionesPrincipales.length > 0 ? (
                      opcionesPrincipales.map((opcion) => {
                        const Icon = ICON_MAP[opcion.icono] || MenuIcon;
                        return (
                          <TableRow
                            key={opcion.id}
                            className={
                              !opcion.visible ? "bg-gray-50 opacity-60" : ""
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                <span className="font-mono text-sm font-medium">
                                  {opcion.orden}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {opcion.nombre}
                                  </p>
                                  {opcion.descripcion && (
                                    <p className="text-xs text-gray-500">
                                      {opcion.descripcion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {opcion.ruta}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(opcion)}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {opcion.perfilesAsignados.length} perfiles
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    opcion.visible ? "default" : "outline"
                                  }
                                  className={
                                    opcion.visible
                                      ? "bg-green-100 text-green-800"
                                      : ""
                                  }
                                >
                                  {opcion.visible ? "Visible" : "Oculta"}
                                </Badge>
                                {opcion.activo && (
                                  <Badge variant="outline">Activa</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleVisibilidad(opcion)}
                                  title={
                                    opcion.visible ? "Ocultar" : "Mostrar"
                                  }
                                >
                                  {opcion.visible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(opcion)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <MenuIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">
                            No se encontraron opciones principales
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Submódulos */}
            {submodulos && submodulos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Submódulos
                </h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">Orden</TableHead>
                        <TableHead>Opción</TableHead>
                        <TableHead>Módulo Padre</TableHead>
                        <TableHead>Perfiles</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submodulos.map((opcion) => {
                        const Icon = ICON_MAP[opcion.icono] || MenuIcon;
                        const moduloPadre = opciones?.find(
                          (o) => o.id === opcion.moduloPadre
                        );
                        return (
                          <TableRow
                            key={opcion.id}
                            className={
                              !opcion.visible ? "bg-gray-50 opacity-60" : ""
                            }
                          >
                            <TableCell>
                              <span className="font-mono text-sm font-medium">
                                {opcion.orden}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {opcion.nombre}
                                  </p>
                                  <code className="text-xs text-gray-500">
                                    {opcion.ruta}
                                  </code>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {moduloPadre && (
                                <Badge variant="outline">
                                  {moduloPadre.nombre}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(opcion)}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {opcion.perfilesAsignados.length} perfiles
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={opcion.visible ? "default" : "outline"}
                                className={
                                  opcion.visible
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {opcion.visible ? "Visible" : "Oculta"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleVisibilidad(opcion)}
                                >
                                  {opcion.visible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(opcion)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog editar perfiles asignados */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Asignar Perfiles - {editingOpcion?.nombre}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPerfiles} className="space-y-4">
            <div>
              <Label className="mb-3 block">
                Selecciona los perfiles que pueden acceder a esta opción:
              </Label>
              <div className="space-y-3">
                {perfiles?.map((perfil) => (
                  <label
                    key={perfil.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedPerfiles.includes(perfil.id)}
                      onCheckedChange={() => togglePerfil(perfil.id)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {perfil.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        {perfil.descripcion}
                      </p>
                      <Badge
                        className="mt-1"
                        style={{ backgroundColor: perfil.color + "20" }}
                      >
                        {perfil.nivel}
                      </Badge>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Perfiles seleccionados:</strong>{" "}
                {selectedPerfiles.length} de {perfiles?.length || 0}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingOpcion(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#244F82] hover:bg-[#0c3b64]"
                disabled={updateMutation.isPending}
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OpcionesMenuSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}
