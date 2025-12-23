"use client";

import { Edit2, Package, MapPin, Mail, Phone, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProveedorWizardData } from "./ProveedorWizardModal";

interface ProveedorResumenStepProps {
  wizardData: ProveedorWizardData;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
  isSubmitting: boolean;
}

export function ProveedorResumenStep({
  wizardData,
  onSubmit,
  onBack,
  onEdit,
  isSubmitting,
}: ProveedorResumenStepProps) {
  const { basic, contact, direccion, productos } = wizardData;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Resumen del Proveedor</h3>
        <p className="text-sm text-gray-600">
          Revise la información antes de crear el proveedor
        </p>
      </div>

      <div className="space-y-4">
        {/* Datos Básicos */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {basic?.tipoPersona === "empresa" ? (
                  <Building2 className="w-4 h-4 text-[#244F82]" />
                ) : (
                  <User className="w-4 h-4 text-[#244F82]" />
                )}
                Datos Básicos
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(0)}
                className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-orange-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo de Persona</p>
                <p className="font-medium">
                  {basic?.tipoPersona === "empresa" ? "Empresa" : "Persona Natural"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RUT</p>
                <p className="font-medium">{basic?.rut}</p>
              </div>
            </div>

            {basic?.tipoPersona === "empresa" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Razón Social</p>
                  <p className="font-medium">{basic.razonSocial}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giro</p>
                  <p className="font-medium">{basic.giro}</p>
                </div>
              </div>
            )}

            {basic?.tipoPersona === "persona-natural" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombres</p>
                  <p className="font-medium">{basic.nombres}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apellidos</p>
                  <p className="font-medium">{basic.apellidos}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#244F82]" />
                Información de Contacto
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(1)}
                className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-orange-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{contact?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{contact?.telefono}</p>
                </div>
              </div>
            </div>

            {contact?.notas && (
              <div>
                <p className="text-sm text-gray-500">Notas</p>
                <p className="text-sm text-gray-700">{contact.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#244F82]" />
                Dirección Principal
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(2)}
                className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-orange-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {direccion ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{direccion.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">
                    {direccion.calle} {direccion.numero}
                    {direccion.complemento && `, ${direccion.complemento}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {direccion.comuna}, {direccion.ciudadNombre}, {direccion.regionNombre}
                  </p>
                </div>
                {direccion.contactoNombre && (
                  <div>
                    <p className="text-sm text-gray-500">Contacto</p>
                    <p className="text-sm">
                      {direccion.contactoNombre}
                      {direccion.contactoTelefono && ` - ${direccion.contactoTelefono}`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No se agregó dirección</p>
            )}
          </CardContent>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-[#244F82]" />
                Catálogo de Productos
                <Badge variant="secondary" className="ml-2">
                  {productos.length} producto(s)
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(3)}
                className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-orange-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {productos.length > 0 ? (
              <div className="space-y-3">
                {productos.map((producto, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        {producto.codigo && (
                          <p className="text-xs text-gray-500">Código: {producto.codigo}</p>
                        )}
                      </div>
                      <Badge variant="outline">
                        ${producto.valorInterno.toLocaleString()} / {producto.unidadMedida}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{producto.descripcion}</p>
                    {producto.categoria && (
                      <Badge variant="secondary" className="mt-2">
                        {producto.categoria}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No se agregaron productos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#244F82] hover:bg-[#1a3a5f]"
        >
          {isSubmitting ? "Creando..." : "Crear Proveedor"}
        </Button>
      </div>
    </div>
  );
}
