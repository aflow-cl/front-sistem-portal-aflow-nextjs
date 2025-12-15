"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Edit, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Trash2,
  Clock
} from "lucide-react";
import type { AccionHistoria } from "@/types/presupuesto";

interface BudgetHistoryTimelineProps {
  history: AccionHistoria[];
  loading?: boolean;
}

const ACTION_CONFIG = {
  creado: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Creado"
  },
  modificado: {
    icon: Edit,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Modificado"
  },
  cambio_estado: {
    icon: RefreshCw,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    label: "Cambio de estado"
  },
  enviado: {
    icon: Send,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    label: "Enviado"
  },
  aprobado: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "Aprobado"
  },
  rechazado: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "Rechazado"
  },
  comentario: {
    icon: MessageSquare,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    label: "Comentario"
  },
  eliminado: {
    icon: Trash2,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Eliminado"
  }
};

export function BudgetHistoryTimeline({ history, loading = false }: BudgetHistoryTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="rounded-xl shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Historial del Presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#244F82] border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="rounded-xl shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Historial del Presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No hay historial disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Historial del Presupuesto
          </CardTitle>
          <span className="text-xs text-gray-500 font-medium">
            {history.length} {history.length === 1 ? "evento" : "eventos"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-6">
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

              {/* Timeline items */}
              <div className="space-y-6">
                {history.map((item, index) => {
                  const config = ACTION_CONFIG[item.tipo] || ACTION_CONFIG.modificado;
                  const Icon = config.icon;
                  const isLast = index === history.length - 1;

                  return (
                    <div key={item.id} className="relative pl-12">
                      {/* Icon */}
                      <div 
                        className={`absolute left-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center border-2 border-white shadow-sm`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className={`${!isLast ? "pb-6" : ""}`}>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {item.descripcion}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {item.usuario}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-700">
                                {formatDate(item.fecha)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTime(item.fecha)}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          {item.detalles && Object.keys(item.detalles).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="space-y-1">
                                {item.detalles.estadoAnterior && item.detalles.estadoNuevo && (
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Estado:</span>{" "}
                                    <span className="text-red-600">{item.detalles.estadoAnterior}</span>
                                    {" → "}
                                    <span className="text-green-600">{item.detalles.estadoNuevo}</span>
                                  </p>
                                )}
                                {item.detalles.campo && (
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Campo modificado:</span>{" "}
                                    {item.detalles.campo}
                                  </p>
                                )}
                                {item.detalles.motivo && (
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Motivo:</span>{" "}
                                    {item.detalles.motivo}
                                  </p>
                                )}
                                {item.detalles.cliente && (
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Cliente:</span>{" "}
                                    {item.detalles.cliente}
                                  </p>
                                )}
                                {item.detalles.monto && (
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Monto:</span>{" "}
                                    ${item.detalles.monto.toLocaleString("es-CL")}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
