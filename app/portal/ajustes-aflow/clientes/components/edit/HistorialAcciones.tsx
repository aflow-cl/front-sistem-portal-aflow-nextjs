"use client";

import { useQuery } from "@tanstack/react-query";
import { History, Clock, User, FileEdit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHistorialAcciones, type HistorialAccion } from "../../../api/ajustesService";

interface HistorialAccionesProps {
  clienteId: string;
}

const MODULO_COLORS = {
  General: "bg-blue-100 text-blue-800 border-blue-300",
  Sucursales: "bg-green-100 text-green-800 border-green-300",
  Usuarios: "bg-purple-100 text-purple-800 border-purple-300",
  Perfiles: "bg-orange-100 text-orange-800 border-orange-300",
  Servicios: "bg-pink-100 text-pink-800 border-pink-300",
};

const ACCION_ICONS = {
  Creación: <FileEdit className="w-4 h-4 text-green-600" />,
  Actualización: <FileEdit className="w-4 h-4 text-blue-600" />,
  Eliminación: <FileEdit className="w-4 h-4 text-red-600" />,
};

export function HistorialAcciones({ clienteId }: HistorialAccionesProps) {
  const { data: historial, isLoading } = useQuery({
    queryKey: ["historial", clienteId],
    queryFn: () => fetchHistorialAcciones(clienteId),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-2">No hay historial de acciones</p>
          <p className="text-sm text-gray-400">
            Las acciones realizadas sobre este cliente aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by date
  const groupedByDate = historial.reduce((acc: Record<string, HistorialAccion[]>, accion: HistorialAccion) => {
    const date = new Date(accion.fecha).toLocaleDateString("es-CL");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(accion);
    return acc;
  }, {} as Record<string, HistorialAccion[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historial de Acciones</h3>
        <Badge variant="outline" className="text-xs">
          {historial.length} registro{historial.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {Object.entries(groupedByDate).map(([date, acciones]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="space-y-2 ml-6 border-l-2 border-gray-200 pl-4">
            {(acciones as HistorialAccion[]).map((accion: HistorialAccion) => (
              <Card key={accion.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute -left-[29px] top-5 w-3 h-3 bg-white border-2 border-[#244F82] rounded-full"></div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {ACCION_ICONS[accion.accion as keyof typeof ACCION_ICONS]}
                        <span className="font-semibold text-gray-900">
                          {accion.accion}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            MODULO_COLORS[accion.modulo as keyof typeof MODULO_COLORS]
                          }
                        >
                          {accion.modulo}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {accion.detalles}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{accion.usuarioNombre}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{getRelativeTime(accion.fecha)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
