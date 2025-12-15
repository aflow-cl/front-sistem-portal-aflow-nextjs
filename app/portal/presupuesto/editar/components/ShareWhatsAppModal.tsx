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
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import type { BudgetDetailedData } from "@/types/presupuesto";

interface ShareWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetDetailedData;
}

export function ShareWhatsAppModal({
  isOpen,
  onClose,
  budget,
}: ShareWhatsAppModalProps) {
  const [phone, setPhone] = useState("");
  
  // Calculate total from items or use monto
  const montoTotal = budget.items?.reduce((sum, item) => sum + (item.total || 0), 0) || budget.monto || 0;
  
  const [message, setMessage] = useState(
    `Hola! \ud83d\udc4b\n\nTe comparto el presupuesto *${budget.folio}* para el proyecto *${budget.proyecto_info?.nombre || budget.proyecto || "Sin nombre"}*\n\n\ud83d\udcb0 Monto total: $${montoTotal.toLocaleString("es-CL")}\n\ud83d\udcca Estado: ${budget.estado}\n\nPuedes ver el presupuesto completo aqu\u00ed:\n${typeof window !== "undefined" ? `${window.location.origin}/presupuesto/visualizar/${budget.id}` : ""}\n\n\u00bfTienes alguna pregunta?`
  );
  const [errors, setErrors] = useState({ phone: "", message: "" });

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");
    // Chilean phone numbers are typically 8-9 digits, with country code it's 11-12 digits
    return digitsOnly.length >= 8 && digitsOnly.length <= 15;
  };

  const formatPhone = (phone: string) => {
    // Remove all non-digit characters
    let digitsOnly = phone.replace(/\D/g, "");
    
    // If starts with 56 (Chile country code), keep it
    // Otherwise, add 56 prefix
    if (!digitsOnly.startsWith("56") && digitsOnly.length >= 8) {
      digitsOnly = "56" + digitsOnly;
    }
    
    return digitsOnly;
  };

  const handleSend = () => {
    // Reset errors
    setErrors({ phone: "", message: "" });

    // Validate
    const newErrors = { phone: "", message: "" };
    
    if (!phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Ingresa un número de teléfono válido";
    }

    if (!message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }

    if (newErrors.phone || newErrors.message) {
      setErrors(newErrors);
      return;
    }

    // Format phone number
    const formattedPhone = formatPhone(phone);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    toast.success("Abriendo WhatsApp", {
      description: "Se abrió WhatsApp con el mensaje pre-cargado",
    });
    
    handleClose();
  };

  const handleClose = () => {
    setPhone("");
    setMessage("");
    setErrors({ phone: "", message: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Compartir por WhatsApp
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 pt-2">
            Envía el presupuesto{" "}
            <span className="font-semibold text-[#244F82]">{budget.folio}</span>{" "}
            por WhatsApp con un mensaje personalizado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Número de teléfono <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                +56
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors({ ...errors, phone: "" });
                }}
                placeholder="9 1234 5678"
                className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Formato: 912345678 (sin +56)
              </p>
            )}
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp-message" className="text-sm font-medium text-gray-700">
              Mensaje <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="whatsapp-message"
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
                <p className="text-xs text-gray-500">
                  Puedes usar *negrita* y _cursiva_
                </p>
              )}
              <p className="text-xs text-gray-500">{message.length}/1000</p>
            </div>
          </div>

          <div className="rounded-lg p-3 bg-green-50 border border-green-200">
            <p className="text-xs text-gray-700">
              <strong>Nota:</strong> Se abrirá WhatsApp Web o la aplicación con el mensaje
              pre-cargado listo para enviar.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
            Abrir WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
