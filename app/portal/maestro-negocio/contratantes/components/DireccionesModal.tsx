/**
 * Modal para gestionar direcciones de un Contratante
 * Muestra lista de direcciones con CRUD inline
 */

"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Edit, Trash2, Star, Phone, Mail } from "lucide-react";
import { Contratante, Direccion, getDisplayName } from "../../types/maestroNegocio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DireccionForm, DireccionFormValues } from "./DireccionForm";
import { createDireccion, updateDireccion, deleteDireccion } from "../../api/maestroService";
import { toast } from "sonner";

interface DireccionesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratante: Contratante | null;
}

type FormMode = "list" | "create" | "edit";

export function DireccionesModal({
  open,
  onOpenChange,
  contratante,
}: DireccionesModalProps) {
  const [formMode, setFormMode] = useState<FormMode>("list");
  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(null);
  const [direccionToDelete, setDireccionToDelete] = useState<Direccion | null>(null);
  const queryClient = useQueryClient();

  // Mutation para crear dirección
  const createMutation = useMutation({
    mutationFn: (data: DireccionFormValues & { contratanteId: string }) =>
      createDireccion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Dirección creada exitosamente");
      setFormMode("list");
    },
    onError: (error: Error) => {
      toast.error("Error al crear dirección", {
        description: error.message,
      });
    },
  });

  // Mutation para actualizar dirección
  const updateMutation = useMutation({
    mutationFn: ({ contratanteId, direccionId, data }: { contratanteId: string; direccionId: string; data: DireccionFormValues }) =>
      updateDireccion(contratanteId, direccionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Dirección actualizada exitosamente");
      setFormMode("list");
      setSelectedDireccion(null);
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar dirección", {
        description: error.message,
      });
    },
  });

  // Mutation para eliminar dirección
  const deleteMutation = useMutation({
    mutationFn: ({ contratanteId, direccionId }: { contratanteId: string; direccionId: string }) =>
      deleteDireccion(contratanteId, direccionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      toast.success("Dirección eliminada exitosamente");
      setDireccionToDelete(null);
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar dirección", {
        description: error.message,
      });
    },
  });

  if (!contratante) return null;

  const direccionesActivas = contratante.direcciones.filter((d) => d.activa);

  const handleAddNew = () => {
    setSelectedDireccion(null);
    setFormMode("create");
  };

  const handleEdit = (direccion: Direccion) => {
    setSelectedDireccion(direccion);
    setFormMode("edit");
  };

  const handleDelete = (direccion: Direccion) => {
    setDireccionToDelete(direccion);
  };

  const handleConfirmDelete = () => {
    if (direccionToDelete) {
      deleteMutation.mutate({ contratanteId: contratante.id, direccionId: direccionToDelete.id });
    }
  };

  const handleFormSubmit = (data: DireccionFormValues) => {
    if (formMode === "create") {
      createMutation.mutate({ ...data, contratanteId: contratante.id });
    } else if (formMode === "edit" && selectedDireccion) {
      updateMutation.mutate({ contratanteId: contratante.id, direccionId: selectedDireccion.id, data });
    }
  };

  const handleFormCancel = () => {
    setFormMode("list");
    setSelectedDireccion(null);
  };

  // Convertir Direccion a DireccionFormValues para edición
  const getInitialFormData = (direccion: Direccion): Partial<DireccionFormValues> => {
    return {
      nombre: direccion.nombre,
      regionId: direccion.regionId,
      ciudadId: direccion.ciudadId,
      comuna: direccion.comuna,
      calle: direccion.calle,
      numero: direccion.numero,
      complemento: direccion.complemento,
      esPrincipal: direccion.esPrincipal,
      contactoNombre: direccion.contactoNombre,
      contactoTelefono: direccion.contactoTelefono,
      contactoEmail: direccion.contactoEmail,
    };
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-visible">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MapPin className="w-5 h-5 text-[#244F82]" />
              {formMode === "list" && `Direcciones de ${getDisplayName(contratante)}`}
              {formMode === "create" && "Nueva Dirección"}
              {formMode === "edit" && "Editar Dirección"}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              RUT: {contratante.rut}
            </p>
          </DialogHeader>

          {/* Vista de lista */}
          {formMode === "list" && (
            <div className="space-y-4">
              {/* Header con botón */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {direccionesActivas.length} dirección{direccionesActivas.length !== 1 ? "es" : ""} registrada{direccionesActivas.length !== 1 ? "s" : ""}
                </p>
                <Button
                  onClick={handleAddNew}
                  size="sm"
                  className="bg-[#244F82] hover:bg-[#1a3a5f]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva Dirección
                </Button>
              </div>

              <Separator />

              {/* Lista de direcciones */}
              {direccionesActivas.length === 0 ? (
                <div className="py-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hay direcciones registradas</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Agrega una nueva dirección para este contratante
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {direccionesActivas.map((direccion) => (
                      <Card
                        key={direccion.id}
                        className={`p-4 transition-all ${
                          direccion.esPrincipal
                            ? "border-[#244F82] bg-blue-50/30"
                            : "hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {/* Nombre y badges */}
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                {direccion.esPrincipal && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                                {direccion.nombre}
                              </h4>
                              {direccion.esPrincipal && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                  Principal
                                </Badge>
                              )}
                            </div>

                            {/* Dirección detallada */}
                            <div className="space-y-1.5 text-sm">
                              {/* Calle y número */}
                              <div className="flex items-start gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">{direccion.calle} {direccion.numero}</span>
                                  {direccion.complemento && (
                                    <span className="text-gray-500">, {direccion.complemento}</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Comuna, Ciudad, Región */}
                              <div className="pl-6 text-xs text-gray-600 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-gray-500 min-w-[60px]">Comuna:</span>
                                  <span>{direccion.comuna}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-gray-500 min-w-[60px]">Ciudad:</span>
                                  <span>{direccion.ciudadNombre}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-gray-500 min-w-[60px]">Región:</span>
                                  <span>{direccion.regionNombre}</span>
                                </div>
                              </div>
                            </div>

                            {/* Contacto */}
                            {(direccion.contactoNombre || direccion.contactoTelefono || direccion.contactoEmail) && (
                              <div className="pl-6 space-y-1">
                                {direccion.contactoNombre && (
                                  <p className="text-xs text-gray-600">
                                    <strong>Contacto:</strong> {direccion.contactoNombre}
                                  </p>
                                )}
                                {direccion.contactoTelefono && (
                                  <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {direccion.contactoTelefono}
                                  </p>
                                )}
                                {direccion.contactoEmail && (
                                  <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {direccion.contactoEmail}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(direccion)}
                              className="hover:bg-blue-100 text-[#244F82]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {!direccion.esPrincipal && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(direccion)}
                                className="hover:bg-red-100 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Footer info */}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                <p>
                  ℹ️ La dirección marcada como <strong>Principal</strong> se usará por defecto
                  en los presupuestos.
                </p>
              </div>

              {/* Botón cerrar */}
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}

          {/* Vista de formulario */}
          {(formMode === "create" || formMode === "edit") && (
            <DireccionForm
              mode={formMode}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={selectedDireccion ? getInitialFormData(selectedDireccion) : undefined}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              headerInfo={{
                title: `${formMode === "create" ? "Creando dirección para:" : "Editando dirección de:"} ${getDisplayName(contratante)}`,
                description: formMode === "create" 
                  ? "Complete los datos de la nueva dirección."
                  : "Modifique los datos de la dirección.",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmación de eliminación */}
      <AlertDialog open={!!direccionToDelete} onOpenChange={() => setDireccionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la dirección <strong>{direccionToDelete?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
