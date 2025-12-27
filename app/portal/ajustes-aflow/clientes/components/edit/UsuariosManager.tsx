"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserPlus,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Cliente, UsuarioCliente, UsuarioData } from "../../../types/ajustes";
import {
  addUsuario,
  updateUsuario,
  deleteUsuario,
  toggleUsuarioStatus,
  addHistorialAccion,
} from "../../../api/ajustesService";
import { UsuarioForm, type UsuarioFormValues } from "../UsuarioForm";

interface UsuariosManagerProps {
  cliente: Cliente;
  onUpdate: () => void;
}

export function UsuariosManager({ cliente, onUpdate }: UsuariosManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioCliente | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: UsuarioData & { sucursalId?: string }) =>
      addUsuario(cliente.id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Creación",
        modulo: "Usuarios",
        detalles: "Nuevo usuario agregado",
      });
      toast.success("Usuario agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsFormOpen(false);
      onUpdate();
    },
    onError: () => toast.error("Error al agregar usuario"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UsuarioData & { sucursalId?: string }>;
    }) => updateUsuario(cliente.id, id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Actualización",
        modulo: "Usuarios",
        detalles: "Usuario actualizado",
      });
      toast.success("Usuario actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsFormOpen(false);
      setEditingUsuario(null);
      onUpdate();
    },
    onError: () => toast.error("Error al actualizar usuario"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUsuario(cliente.id, id),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Eliminación",
        modulo: "Usuarios",
        detalles: "Usuario eliminado",
      });
      toast.success("Usuario eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setDeletingId(null);
      onUpdate();
    },
    onError: () => toast.error("Error al eliminar usuario"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => toggleUsuarioStatus(cliente.id, id),
    onSuccess: async (updated: UsuarioCliente) => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Actualización",
        modulo: "Usuarios",
        detalles: `Usuario ${updated.activo ? "activado" : "desactivado"}`,
      });
      toast.success(`Usuario ${updated.activo ? "activado" : "desactivado"}`);
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      onUpdate();
    },
    onError: () => toast.error("Error al cambiar estado"),
  });

  const handleEdit = (usuario: UsuarioCliente) => {
    setEditingUsuario(usuario);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: UsuarioFormValues) => {
    // Transformar los campos del formulario a UsuarioData
    const nombre = [data.primerNombre, data.segundoNombre].filter(Boolean).join(" ");
    const apellido = [data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(" ");
    const usuarioData: UsuarioData = {
      nombre,
      apellido,
      email: data.email,
      telefono: data.telefono,
      perfilId: data.perfilId,
      rut: data.rut,
      clave: data.clave,
    };
    if (editingUsuario) {
      updateMutation.mutate({ id: editingUsuario.id, data: usuarioData });
    } else {
      addMutation.mutate(usuarioData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Usuarios del Cliente</h3>
        <Button
          onClick={() => {
            setEditingUsuario(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-[#244F82] hover:bg-[#0c3b64]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {cliente.usuarios.length > 0 ? (
        <div className="space-y-3">
          {cliente.usuarios.map((usuario: UsuarioCliente) => (
            <Card key={usuario.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <Badge
                          variant={usuario.activo ? "default" : "outline"}
                          className={
                            usuario.activo
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }
                        >
                          {usuario.activo ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{usuario.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{usuario.telefono}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {usuario.perfilNombre}
                          </Badge>
                          {usuario.sucursalNombre && (
                            <span className="text-xs text-gray-500">
                              {usuario.sucursalNombre}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleStatusMutation.mutate(usuario.id)}
                      variant="outline"
                      size="sm"
                    >
                      {usuario.activo ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleEdit(usuario)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingId(usuario.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hay usuarios registrados</p>
            <Button
              onClick={() => setIsFormOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar primer usuario
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUsuario ? "Editar Usuario" : "Agregar Usuario"}
            </DialogTitle>
          </DialogHeader>
          <UsuarioForm
            initialData={
              editingUsuario
                ? {
                    nombre: editingUsuario.nombre,
                    apellido: editingUsuario.apellido,
                    email: editingUsuario.email,
                    telefono: editingUsuario.telefono,
                    perfilId: editingUsuario.perfilId,
                    rut: "",
                    clave: "", // No se puede recuperar la clave original
                  }
                : null
            }
            onSubmit={handleSubmit}
            onBack={() => {
              setIsFormOpen(false);
              setEditingUsuario(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={() => setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado
              permanentemente y perderá acceso al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
