"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  History,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Edit,
  Mail,
  MessageSquare,
  Trash2,
  Clock,
} from "lucide-react";
import { fetchHistoria } from "../api/budgetService";
import type { AccionTipo } from "@/types/presupuesto";

// Icon mapping for action types
const accionIcons: Record<AccionTipo, React.ComponentType<{ className?: string }>> = {
  creado: FileText,
  modificado: Edit,
  cambio_estado: Clock,
  enviado: Mail,
  aprobado: CheckCircle,
  rechazado: XCircle,
  comentario: MessageSquare,
  eliminado: Trash2,
};

// Color mapping for action types
const accionColors: Record<AccionTipo, string> = {
  creado: "bg-blue-50 text-blue-600 border-blue-200",
  modificado: "bg-yellow-50 text-yellow-600 border-yellow-200",
  cambio_estado: "bg-purple-50 text-purple-600 border-purple-200",
  enviado: "bg-indigo-50 text-indigo-600 border-indigo-200",
  aprobado: "bg-green-50 text-green-600 border-green-200",
  rechazado: "bg-red-50 text-red-600 border-red-200",
  comentario: "bg-gray-50 text-gray-600 border-gray-200",
  eliminado: "bg-red-50 text-red-600 border-red-200",
};

// Label mapping for action types
const accionLabels: Record<AccionTipo, string> = {
  creado: "Creado",
  modificado: "Modificado",
  cambio_estado: "Cambio de Estado",
  enviado: "Enviado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  comentario: "Comentario",
  eliminado: "Eliminado",
};

export default function HistoriaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");

  // Fetch historia
  const { data: historia = [], isLoading } = useQuery({
    queryKey: ["historia"],
    queryFn: () => fetchHistoria(),
  });

  // Filter historia
  const filteredHistoria = useMemo(() => {
    return historia.filter((accion) => {
      const matchesSearch =
        searchTerm === "" ||
        accion.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accion.usuario.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = filterTipo === "all" || accion.tipo === filterTipo;

      return matchesSearch && matchesTipo;
    });
  }, [historia, searchTerm, filterTipo]);

  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Hoy a las ${date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days === 1) {
      return `Ayer a las ${date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days < 7) {
      return `Hace ${days} días`;
    } else {
      return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por folio, usuario o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="creado">Creado</SelectItem>
                <SelectItem value="modificado">Modificado</SelectItem>
                <SelectItem value="cambio_estado">Cambio de Estado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="comentario">Comentario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Acciones</div>
          <div className="text-2xl font-bold text-gray-900">{historia.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Presupuestos</div>
          <div className="text-2xl font-bold text-gray-900">
            {new Set(historia.map((h) => h.folio)).size}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Usuarios Activos</div>
          <div className="text-2xl font-bold text-gray-900">
            {new Set(historia.map((h) => h.usuario)).size}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Hoy</div>
          <div className="text-2xl font-bold text-gray-900">
            {
              historia.filter(
                (h) =>
                  new Date(h.fecha).toDateString() === new Date().toDateString()
              ).length
            }
          </div>
        </Card>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-aflow-blue border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando historia...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredHistoria.length === 0 && (
        <Card className="p-12 text-center">
          <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron acciones
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterTipo !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "No hay acciones registradas aún"}
          </p>
        </Card>
      )}

      {/* Timeline */}
      {!isLoading && filteredHistoria.length > 0 && (
        <div className="space-y-4">
          {filteredHistoria.map((accion) => {
            const Icon = accionIcons[accion.tipo];
            const colorClass = accionColors[accion.tipo];

            return (
              <Card key={accion.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {accion.folio}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                        >
                          {accionLabels[accion.tipo]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(accion.fecha)}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-1">{accion.descripcion}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Por {accion.usuario}</span>
                    </div>

                    {/* Details */}
                    {accion.detalles && Object.keys(accion.detalles).length > 0 && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(accion.detalles).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                              </span>{" "}
                              <span className="text-gray-900 font-medium">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
