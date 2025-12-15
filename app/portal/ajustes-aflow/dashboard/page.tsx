"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  Package,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchDashboardStats,
  fetchActividadReciente,
} from "../api/ajustesService";

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: actividades, isLoading: loadingActividades } = useQuery({
    queryKey: ["actividad-reciente"],
    queryFn: fetchActividadReciente,
  });

  if (loadingStats || loadingActividades) {
    return <DashboardSkeleton />;
  }

  const metricas = [
    {
      titulo: "Total Clientes",
      valor: stats?.totalClientes || 0,
      subtitulo: `${stats?.clientesActivos || 0} activos`,
      icono: Users,
      gradiente: "from-blue-500 to-blue-600",
      porcentaje: stats?.totalClientes
        ? Math.round(
            ((stats.clientesActivos || 0) / stats.totalClientes) * 100
          )
        : 0,
    },
    {
      titulo: "Usuarios Sistema",
      valor: stats?.totalUsuarios || 0,
      subtitulo: `${stats?.usuariosActivos || 0} activos`,
      icono: UserCheck,
      gradiente: "from-green-500 to-green-600",
      porcentaje: stats?.totalUsuarios
        ? Math.round(
            ((stats.usuariosActivos || 0) / stats.totalUsuarios) * 100
          )
        : 0,
    },
    {
      titulo: "Servicios",
      valor: stats?.totalServicios || 0,
      subtitulo: `${stats?.serviciosActivos || 0} activos`,
      icono: Package,
      gradiente: "from-orange-500 to-orange-600",
      porcentaje: stats?.totalServicios
        ? Math.round(
            ((stats.serviciosActivos || 0) / stats.totalServicios) * 100
          )
        : 0,
    },
    {
      titulo: "Perfiles Configurados",
      valor: stats?.totalPerfiles || 0,
      subtitulo: "Roles del sistema",
      icono: Shield,
      gradiente: "from-purple-500 to-purple-600",
      porcentaje: 100,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAccionColor = (
    accion: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (accion) {
      case "Creado":
        return "default";
      case "Activado":
        return "default";
      case "Editado":
        return "secondary";
      case "Desactivado":
        return "outline";
      case "Eliminado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "cliente":
        return Users;
      case "usuario":
        return UserCheck;
      case "servicio":
        return Package;
      case "perfil":
        return Shield;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica, index) => {
          const Icon = metrica.icono;
          return (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {metrica.titulo}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {metrica.valor}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {metrica.subtitulo}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metrica.gradiente} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${metrica.gradiente} transition-all duration-500`}
                      style={{ width: `${metrica.porcentaje}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {metrica.porcentaje}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Card de Ingresos Recurrentes */}
      <Card className="bg-gradient-to-br from-[#244F82] to-[#0c3b64] text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 mb-1">
                Ingresos Recurrentes Mensuales
              </p>
              <h3 className="text-4xl font-bold mb-2">
                {formatCurrency(stats?.ingresosRecurrentes || 0)}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-green-300 font-medium">+12.5%</span>
                <span className="text-blue-200">vs mes anterior</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#244F82]" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actividades && actividades.length > 0 ? (
              actividades.map((actividad) => {
                const TipoIcon = getTipoIcon(actividad.tipo);
                return (
                  <div
                    key={actividad.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <TipoIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {actividad.descripcion}
                        </p>
                        <Badge
                          variant={getAccionColor(actividad.accion)}
                          className="flex-shrink-0"
                        >
                          {actividad.accion}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{actividad.usuario}</span>
                        <span>•</span>
                        <span>{formatDate(actividad.fecha)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cards informativos adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Sistema Operativo
                </p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500 mt-1">
                  Todos los servicios funcionando correctamente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Nuevos Clientes (30d)
                </p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500 mt-1">
                  +3 respecto al mes anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Servicios Contratados
                </p>
                <p className="text-2xl font-bold text-gray-900">124</p>
                <p className="text-xs text-gray-500 mt-1">
                  Distribución entre {stats?.totalClientes || 0} clientes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
