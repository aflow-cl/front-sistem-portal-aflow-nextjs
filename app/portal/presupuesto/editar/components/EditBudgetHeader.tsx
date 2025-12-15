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
  CopyCheck, 
  Files, 
  Save, 
  X,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Mail,
  Link
} from "lucide-react";
import { toast } from "sonner";
import { ESTADO_CONFIG } from "@/app/portal/presupuesto/api/budgetService";
import type { Budget } from "@/types/presupuesto";
import { NotifyEmailModal } from "./NotifyEmailModal";
import { ShareWhatsAppModal } from "./ShareWhatsAppModal";

type EstadoPresupuesto = Budget["estado"];

interface EditBudgetHeaderProps {
  budget: Budget;
  onSave: () => void;
  onDuplicate: () => void;
  onEstadoChange?: (newEstado: EstadoPresupuesto, comentario?: string) => void;
  onNotifyEmail?: (data: { to: string; subject: string; message: string }) => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function EditBudgetHeader({ 
  budget, 
  onSave, 
  onDuplicate,
  onEstadoChange,
  onNotifyEmail,
  isSaving = false,
  hasChanges = false
}: EditBudgetHeaderProps) {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  const [isChangingEstado, setIsChangingEstado] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
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
    const estadosConComentario: EstadoPresupuesto[] = ["Rechazado", "Finalizado", "Aprobado"];
    
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Notification Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Email Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailModal(true)}
              className="gap-1 sm:gap-2"
              disabled={isSaving}
              title="Notificar por correo"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Correo</span>
            </Button>

            {/* WhatsApp Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWhatsAppModal(true)}
              className="gap-1 sm:gap-2"
              disabled={isSaving}
              title="Compartir por WhatsApp"
            >
              <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            {/* Copy Link Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1 sm:gap-2"
              disabled={isSaving}
              title="Copiar link"
            >
              {linkCopied ? (
                <>
                  <CopyCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Copiado</span>
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  <span className="hidden sm:inline">Copiar link</span>
                </>
              )}
            </Button>
          </div>

          {/* Separator for larger screens */}
          <div className="hidden lg:block w-px h-6 bg-gray-300" />

          {/* Main Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Duplicate Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              className="gap-2"
              disabled={isSaving}
            >
              <Files className="h-4 w-4" />
              <span className="hidden xs:inline">Duplicar</span>
            </Button>

            {/* Cancel Button - Hidden on smallest screens */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-2 hidden sm:flex"
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
              <span className="hidden xs:inline">{isSaving ? "Guardando..." : "Guardar"}</span>
            </Button>
          </div>
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
                  : pendingEstado === "Aprobado"
                  ? "bg-blue-100"
                  : "bg-emerald-100"
              }`}>
                <MessageSquare className={`h-6 w-6 ${
                  pendingEstado === "Rechazado" 
                    ? "text-red-600" 
                    : pendingEstado === "Aprobado"
                    ? "text-blue-600"
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
              ) : pendingEstado === "Aprobado" ? (
                <>
                  Este cambio marcará el presupuesto como <strong>Aprobado</strong>.
                  Por favor, agrega un comentario confirmando la aprobación.
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
                    : pendingEstado === "Aprobado"
                    ? "Ej: Presupuesto aprobado por el cliente. Fecha de inicio..."
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
                : pendingEstado === "Aprobado"
                ? "bg-blue-50 border-blue-500"
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
                  : pendingEstado === "Aprobado"
                  ? "bg-blue-600 hover:bg-blue-700"
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

      {/* Email Modal */}
      <NotifyEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        budget={budget}
        onSend={onNotifyEmail}
      />

      {/* WhatsApp Modal */}
      <ShareWhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        budget={budget}
      />
    </div>
  );
}
