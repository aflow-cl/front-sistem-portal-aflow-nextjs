/**
 * Componente de indicadores estadísticos para histórico de presupuestos
 */

"use client";

import { Card } from "@/components/ui/card";
import {
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { HistoricoStats, formatCurrency } from "../types/historico";

interface IndicatorsProps {
  stats: HistoricoStats;
  isLoading?: boolean;
}

export const Indicators = ({ stats, isLoading = false }: IndicatorsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Presupuestos */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">
              Total Presupuestos
            </p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* Total Neto */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">Total Neto</p>
            <p className="text-lg font-bold text-green-600 truncate">
              {formatCurrency(stats.totalNeto)}
            </p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Total IVA */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">Total IVA</p>
            <p className="text-lg font-bold text-orange-600 truncate">
              {formatCurrency(stats.totalIva)}
            </p>
          </div>
          <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </Card>

      {/* Aprobados */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Aprobados</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.porEstado.Aprobado}
            </p>
          </div>
          <div className="bg-emerald-50 p-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </Card>

      {/* Pendientes */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.porEstado.Pendiente}
            </p>
          </div>
          <div className="bg-yellow-50 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </Card>

      {/* En Proceso */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">En Proceso</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.porEstado["En Proceso"]}
            </p>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};
