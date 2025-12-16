/**
 * Componente de indicadores estadísticos para Contratantes
 * Muestra métricas clave y permite filtrado rápido
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Building2, CheckCircle2, XCircle } from "lucide-react";

interface IndicatorsProps {
  stats: {
    total: number;
    activos: number;
    inactivos: number;
    personasNaturales: number;
    empresas: number;
  };
  activeFilters: {
    estado: string;
  };
  onFilterClick: (filterType: string, value: string) => void;
}

export function Indicators({ stats, activeFilters, onFilterClick }: IndicatorsProps) {
  const indicators = [
    {
      label: "Total Contratantes",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      clickable: false,
    },
    {
      label: "Activos",
      value: stats.activos,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      clickable: true,
      filterType: "estado",
      filterValue: "Activo",
      isActive: activeFilters.estado === "Activo",
    },
    {
      label: "Inactivos",
      value: stats.inactivos,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      clickable: true,
      filterType: "estado",
      filterValue: "Inactivo",
      isActive: activeFilters.estado === "Inactivo",
    },
    {
      label: "Personas Naturales",
      value: stats.personasNaturales,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      clickable: true,
      filterType: "tipoPersona",
      filterValue: "persona-natural",
      isActive: false, // Se puede agregar lógica si se desea
    },
    {
      label: "Empresas",
      value: stats.empresas,
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      clickable: true,
      filterType: "tipoPersona",
      filterValue: "empresa",
      isActive: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {indicators.map((indicator, index) => {
        const Icon = indicator.icon;
        const isClickable = indicator.clickable;
        const isActive = indicator.isActive;

        return (
          <Card
            key={index}
            className={`
              p-4 transition-all duration-200
              ${isClickable ? "cursor-pointer hover:shadow-md hover:scale-105" : ""}
              ${isActive ? "ring-2 ring-[#244F82] shadow-md" : ""}
            `}
            onClick={() => {
              if (isClickable && indicator.filterType && indicator.filterValue) {
                onFilterClick(indicator.filterType, indicator.filterValue);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {indicator.label}
                </p>
                <p className={`text-2xl font-bold ${indicator.color}`}>
                  {indicator.value}
                </p>
              </div>
              <div className={`${indicator.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${indicator.color}`} />
              </div>
            </div>
            {isActive && (
              <div className="mt-2">
                <Badge className="bg-[#244F82] text-white text-xs">
                  Filtro activo
                </Badge>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
