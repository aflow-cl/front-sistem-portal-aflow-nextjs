"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  CopyCheck, 
  Files, 
  Save, 
  X,
  AlertCircle,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { ESTADO_CONFIG } from "@/app/portal/presupuesto/api/budgetService";
import type { Budget } from "@/types/presupuesto";

type EstadoPresupuesto = Budget["estado"];

interface EditBudgetHeaderProps {
  budget: Budget;
  onSave: () => void;
  onDuplicate: () => void;
  onEstadoChange?: (newEstado: EstadoPresupuesto, comentario?: string) => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function EditBudgetHeader({ 
  budget, 
  onSave, 
  onDuplicate,
  onEstadoChange,
  isSaving = false,
  hasChanges = false
}: EditBudgetHeaderProps) {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  const [isChangingEstado, setIsChangingEstado] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<EstadoPresupuesto | null>(null);
  const [comentario, setComentario] = useState("");
  const [comentarioError, setComentarioError] = useState("");

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/presupuesto/visualizar/${budget.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success("Link copiado correctamente", {
        description: "El enlace de visualización se copió al portapapeles"
      });
      
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Error al copiar", {
        description: "No se pudo copiar el enlace al portapapeles"
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán."
      );
      if (!confirmed) return;
    }
    router.back();
  };

  const handleEstadoChange = async (newEstado: string) => {
    if (!onEstadoChange) return;
    
    // Estados que requieren confirmación y comentario
    const estadosConComentario: EstadoPresupuesto[] = ["Rechazado", "Finalizado"];
    
    if (estadosConComentario.includes(newEstado as EstadoPresupuesto)) {
      // Mostrar modal de confirmación
      setPendingEstado(newEstado as EstadoPresupuesto);
      setComentario("");
      setComentarioError("");
      setShowComentarioModal(true);
      return;
    }
    
    // Para otros estados, cambiar directamente
    await executeEstadoChange(newEstado as EstadoPresupuesto);
  };

  const executeEstadoChange = async (newEstado: EstadoPresupuesto, comentarioParam?: string) => {
    const estadoAnterior = budget.estado;
    setIsChangingEstado(true);
    
    try {
      await onEstadoChange!(newEstado, comentarioParam);
      toast.success("Estado actualizado", {
        description: `Cambiado de "${estadoAnterior}" a "${newEstado}"`,
      });
    } catch (error) {
      toast.error("Error al cambiar estado", {
        description: "No se pudo actualizar el estado del presupuesto",
      });
      console.error(error);
    } finally {
      setIsChangingEstado(false);
    }
  };

  const handleConfirmComentario = async () => {
    if (!comentario.trim()) {
      setComentarioError("El comentario es obligatorio para este cambio de estado");
      return;
    }

    if (comentario.trim().length < 10) {
      setComentarioError("El comentario debe tener al menos 10 caracteres");
      return;
    }

    setShowComentarioModal(false);
    await executeEstadoChange(pendingEstado!, comentario.trim());
    setPendingEstado(null);
    setComentario("");
  };

  const handleCancelComentario = () => {
    setShowComentarioModal(false);
    setPendingEstado(null);
    setComentario("");
    setComentarioError("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const estadoConfig = ESTADO_CONFIG[budget.estado as keyof typeof ESTADO_CONFIG];

  // Lista de estados disponibles
  const estadosDisponibles: EstadoPresupuesto[] = [
    "Borrador",
    "En revisión",
    "En proceso",
    "Pendiente",
    "Aprobado",
    "Rechazado",
    "Finalizado",
    "Cerrado"
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Title and metadata */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Presupuesto
            </h1>
            {hasChanges && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Cambios sin guardar</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold text-[#244F82]">
              {budget.folio}
            </span>
            <span className="text-gray-400">•</span>
            
            {/* Estado Selector */}
            {onEstadoChange ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Estado:</span>
                <Select
                  value={budget.estado}
                  onValueChange={handleEstadoChange}
                  disabled={isChangingEstado || isSaving}
                >
                  <SelectTrigger className="h-7 w-auto min-w-[140px] border-0 bg-gray-50 hover:bg-gray-100 focus:ring-1">
                    <div className="flex items-center gap-2">
                      {isChangingEstado && (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                      <SelectValue>
                        <Badge
                          variant="outline"
                          className={estadoConfig?.badgeClass}
                        >
                          {estadoConfig?.label || budget.estado}
                        </Badge>
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {estadosDisponibles.map((estado) => {
                      const config = ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG];
                      return (
                        <SelectItem key={estado} value={estado}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${config?.color || 'bg-gray-500'}`} />
                            <span>{config?.label || estado}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Badge
                variant="outline"
                className={estadoConfig?.badgeClass}
              >
                {estadoConfig?.label || budget.estado}
              </Badge>
            )}
            
            <span className="text-gray-400">•</span>
            <span>
              Creado el {formatDate(budget.fecha)}
            </span>
            {budget.autor && (
              <>
                <span className="text-gray-400">•</span>
                <span>por {budget.autor}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Link Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
            disabled={isSaving}
          >
            {linkCopied ? (
              <>
                <CopyCheck className="h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar link
              </>
            )}
          </Button>

          {/* Duplicate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            className="gap-2"
            disabled={isSaving}
          >
            <Files className="h-4 w-4" />
            Duplicar
          </Button>

          {/* Cancel Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-2"
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>

          {/* Save Button */}
          <Button
            size="sm"
            onClick={onSave}
            className="gap-2 bg-[#244F82] hover:bg-[#1a3a5f]"
            disabled={isSaving || !hasChanges}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Modal de Comentario para Estados Críticos */}
      <Dialog open={showComentarioModal} onOpenChange={setShowComentarioModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                pendingEstado === "Rechazado" 
                  ? "bg-red-100" 
                  : "bg-emerald-100"
              }`}>
                <MessageSquare className={`h-6 w-6 ${
                  pendingEstado === "Rechazado" 
                    ? "text-red-600" 
                    : "text-emerald-600"
                }`} />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Cambiar estado a &quot;{pendingEstado}&quot;
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              {pendingEstado === "Rechazado" ? (
                <>
                  Este cambio marcará el presupuesto como <strong>Rechazado</strong>.
                  Por favor, indica el motivo del rechazo para mantener un registro claro.
                </>
              ) : (
                <>
                  Este cambio marcará el presupuesto como <strong>Finalizado</strong>.
                  Por favor, agrega un comentario sobre el cierre del presupuesto.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comentario" className="text-sm font-medium text-gray-700">
                Comentario <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comentario"
                value={comentario}
                onChange={(e) => {
                  setComentario(e.target.value);
                  setComentarioError("");
                }}
                placeholder={
                  pendingEstado === "Rechazado"
                    ? "Ej: El cliente decidió no continuar con el proyecto debido a..."
                    : "Ej: Presupuesto completado exitosamente. Cliente confirmó..."
                }
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {comentarioError ? (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {comentarioError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Mínimo 10 caracteres
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {comentario.length}/500
                </p>
              </div>
            </div>

            <div className={`rounded-lg p-3 border-l-4 ${
              pendingEstado === "Rechazado"
                ? "bg-red-50 border-red-500"
                : "bg-emerald-50 border-emerald-500"
            }`}>
              <p className="text-xs text-gray-700">
                <strong>Nota:</strong> Este comentario quedará registrado en el historial
                del presupuesto y será visible para todo el equipo.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelComentario}
              disabled={isChangingEstado}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmComentario}
              disabled={isChangingEstado}
              className={
                pendingEstado === "Rechazado"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              {isChangingEstado ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Cambiando...
                </>
              ) : (
                `Confirmar cambio a ${pendingEstado}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
