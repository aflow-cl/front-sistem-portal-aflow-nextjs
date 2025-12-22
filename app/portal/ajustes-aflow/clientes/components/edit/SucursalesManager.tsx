"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
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
import type { Cliente, Sucursal, SucursalData } from "../../../types/ajustes";
import {
  addSucursal,
  updateSucursal,
  deleteSucursal,
  toggleSucursalStatus,
  addHistorialAccion,
} from "../../../api/ajustesService";
import { SucursalForm } from "../SucursalForm";

interface SucursalesManagerProps {
  cliente: Cliente;
  onUpdate: () => void;
}

export function SucursalesManager({ cliente, onUpdate }: SucursalesManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: SucursalData) => addSucursal(cliente.id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Creación",
        modulo: "Sucursales",
        detalles: "Nueva sucursal agregada",
      });
      toast.success("Sucursal agregada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsFormOpen(false);
      onUpdate();
    },
    onError: () => toast.error("Error al agregar sucursal"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SucursalData> }) =>
      updateSucursal(cliente.id, id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Actualización",
        modulo: "Sucursales",
        detalles: "Sucursal actualizada",
      });
      toast.success("Sucursal actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsFormOpen(false);
      setEditingSucursal(null);
      onUpdate();
    },
    onError: () => toast.error("Error al actualizar sucursal"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSucursal(cliente.id, id),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Eliminación",
        modulo: "Sucursales",
        detalles: "Sucursal eliminada",
      });
      toast.success("Sucursal eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setDeletingId(null);
      onUpdate();
    },
    onError: () => toast.error("Error al eliminar sucursal"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => toggleSucursalStatus(cliente.id, id),
    onSuccess: async (updated: Sucursal) => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Actualización",
        modulo: "Sucursales",
        detalles: `Sucursal ${updated.activa ? "activada" : "desactivada"}`,
      });
      toast.success(`Sucursal ${updated.activa ? "activada" : "desactivada"}`);
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      onUpdate();
    },
    onError: () => toast.error("Error al cambiar estado"),
  });

  const handleEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: SucursalData) => {
    if (editingSucursal) {
      updateMutation.mutate({ id: editingSucursal.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sucursales del Cliente</h3>
        <Button
          onClick={() => {
            setEditingSucursal(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-[#244F82] hover:bg-[#0c3b64]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Sucursal
        </Button>
      </div>

      {cliente.sucursales.length > 0 ? (
        <div className="space-y-3">
          {cliente.sucursales.map((sucursal: Sucursal) => (
            <Card key={sucursal.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {sucursal.nombre}
                        </p>
                        <Badge
                          variant={sucursal.activa ? "default" : "outline"}
                          className={
                            sucursal.activa
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }
                        >
                          {sucursal.activa ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {sucursal.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>
                            {sucursal.direccion}, {sucursal.comuna},{" "}
                            {sucursal.region}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{sucursal.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{sucursal.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleStatusMutation.mutate(sucursal.id)}
                      variant="outline"
                      size="sm"
                    >
                      {sucursal.activa ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleEdit(sucursal)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingId(sucursal.id)}
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
            <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hay sucursales registradas</p>
            <Button
              onClick={() => setIsFormOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar primera sucursal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSucursal ? "Editar Sucursal" : "Agregar Sucursal"}
            </DialogTitle>
          </DialogHeader>
          <SucursalForm
            initialData={editingSucursal || null}
            clienteNombre={cliente.razonSocial}
            onSubmit={handleSubmit}
            onBack={() => {
              setIsFormOpen(false);
              setEditingSucursal(null);
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
            <AlertDialogTitle>¿Eliminar sucursal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sucursal será eliminada
              permanentemente.
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
