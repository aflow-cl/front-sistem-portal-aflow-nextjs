"use client";

import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Building2,
  Save,
  X,
  AlertCircle,
  History,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { Cliente } from "../../types/ajustes";
import { updateCliente, addHistorialAccion } from "../../api/ajustesService";
import {
  GeneralTab,
  SucursalesManager,
  UsuariosManager,
  PerfilesManager,
  ServiciosManager,
  HistorialAcciones,
} from "./edit";

interface EditClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
}

export function EditClienteModal({
  open,
  onOpenChange,
  cliente,
}: EditClienteModalProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const queryClient = useQueryClient();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setHasChanges(false);
      setActiveTab("general");
    }
  }, [open]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<Cliente>) => {
      if (!cliente) throw new Error("No cliente selected");
      return updateCliente(cliente.id, updatedData);
    },
    onSuccess: async (updated) => {
      // Update cache
      queryClient.setQueryData(["clientes"], (old: Cliente[] = []) =>
        old.map((c) => (c.id === updated.id ? updated : c))
      );
      
      // Add to history
      await addHistorialAccion({
        clienteId: updated.id,
        usuarioNombre: "Usuario Actual", // TODO: Get from auth context
        accion: "Actualización",
        modulo: "General",
        detalles: "Datos del cliente actualizados",
      });
      
      toast.success("Cliente actualizado exitosamente");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      toast.error("Error al actualizar cliente");
      console.error(error);
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleClose = () => {
    if (hasChanges) {
      setShowExitConfirm(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // The actual save is handled by individual tab components
    // This is a placeholder for coordinated save
    toast.info("Guardando cambios...");
  };

  if (!cliente) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{cliente.razonSocial}</p>
                  <p className="text-sm font-normal text-gray-500">
                    Editar información del cliente
                  </p>
                </div>
              </DialogTitle>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Cambios sin guardar
                  </Badge>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="bg-[#244F82] hover:bg-[#0c3b64]"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="sucursales">
                Sucursales ({cliente.sucursales.length})
              </TabsTrigger>
              <TabsTrigger value="usuarios">
                Usuarios ({cliente.usuarios.length})
              </TabsTrigger>
              <TabsTrigger value="perfiles">Perfiles</TabsTrigger>
              <TabsTrigger value="servicios">
                Servicios ({cliente.serviciosContratados.length})
              </TabsTrigger>
              <TabsTrigger value="historial">
                <History className="w-4 h-4 mr-1" />
                Historial
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="general" className="mt-0">
                <GeneralTab
                  cliente={cliente}
                  onUpdate={(updated: Partial<Cliente>) => {
                    updateMutation.mutate(updated);
                    setHasChanges(true);
                  }}
                />
              </TabsContent>

              <TabsContent value="sucursales" className="mt-0">
                <SucursalesManager
                  cliente={cliente}
                  onUpdate={() => {
                    setHasChanges(true);
                    queryClient.invalidateQueries({ queryKey: ["clientes"] });
                  }}
                />
              </TabsContent>

              <TabsContent value="usuarios" className="mt-0">
                <UsuariosManager
                  cliente={cliente}
                  onUpdate={() => {
                    setHasChanges(true);
                    queryClient.invalidateQueries({ queryKey: ["clientes"] });
                  }}
                />
              </TabsContent>

              <TabsContent value="perfiles" className="mt-0">
                <PerfilesManager
                  cliente={cliente}
                  onUpdate={() => {
                    setHasChanges(true);
                    queryClient.invalidateQueries({ queryKey: ["clientes"] });
                  }}
                />
              </TabsContent>

              <TabsContent value="servicios" className="mt-0">
                <ServiciosManager
                  cliente={cliente}
                  onUpdate={() => {
                    setHasChanges(true);
                    queryClient.invalidateQueries({ queryKey: ["clientes"] });
                  }}
                />
              </TabsContent>

              <TabsContent value="historial" className="mt-0">
                <HistorialAcciones clienteId={cliente.id} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. Si cierras ahora, se perderán todos
              los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowExitConfirm(false);
                setHasChanges(false);
                onOpenChange(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
