"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, X } from "lucide-react";
import { toast } from "sonner";
import type { BudgetDetailedData } from "@/types/presupuesto";

interface NotifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetDetailedData;
  onSend?: (data: { to: string; subject: string; message: string }) => Promise<void>;
}

export function NotifyEmailModal({
  isOpen,
  onClose,
  budget,
  onSend,
}: NotifyEmailModalProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    `Presupuesto ${budget.folio} - ${budget.proyecto_info?.nombre || budget.proyecto || "Proyecto"}`
  );
  
  // Calculate total from items or use monto
  const montoTotal = budget.items?.reduce((sum, item) => sum + (item.total || 0), 0) || budget.monto || 0;
  
  const [message, setMessage] = useState(
    `Estimado/a,\n\nAdjunto encontrar\u00e1s el presupuesto ${budget.folio} para el proyecto "${budget.proyecto_info?.nombre || budget.proyecto || "Sin nombre"}".\n\nMonto total: $${montoTotal.toLocaleString("es-CL")}\nEstado: ${budget.estado}\n\nPara ver el presupuesto completo, haz clic en el siguiente enlace:\n${typeof window !== "undefined" ? `${window.location.origin}/presupuesto/visualizar/${budget.id}` : ""}\n\nSaludos cordiales.`
  );
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({ email: "", subject: "", message: "" });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSend = async () => {
    // Reset errors
    setErrors({ email: "", subject: "", message: "" });

    // Validate
    const newErrors = { email: "", subject: "", message: "" };
    
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!subject.trim()) {
      newErrors.subject = "El asunto es obligatorio";
    }

    if (!message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }

    if (newErrors.email || newErrors.subject || newErrors.message) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);

    try {
      if (onSend) {
        // Call custom send function if provided
        await onSend({
          to: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        });
      } else {
        // Fallback to mailto: link
        const mailtoLink = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
      }

      toast.success("Notificación enviada", {
        description: `Se envió la notificación a ${email}`,
      });
      
      handleClose();
    } catch (error) {
      toast.error("Error al enviar", {
        description: "No se pudo enviar la notificación por correo",
      });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSubject(`Presupuesto ${budget.folio} - ${budget.proyecto_info?.nombre || budget.proyecto || "Proyecto"}`);
    setMessage("");
    setErrors({ email: "", subject: "", message: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Notificar por Correo
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 pt-2">
            Envía una notificación por correo electrónico con los detalles del presupuesto{" "}
            <span className="font-semibold text-[#244F82]">{budget.folio}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Para <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              placeholder="ejemplo@correo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Asunto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors({ ...errors, subject: "" });
              }}
              placeholder="Asunto del correo"
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-xs text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Mensaje <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors({ ...errors, message: "" });
              }}
              placeholder="Escribe tu mensaje aquí..."
              className={`min-h-[200px] resize-none ${errors.message ? "border-red-500" : ""}`}
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              {errors.message ? (
                <p className="text-xs text-red-600">{errors.message}</p>
              ) : (
                <div />
              )}
              <p className="text-xs text-gray-500">{message.length}/1000</p>
            </div>
          </div>

          <div className="rounded-lg p-3 bg-blue-50 border border-blue-200">
            <p className="text-xs text-gray-700">
              <strong>Nota:</strong> Se incluirá automáticamente un enlace al presupuesto
              en el mensaje.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
