"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetAnalytics } from "./hooks/useBudgetAnalytics";
import { BudgetStatusChart } from "./components/charts/BudgetStatusChart";
import { AmountVsIvaChart } from "./components/charts/AmountVsIvaChart";
import { TimelineChart } from "./components/charts/TimelineChart";
import { TrendingUp, DollarSign, Calendar, FileText, CheckCircle, Percent } from "lucide-react";
import { Suspense } from "react";

function DashboardContent() {
  const { statusDistribution, amountComparison, timeline, kpiMetrics } = useBudgetAnalytics();

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al Portal AFLOW</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Presupuestos</p>
                <p className="text-3xl font-bold text-blue-900">{kpiMetrics.totalBudgets}</p>
                <p className="text-xs text-blue-600 mt-1">Período actual</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Tasa de Aprobación</p>
                <p className="text-3xl font-bold text-green-900">{kpiMetrics.approvalRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">Presupuestos aprobados</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Promedio por Presupuesto</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(kpiMetrics.averageAmount)}</p>
                <p className="text-xs text-orange-600 mt-1">Monto promedio</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Percent className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Monto Total Período</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(kpiMetrics.periodTotal)}</p>
                <p className="text-xs text-purple-600 mt-1">Ingresos totales</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Always Visible */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-lg p-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Análisis de Presupuestos</h2>
            <p className="text-sm text-gray-600">Métricas visuales y tendencias clave</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Gráfico 1: Distribución por Estado */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 text-emerald-700 rounded-lg p-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Estados de Presupuesto</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Distribución por estado actual</p>
            </CardHeader>
            <CardContent>
              <BudgetStatusChart data={statusDistribution} />
            </CardContent>
          </Card>

          {/* Gráfico 2: Montos vs IVA */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-lg p-2">
                  <DollarSign className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Montos Neto vs IVA</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Comparación por trimestre</p>
            </CardHeader>
            <CardContent>
              <AmountVsIvaChart data={amountComparison} />
            </CardContent>
          </Card>

          {/* Gráfico 3: Evolución Temporal */}
          <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 text-orange-700 rounded-lg p-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Evolución en el Tiempo</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Cantidad y montos mensuales</p>
            </CardHeader>
            <CardContent>
              <TimelineChart data={timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
