"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Cliente, ServicioContratado, Servicio } from "../../../types/ajustes";
import {
  addServicioContratado,
  updateServicioContratado,
  deleteServicioContratado,
  addHistorialAccion,
  fetchServicios,
} from "../../../api/ajustesService";

const servicioSchema = z.object({
  servicioId: z.string().min(1, "Selecciona un servicio"),
  fechaInicio: z.string().min(1, "Fecha de inicio requerida"),
  tarifaMensual: z.number().min(0, "Tarifa debe ser mayor a 0"),
  planSeleccionado: z.enum(["Basic", "Professional", "Enterprise"]).optional(),
});

type ServicioFormValues = z.infer<typeof servicioSchema>;

const updateSchema = z.object({
  estado: z.enum(["Activo", "Pausado", "Finalizado"]),
  tarifaMensual: z.number().min(0, "Tarifa debe ser mayor a 0"),
  planSeleccionado: z.enum(["Basic", "Professional", "Enterprise"]).optional(),
  fechaFin: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

interface ServiciosManagerProps {
  cliente: Cliente;
  onUpdate: () => void;
}

export function ServiciosManager({ cliente, onUpdate }: ServiciosManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioContratado | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: serviciosDisponibles } = useQuery<Servicio[]>({
    queryKey: ["servicios"],
    queryFn: fetchServicios,
  });

  const addForm = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      servicioId: "",
      fechaInicio: new Date().toISOString().split("T")[0],
      tarifaMensual: 0,
    },
  });

  const editForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  const addMutation = useMutation({
    mutationFn: (data: ServicioFormValues) =>
      addServicioContratado(cliente.id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Creación",
        modulo: "Servicios",
        detalles: "Nuevo servicio contratado",
      });
      toast.success("Servicio agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsAddOpen(false);
      addForm.reset();
      onUpdate();
    },
    onError: () => toast.error("Error al agregar servicio"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateFormValues> }) =>
      updateServicioContratado(cliente.id, id, data),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Actualización",
        modulo: "Servicios",
        detalles: "Servicio actualizado",
      });
      toast.success("Servicio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setEditingServicio(null);
      onUpdate();
    },
    onError: () => toast.error("Error al actualizar servicio"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteServicioContratado(cliente.id, id),
    onSuccess: async () => {
      await addHistorialAccion({
        clienteId: cliente.id,
        usuarioNombre: "Usuario Actual",
        accion: "Eliminación",
        modulo: "Servicios",
        detalles: "Servicio eliminado",
      });
      toast.success("Servicio eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setDeletingId(null);
      onUpdate();
    },
    onError: () => toast.error("Error al eliminar servicio"),
  });

  const handleEdit = (servicio: ServicioContratado) => {
    setEditingServicio(servicio);
    editForm.reset({
      estado: servicio.estado,
      tarifaMensual: servicio.tarifaMensual,
      planSeleccionado: servicio.planSeleccionado,
      fechaFin: servicio.fechaFin || "",
    });
  };

  const handleAddSubmit = (data: ServicioFormValues) => {
    addMutation.mutate(data);
  };

  const handleEditSubmit = (data: UpdateFormValues) => {
    if (editingServicio) {
      updateMutation.mutate({ id: editingServicio.id, data });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Servicios Contratados</h3>
        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="bg-[#244F82] hover:bg-[#0c3b64]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Contratar Servicio
        </Button>
      </div>

      {cliente.serviciosContratados.length > 0 ? (
        <div className="space-y-3">
          {cliente.serviciosContratados.map((servicio: ServicioContratado) => (
            <Card key={servicio.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {servicio.servicioNombre}
                        </p>
                        <Badge
                          variant={servicio.estado === "Activo" ? "default" : "outline"}
                          className={
                            servicio.estado === "Activo"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : servicio.estado === "Pausado"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }
                        >
                          {servicio.estado}
                        </Badge>
                        {servicio.planSeleccionado && (
                          <Badge variant="outline" className="text-xs">
                            {servicio.planSeleccionado}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>Inicio: {servicio.fechaInicio}</span>
                          </div>
                          {servicio.fechaFin && (
                            <div className="flex items-center gap-2">
                              <span>Fin: {servicio.fechaFin}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span>
                            ${servicio.tarifaMensual.toLocaleString("es-CL")} / mes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEdit(servicio)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingId(servicio.id)}
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
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hay servicios contratados</p>
            <Button
              onClick={() => setIsAddOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Contratar primer servicio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Contratar Servicio</DialogTitle>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="servicioId">Servicio *</Label>
              <Select
                value={addForm.watch("servicioId")}
                onValueChange={(value) => addForm.setValue("servicioId", value)}
              >
                <SelectTrigger
                  id="servicioId"
                  className={addForm.formState.errors.servicioId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviciosDisponibles?.map((servicio: Servicio) => (
                    <SelectItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addForm.formState.errors.servicioId && (
                <p className="text-xs text-red-500 mt-1">
                  {addForm.formState.errors.servicioId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
              <Input
                id="fechaInicio"
                type="date"
                {...addForm.register("fechaInicio")}
                className={addForm.formState.errors.fechaInicio ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label htmlFor="tarifaMensual">Tarifa Mensual *</Label>
              <Input
                id="tarifaMensual"
                type="number"
                {...addForm.register("tarifaMensual", { valueAsNumber: true })}
                placeholder="150000"
                className={addForm.formState.errors.tarifaMensual ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label htmlFor="planSeleccionado">Plan</Label>
              <Select
                value={addForm.watch("planSeleccionado")}
                onValueChange={(value) =>
                  addForm.setValue(
                    "planSeleccionado",
                    value as "Basic" | "Professional" | "Enterprise"
                  )
                }
              >
                <SelectTrigger id="planSeleccionado">
                  <SelectValue placeholder="Seleccionar plan (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#244F82] hover:bg-[#0c3b64]">
                Contratar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingServicio}
        onOpenChange={() => setEditingServicio(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Servicio Contratado</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleEditSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={editForm.watch("estado")}
                onValueChange={(value) =>
                  editForm.setValue("estado", value as "Activo" | "Pausado" | "Finalizado")
                }
              >
                <SelectTrigger id="estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-tarifaMensual">Tarifa Mensual *</Label>
              <Input
                id="edit-tarifaMensual"
                type="number"
                {...editForm.register("tarifaMensual", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="edit-planSeleccionado">Plan</Label>
              <Select
                value={editForm.watch("planSeleccionado")}
                onValueChange={(value) =>
                  editForm.setValue(
                    "planSeleccionado",
                    value as "Basic" | "Professional" | "Enterprise"
                  )
                }
              >
                <SelectTrigger id="edit-planSeleccionado">
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input id="fechaFin" type="date" {...editForm.register("fechaFin")} />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingServicio(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#244F82] hover:bg-[#0c3b64]">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el servicio contratado. Esta operación no se puede
              deshacer.
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
