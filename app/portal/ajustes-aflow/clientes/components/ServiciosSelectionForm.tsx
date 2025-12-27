"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { fetchServicios } from "../../api/ajustesService";
import type { ServicioSeleccionado } from "../../types/ajustes";

interface ServiciosSelectionFormProps {
  initialData?: ServicioSeleccionado[];
  onSubmit: (data: ServicioSeleccionado[]) => void;
  onBack: () => void;
}

const CATEGORIA_COLORS = {
  Software: "bg-blue-100 text-blue-800 border-blue-300",
  Consultoría: "bg-purple-100 text-purple-800 border-purple-300",
  Soporte: "bg-green-100 text-green-800 border-green-300",
  Infraestructura: "bg-orange-100 text-orange-800 border-orange-300",
};

export function ServiciosSelectionForm({ initialData = [], onSubmit, onBack }: ServiciosSelectionFormProps) {
  const [selectedServicios, setSelectedServicios] = useState<ServicioSeleccionado[]>(initialData);
  const [expandedServicio, setExpandedServicio] = useState<string | null>(null);

  const { data: servicios, isLoading } = useQuery({
    queryKey: ["servicios"],
    queryFn: fetchServicios,
  });

  const handleToggleServicio = (servicioId: string) => {
    const isSelected = selectedServicios.some((s) => s.servicioId === servicioId);
    
    if (isSelected) {
      // Deseleccionar
      setSelectedServicios(selectedServicios.filter((s) => s.servicioId !== servicioId));
      if (expandedServicio === servicioId) {
        setExpandedServicio(null);
      }
    } else {
      // Seleccionar con plan por defecto
      setSelectedServicios([
        ...selectedServicios,
        { servicioId, planSeleccionado: "Basic" },
      ]);
      setExpandedServicio(servicioId);
    }
  };

  const handleChangePlan = (servicioId: string, plan: "Basic" | "Professional" | "Enterprise") => {
    setSelectedServicios(
      selectedServicios.map((s) =>
        s.servicioId === servicioId ? { ...s, planSeleccionado: plan } : s
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedServicios);
  };

  const serviciosActivos = servicios?.filter((s) => s.activo) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
        <Package className="w-5 h-5 text-[#244F82] mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">Servicios Contratados</p>
          <p className="text-sm text-gray-600 mt-1">
            Selecciona los servicios que el cliente podrá gestionar en el sistema y el plan tarifario correspondiente.
          </p>
        </div>
      </div>

      {/* Lista de Servicios */}
      <div className="space-y-2">
        {serviciosActivos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay servicios disponibles</p>
          </div>
        ) : (
          serviciosActivos.map((servicio) => {
            const isSelected = selectedServicios.some((s) => s.servicioId === servicio.id);
            const selectedData = selectedServicios.find((s) => s.servicioId === servicio.id);
            const isExpanded = expandedServicio === servicio.id;

            return (
              <Card
                key={servicio.id}
                className={`border-2 transition-all ${
                  isSelected ? "border-[#244F82] bg-blue-50" : "border-gray-200"
                }`}
              >
                <CardContent className="p-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleServicio(servicio.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{servicio.nombre}</h3>
                            <Badge className={CATEGORIA_COLORS[servicio.categoria]}>
                              {servicio.categoria}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                          <p className="text-xs text-gray-500 mt-1">Código: {servicio.codigo}</p>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedServicio(isExpanded ? null : servicio.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Plan Selection */}
                      {isSelected && isExpanded && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Seleccionar Plan Tarifario
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {servicio.tarifas.map((tarifa) => {
                              const isPlanSelected = selectedData?.planSeleccionado === tarifa.plan;

                              return (
                                <button
                                  key={tarifa.plan}
                                  type="button"
                                  onClick={() => handleChangePlan(servicio.id, tarifa.plan as "Basic" | "Professional" | "Enterprise")}
                                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                                    isPlanSelected
                                      ? "border-[#244F82] bg-white shadow-md"
                                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold ${isPlanSelected ? "text-[#244F82]" : "text-gray-700"}`}>
                                      {tarifa.plan}
                                    </span>
                                    {isPlanSelected && (
                                      <Check className="w-4 h-4 text-[#244F82]" />
                                    )}
                                  </div>
                                  <p className="text-lg font-bold text-gray-900">
                                    ${tarifa.precioMensual.toLocaleString("es-CL")}
                                  </p>
                                  <p className="text-xs text-gray-500 mb-2">/mes</p>
                                  <p className="text-xs text-gray-600">{tarifa.descripcion}</p>
                                  <ul className="mt-2 space-y-1">
                                    {tarifa.caracteristicas.slice(0, 3).map((car, idx) => (
                                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                        <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{car}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quick Plan Display */}
                      {isSelected && !isExpanded && selectedData && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-gray-600">Plan seleccionado:</span>
                          <Badge className="bg-[#244F82] text-white">
                            {selectedData.planSeleccionado}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Resumen de Selección */}
      {selectedServicios.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <p className="font-medium text-gray-900 mb-2">
            Servicios Seleccionados: {selectedServicios.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedServicios.map((sel) => {
              const servicio = servicios?.find((s) => s.id === sel.servicioId);
              return servicio ? (
                <Badge key={sel.servicioId} variant="outline" className="text-sm">
                  {servicio.nombre} - {sel.planSeleccionado}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-2 border-t mt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-[#244F82] hover:bg-[#0c3b64]"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
