"use client";

import { useState } from "react";
import { Plus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContratante } from "./hooks/useContratante";
import { ContratanteTable } from "./components/ContratanteTable";
import { ContratanteModal } from "./components/ContratanteModal";
import type { Contratante, ContratanteFormData } from "./types/contratante";
import { toast } from "sonner";
import { MESSAGES } from "@/lib/constants";

/**
 * Página principal del módulo Contratante
 */
export default function ContratantePage() {
  const {
    contratantes,
    loading,
    create,
    update,
    remove,
  } = useContratante();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContratante, setSelectedContratante] = useState<Contratante | null>(null);
  const [contratanteToDelete, setContratanteToDelete] = useState<Contratante | null>(null);

  // Crear nuevo contratante
  const handleCreate = () => {
    setSelectedContratante(null);
    setModalOpen(true);
  };

  // Editar contratante
  const handleEdit = (contratante: Contratante) => {
    setSelectedContratante(contratante);
    setModalOpen(true);
  };

  // Abrir diálogo de eliminación
  const handleDeleteClick = (contratante: Contratante) => {
    setContratanteToDelete(contratante);
    setDeleteDialogOpen(true);
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!contratanteToDelete) return;

    try {
      const success = await remove(contratanteToDelete.id);
      
      if (success) {
        toast.success(MESSAGES.DELETE.SUCCESS);
        setDeleteDialogOpen(false);
        setContratanteToDelete(null);
      } else {
        toast.error(MESSAGES.DELETE.ERROR);
      }
    } catch (error) {
      toast.error(MESSAGES.DELETE.ERROR);
    }
  };

  // Submit del formulario
  const handleSubmit = async (data: ContratanteFormData) => {
    try {
      if (selectedContratante) {
        // Actualizar
        const updated = await update(selectedContratante.id, data);
        if (updated) {
          toast.success("Contratante actualizado exitosamente");
        } else {
          toast.error("Error al actualizar el contratante");
        }
      } else {
        // Crear
        const created = await create(data);
        if (created) {
          toast.success("Contratante creado exitosamente");
        } else {
          toast.error("Error al crear el contratante");
        }
      }
    } catch (error) {
      toast.error("Error al guardar el contratante");
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-aflow-orange rounded-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-poppins font-bold">Contratantes</h1>
            <p className="text-muted-foreground">
              Gestión de contratantes del sistema
            </p>
          </div>
        </div>
        
        <Button variant="aflow" onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Contratante
        </Button>
      </div>

      {/* Tabla */}
      <ContratanteTable
        contratantes={contratantes}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Modal Crear/Editar */}
      <ContratanteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        contratante={selectedContratante}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el contratante{" "}
              <span className="font-semibold">
                {contratanteToDelete?.nombreCompleto || contratanteToDelete?.razonSocial}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
