"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContratanteForm } from "./ContratanteForm";
import type { Contratante, ContratanteFormData } from "../types/contratante";

interface ContratanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratante?: Contratante | null;
  onSubmit: (data: ContratanteFormData) => Promise<void>;
  loading?: boolean;
}

/**
 * Modal para crear/editar contratante
 * Responsivo: 600px desktop, fullscreen mobile
 */
export function ContratanteModal({
  open,
  onOpenChange,
  contratante,
  onSubmit,
  loading = false,
}: ContratanteModalProps) {
  const handleSubmit = async (data: ContratanteFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins">
            {contratante ? "Editar Contratante" : "Nuevo Contratante"}
          </DialogTitle>
          <DialogDescription>
            {contratante
              ? "Actualiza la información del contratante"
              : "Completa los datos del nuevo contratante"}
          </DialogDescription>
        </DialogHeader>
        
        <ContratanteForm
          contratante={contratante}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
