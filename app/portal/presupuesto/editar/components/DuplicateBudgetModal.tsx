"use client";

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
import { Files, AlertTriangle } from "lucide-react";
import type { Budget } from "@/types/presupuesto";

interface DuplicateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DuplicateBudgetModal({
  open,
  onOpenChange,
  budget,
  onConfirm,
  isLoading = false,
}: DuplicateBudgetModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Files className="h-6 w-6 text-blue-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Duplicar presupuesto
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600 space-y-3 pt-2">
            <p>
              Estás a punto de crear una copia exacta del presupuesto{" "}
              <span className="font-semibold text-gray-900">{budget?.folio}</span>.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>El nuevo presupuesto incluirá:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>Todos los datos del cliente</li>
                <li>Información del proyecto</li>
                <li>Ítems y precios actuales</li>
                <li>Observaciones y notas</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Nota importante:</strong> El nuevo presupuesto tendrá un folio único
                y el estado será <strong>Borrador</strong>. Podrás editarlo inmediatamente
                después de la duplicación.
              </div>
            </div>

            <p className="text-xs text-gray-500 italic">
              Las notas internas y el historial NO se copiarán al nuevo presupuesto.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-[#244F82] hover:bg-[#1a3a5f]"
          >
            {isLoading ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                Duplicando...
              </>
            ) : (
              <>
                <Files className="h-4 w-4 mr-2" />
                Confirmar duplicación
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
