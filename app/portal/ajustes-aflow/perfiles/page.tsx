"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users as UsersIcon,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  fetchPerfiles,
  createPerfil,
  updatePerfil,
  deletePerfil,
} from "../api/ajustesService";
import type { Perfil, CreatePerfilInput, Permiso } from "../types/ajustes";

const MODULOS_SISTEMA = [
  {
    nombre: "Presupuestos",
    submodulos: ["Consultar", "Crear", "Editar", "Historial"],
  },
  {
    nombre: "Proyectos",
    submodulos: ["Gestión", "Seguimiento", "Reportes"],
  },
  {
    nombre: "Ajustes",
    submodulos: ["Clientes", "Perfiles", "Servicios", "Opciones de Menú"],
  },
  {
    nombre: "Reportes",
    submodulos: ["Financieros", "Operacionales", "Analíticos"],
  },
];

const ACCIONES: Array<"Crear" | "Leer" | "Editar" | "Eliminar" | "Exportar"> = [
  "Crear",
  "Leer",
  "Editar",
  "Eliminar",
  "Exportar",
];

const NIVEL_COLORS: Record<string, string> = {
  Administrador: "bg-red-100 text-red-800 border-red-300",
  Supervisor: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Operador: "bg-blue-100 text-blue-800 border-blue-300",
  Consulta: "bg-green-100 text-green-800 border-green-300",
};

export default function PerfilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
  const [expandedModulos, setExpandedModulos] = useState<string[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);

  const queryClient = useQueryClient();

  const { data: perfiles, isLoading } = useQuery({
    queryKey: ["perfiles"],
    queryFn: fetchPerfiles,
  });

  const createMutation = useMutation({
    mutationFn: createPerfil,
    onSuccess: (newPerfil) => {
      queryClient.setQueryData(["perfiles"], (old: Perfil[] = []) => [
        ...old,
        newPerfil,
      ]);
      toast.success("Perfil creado exitosamente");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Error al crear perfil");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePerfilInput>;
    }) => updatePerfil(id, data),
    onSuccess: (updatedPerfil) => {
      queryClient.setQueryData(["perfiles"], (old: Perfil[] = []) =>
        old.map((p) => (p.id === updatedPerfil.id ? updatedPerfil : p))
      );
      toast.success("Perfil actualizado exitosamente");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Error al actualizar perfil");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePerfil,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["perfiles"], (old: Perfil[] = []) =>
        old.filter((p) => p.id !== deletedId)
      );
      toast.success("Perfil eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar perfil");
    },
  });

  const filteredPerfiles = perfiles?.filter((perfil) => {
    const matchesSearch = perfil.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesNivel =
      filterNivel === "all" || perfil.nivel === filterNivel;
    return matchesSearch && matchesNivel;
  });

  const resetForm = () => {
    setEditingPerfil(null);
    setPermisos([]);
    setExpandedModulos([]);
  };

  const handleOpenDialog = (perfil?: Perfil) => {
    if (perfil) {
      setEditingPerfil(perfil);
      setPermisos(perfil.permisos);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const toggleModulo = (modulo: string) => {
    setExpandedModulos((prev) =>
      prev.includes(modulo)
        ? prev.filter((m) => m !== modulo)
        : [...prev, modulo]
    );
  };

  const togglePermiso = (
    modulo: string,
    submodulo: string | undefined,
    accion: (typeof ACCIONES)[number]
  ) => {
    setPermisos((prev) => {
      const permisoId = `${modulo}-${submodulo || "main"}-${accion}`;
      const existingIndex = prev.findIndex(
        (p) =>
          p.modulo === modulo &&
          p.submodulo === submodulo &&
          p.accion === accion
      );

      if (existingIndex >= 0) {
        // Toggle habilitado
        const newPermisos = [...prev];
        newPermisos[existingIndex] = {
          ...newPermisos[existingIndex],
          habilitado: !newPermisos[existingIndex].habilitado,
        };
        return newPermisos;
      } else {
        // Agregar nuevo permiso
        return [
          ...prev,
          {
            id: permisoId,
            modulo,
            submodulo,
            accion,
            habilitado: true,
          },
        ];
      }
    });
  };

  const isPermisoHabilitado = (
    modulo: string,
    submodulo: string | undefined,
    accion: (typeof ACCIONES)[number]
  ) => {
    const permiso = permisos.find(
      (p) =>
        p.modulo === modulo && p.submodulo === submodulo && p.accion === accion
    );
    return permiso?.habilitado || false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreatePerfilInput = {
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      nivel: formData.get("nivel") as any,
      permisos: permisos.filter((p) => p.habilitado),
    };

    if (editingPerfil) {
      updateMutation.mutate({ id: editingPerfil.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <PerfilesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#244F82]" />
              Gestión de Perfiles
            </CardTitle>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#244F82] hover:bg-[#0c3b64]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Perfil
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar perfil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterNivel} onValueChange={setFilterNivel}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Operador">Operador</SelectItem>
                <SelectItem value="Consulta">Consulta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de perfiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPerfiles && filteredPerfiles.length > 0 ? (
              filteredPerfiles.map((perfil) => (
                <Card
                  key={perfil.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: perfil.color + "20" }}
                      >
                        <Shield
                          className="w-6 h-6"
                          style={{ color: perfil.color }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(perfil)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (
                              confirm(
                                "¿Estás seguro de eliminar este perfil?"
                              )
                            ) {
                              deleteMutation.mutate(perfil.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {perfil.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {perfil.descripcion}
                    </p>

                    <Badge className={NIVEL_COLORS[perfil.nivel]}>
                      {perfil.nivel}
                    </Badge>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <UsersIcon className="w-4 h-4" />
                          <span>{perfil.usuariosAsignados} usuarios</span>
                        </div>
                        <div className="text-gray-600">
                          {
                            perfil.permisos.filter((p) => p.habilitado).length
                          }{" "}
                          permisos
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No se encontraron perfiles</p>
              </div>
            )}
          </div>

          {/* Stats footer */}
          {filteredPerfiles && filteredPerfiles.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {filteredPerfiles.length} de {perfiles?.length || 0}{" "}
                perfiles
              </span>
              <span>
                Total usuarios asignados:{" "}
                {filteredPerfiles.reduce(
                  (sum, p) => sum + p.usuariosAsignados,
                  0
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar perfil */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPerfil ? "Editar Perfil" : "Nuevo Perfil"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Perfil *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    defaultValue={editingPerfil?.nombre}
                    placeholder="Ej: Administrador Cliente"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nivel">Nivel *</Label>
                  <Select
                    name="nivel"
                    defaultValue={editingPerfil?.nivel}
                    required
                  >
                    <SelectTrigger id="nivel">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">
                        Administrador
                      </SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Operador">Operador</SelectItem>
                      <SelectItem value="Consulta">Consulta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  defaultValue={editingPerfil?.descripcion}
                  placeholder="Describe las responsabilidades de este perfil..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Configuración de permisos */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Configuración de Permisos
              </h3>
              <p className="text-sm text-gray-600">
                Define los permisos y accesos para este perfil
              </p>

              <div className="border rounded-lg overflow-hidden">
                {MODULOS_SISTEMA.map((modulo) => (
                  <div key={modulo.nombre} className="border-b last:border-b-0">
                    {/* Módulo principal */}
                    <div className="bg-gray-50 p-4">
                      <button
                        type="button"
                        onClick={() => toggleModulo(modulo.nombre)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        {expandedModulos.includes(modulo.nombre) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-semibold text-gray-900">
                          {modulo.nombre}
                        </span>
                      </button>

                      {expandedModulos.includes(modulo.nombre) && (
                        <div className="mt-4 space-y-3">
                          {/* Permisos del módulo principal */}
                          <div className="pl-6">
                            <div className="flex gap-3 flex-wrap">
                              {ACCIONES.map((accion) => (
                                <label
                                  key={accion}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Checkbox
                                    checked={isPermisoHabilitado(
                                      modulo.nombre,
                                      undefined,
                                      accion
                                    )}
                                    onCheckedChange={() =>
                                      togglePermiso(
                                        modulo.nombre,
                                        undefined,
                                        accion
                                      )
                                    }
                                  />
                                  <span className="text-sm text-gray-700">
                                    {accion}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Submódulos */}
                          {modulo.submodulos.map((submodulo) => (
                            <div
                              key={submodulo}
                              className="pl-6 py-2 bg-white rounded"
                            >
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                {submodulo}
                              </p>
                              <div className="flex gap-3 flex-wrap pl-4">
                                {ACCIONES.map((accion) => (
                                  <label
                                    key={accion}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={isPermisoHabilitado(
                                        modulo.nombre,
                                        submodulo,
                                        accion
                                      )}
                                      onCheckedChange={() =>
                                        togglePermiso(
                                          modulo.nombre,
                                          submodulo,
                                          accion
                                        )
                                      }
                                    />
                                    <span className="text-sm text-gray-600">
                                      {accion}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Permisos seleccionados:</strong>{" "}
                  {permisos.filter((p) => p.habilitado).length} de{" "}
                  {permisos.length} totales
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#244F82] hover:bg-[#0c3b64]"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {editingPerfil ? "Actualizar" : "Crear"} Perfil
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PerfilesSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
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
