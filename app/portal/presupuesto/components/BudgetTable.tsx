import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget } from "@/types/presupuesto";
import { Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetTableProps {
  data: Budget[];
  loading: boolean;
}

const estadoColors: Record<string, string> = {
  "Borrador": "bg-gray-100 text-gray-700",
  "En revisión": "bg-yellow-100 text-yellow-700",
  "En proceso": "bg-blue-100 text-blue-700",
  "Finalizado": "bg-emerald-100 text-emerald-700",
  "Cerrado": "bg-slate-100 text-slate-700",
};

export function BudgetTable({ data, loading }: BudgetTableProps) {
  if (loading) {
    return (
      <Card className="shadow-sm rounded-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Presupuestos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-sm rounded-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-aflow-blue to-blue-700 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Presupuestos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron presupuestos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm rounded-2xl border-none overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-aflow-blue to-blue-700 text-white rounded-t-2xl">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Lista de Presupuestos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Folio
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((budget) => (
                <tr
                  key={budget.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {budget.folio}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{budget.cliente}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(budget.fecha).toLocaleDateString("es-CL")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${budget.monto?.toLocaleString("es-CL") || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                        estadoColors[budget.estado] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {budget.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-aflow-blue hover:text-aflow-blue-light hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
