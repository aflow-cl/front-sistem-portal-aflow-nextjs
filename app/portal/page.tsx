"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBudgetAnalytics } from "./hooks/useBudgetAnalytics";
import { BudgetStatusChart } from "./components/charts/BudgetStatusChart";
import { AmountVsIvaChart } from "./components/charts/AmountVsIvaChart";
import { TimelineChart } from "./components/charts/TimelineChart";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function PortalPage() {
  const { statusDistribution, amountComparison, timeline } = useBudgetAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al Portal AFLOW</p>
      </div>

      {/* Sección Acordeón de Presupuesto con Análisis */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="presupuesto" className="border rounded-lg shadow-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-lg p-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  Presupuesto
                </h2>
                <p className="text-sm text-gray-600 font-normal">
                  Análisis visual y métricas clave
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Gráfico 1: Distribución por Estado */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-100 text-emerald-700 rounded-lg p-2">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">
                      Estados de Presupuesto
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Distribución por estado actual
                  </p>
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
                    <CardTitle className="text-lg">
                      Montos Neto vs IVA
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Comparación por trimestre
                  </p>
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
                    <CardTitle className="text-lg">
                      Evolución en el Tiempo
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Cantidad y montos mensuales
                  </p>
                </CardHeader>
                <CardContent>
                  <TimelineChart data={timeline} />
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
