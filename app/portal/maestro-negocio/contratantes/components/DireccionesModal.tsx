/**
 * Modal para gestionar direcciones de un Contratante
 * Muestra lista de direcciones con CRUD inline
 */

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Edit, Trash2, Star, Phone, Mail } from "lucide-react";
import { Contratante, Direccion, getDisplayName, getDireccionCompleta } from "../../types/maestroNegocio";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DireccionesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratante: Contratante | null;
}

export function DireccionesModal({
  open,
  onOpenChange,
  contratante,
}: DireccionesModalProps) {
  if (!contratante) return null;

  const direccionesActivas = contratante.direcciones.filter((d) => d.activa);

  const handleAddNew = () => {
    // TODO: Abrir form de creación
    alert("Función de agregar dirección en desarrollo");
  };

  const handleEdit = (direccion: Direccion) => {
    // TODO: Abrir form de edición
    alert(`Editar dirección: ${direccion.nombre}`);
  };

  const handleDelete = (direccion: Direccion) => {
    if (confirm(`¿Eliminar la dirección "${direccion.nombre}"?`)) {
      // TODO: Llamar a API
      alert(`Dirección ${direccion.nombre} eliminada`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-5 h-5 text-[#244F82]" />
            Direcciones de {getDisplayName(contratante)}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            RUT: {contratante.rut}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header con botón */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {direccionesActivas.length} dirección{direccionesActivas.length !== 1 ? "es" : ""} registrada{direccionesActivas.length !== 1 ? "s" : ""}
            </p>
            <Button
              onClick={handleAddNew}
              size="sm"
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90"
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

                        {/* Dirección completa */}
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{getDireccionCompleta(direccion)}</span>
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
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
