"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  User,
  Building,
  UserPlus,
  Package,
  CheckCircle,
  Edit2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPerfiles, fetchServicios } from "../../api/ajustesService";
import type { ClienteWizardData } from "../../types/ajustes";

interface ResumenStepProps {
  wizardData: ClienteWizardData;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
  isSubmitting?: boolean;
}

export function ResumenStep({ wizardData, onSubmit, onBack, onEdit, isSubmitting }: ResumenStepProps) {
  const { data: perfiles } = useQuery({
    queryKey: ["perfiles"],
    queryFn: fetchPerfiles,
  });

  const { data: servicios } = useQuery({
    queryKey: ["servicios"],
    queryFn: fetchServicios,
  });

  const { cliente, sucursal, usuario, servicios: serviciosSeleccionados } = wizardData;

  const perfilSeleccionado = perfiles?.find((p) => p.id === usuario?.perfilId);

  const getClienteNombre = () => {
    if (!cliente) return "";
    if (cliente.tipoPersona === "persona-natural") {
      return `${cliente.nombres} ${cliente.apellidos}`;
    }
    return cliente.razonSocial || "";
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">Resumen Final</p>
          <p className="text-sm text-gray-600 mt-1">
            Revisa cuidadosamente la información antes de crear el cliente. Podrás editar cada sección haciendo clic en el botón de editar.
          </p>
        </div>
      </div>

      {/* Sección Cliente */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
                {cliente?.tipoPersona === "persona-natural" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Building2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Datos del Cliente</p>
                <p className="text-lg font-semibold text-gray-900">{getClienteNombre()}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(0)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                {cliente?.tipoPersona === "persona-natural" ? "Persona Natural" : "Empresa"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-600">RUT</p>
              <p className="text-sm font-medium text-gray-900">{cliente?.rut}</p>
            </div>

            {cliente?.tipoPersona === "empresa" && (
              <>
                {cliente.nombreFantasia && (
                  <div>
                    <p className="text-xs text-gray-600">Nombre Fantasía</p>
                    <p className="text-sm font-medium text-gray-900">{cliente.nombreFantasia}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Giro
                  </p>
                  <p className="text-sm font-medium text-gray-900">{cliente.giro}</p>
                </div>
              </>
            )}

            <div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Teléfono
              </p>
              <p className="text-sm font-medium text-gray-900">{cliente?.telefono}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm font-medium text-gray-900">{cliente?.email}</p>
            </div>

            {cliente?.sitioWeb && (
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Sitio Web
                </p>
                <p className="text-sm font-medium text-blue-600">{cliente.sitioWeb}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección Sucursal */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sucursal Principal</p>
                <p className="text-lg font-semibold text-gray-900">{sucursal?.nombre}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Dirección
              </p>
              <p className="text-sm font-medium text-gray-900">{sucursal?.direccion}</p>
              <p className="text-sm text-gray-600">{sucursal?.comuna}, {sucursal?.region}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Teléfono
                </p>
                <p className="text-sm font-medium text-gray-900">{sucursal?.telefono}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="text-sm font-medium text-gray-900">{sucursal?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección Usuario */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Usuario Principal</p>
                <p className="text-lg font-semibold text-gray-900">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm font-medium text-gray-900">{usuario?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Teléfono
              </p>
              <p className="text-sm font-medium text-gray-900">{usuario?.telefono}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-600 mb-1">Perfil</p>
              {perfilSeleccionado && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: perfilSeleccionado.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {perfilSeleccionado.nombre}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {perfilSeleccionado.nivel}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección Servicios */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Servicios Contratados</p>
                <p className="text-lg font-semibold text-gray-900">
                  {serviciosSeleccionados.length} servicio{serviciosSeleccionados.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          {serviciosSeleccionados.length > 0 ? (
            <div className="space-y-2">
              {serviciosSeleccionados.map((sel) => {
                const servicio = servicios?.find((s) => s.id === sel.servicioId);
                const tarifa = servicio?.tarifas.find((t) => t.plan === sel.planSeleccionado);
                
                return servicio ? (
                  <div key={sel.servicioId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{servicio.nombre}</p>
                      <p className="text-xs text-gray-600">{servicio.codigo}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[#244F82] text-white mb-1">
                        {sel.planSeleccionado}
                      </Badge>
                      {tarifa && (
                        <p className="text-sm font-semibold text-gray-900">
                          ${tarifa.precioMensual.toLocaleString("es-CL")}/mes
                        </p>
                      )}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No se seleccionaron servicios
            </p>
          )}
        </CardContent>
      </Card>

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando Cliente..." : "Crear Cliente"}
        </Button>
      </div>
    </div>
  );
}
