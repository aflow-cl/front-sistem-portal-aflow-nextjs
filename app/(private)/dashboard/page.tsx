"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Activity,
  FileText,
  DollarSign,
  Shield,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Dashboard Page - Vista principal del portal
 */
export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Cotizaciones Activas",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clientes",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ingresos del Mes",
      value: "$45.2K",
      change: "+23%",
      icon: DollarSign,
      color: "text-aflow-orange",
      bgColor: "bg-orange-100",
    },
    {
      title: "Operaciones Activas",
      value: "18",
      change: "+5%",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Nueva cotización creada",
      description: "COT-2024-001 - Cliente ABC Corp",
      time: "Hace 15 minutos",
      icon: FileText,
    },
    {
      id: 2,
      title: "Cliente registrado",
      description: "XYZ Logistics se unió al sistema",
      time: "Hace 1 hora",
      icon: Users,
    },
    {
      id: 3,
      title: "Operación de guardia completada",
      description: "Guardia nocturna sector norte",
      time: "Hace 2 horas",
      icon: Shield,
    },
    {
      id: 4,
      title: "Operación COMEX iniciada",
      description: "Importación contenedor CN-445",
      time: "Hace 3 horas",
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-aflow-orange to-orange-600 rounded-lg p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">
              Bienvenido, {user?.nombre}
            </h1>
            <p className="text-white/90 text-lg">
              {user?.cargo} - {user?.departamento}
            </p>
            <Badge variant="secondary" className="mt-3 bg-white/20 text-white hover:bg-white/30">
              Rol: {user?.role}
            </Badge>
          </div>
          <LayoutDashboard className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{stat.change}</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accesos directos a funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-aflow-orange hover:bg-orange-50 transition-all group">
                <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-aflow-orange transition-colors" />
                <p className="text-sm font-medium text-center">Nueva Cotización</p>
              </button>
              <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-aflow-orange hover:bg-orange-50 transition-all group">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-aflow-orange transition-colors" />
                <p className="text-sm font-medium text-center">Registrar Cliente</p>
              </button>
              <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-aflow-orange hover:bg-orange-50 transition-all group">
                <Shield className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-aflow-orange transition-colors" />
                <p className="text-sm font-medium text-center">Iniciar Guardia</p>
              </button>
              <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-aflow-orange hover:bg-orange-50 transition-all group">
                <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-aflow-orange transition-colors" />
                <p className="text-sm font-medium text-center">Operación COMEX</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sistema operando correctamente
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Última actualización: {new Date().toLocaleString("es-CL")}
              </p>
            </div>
            <Badge variant="success" className="bg-green-500 text-white">
              En Línea
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
