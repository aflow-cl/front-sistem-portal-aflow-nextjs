"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndicatorData } from "@/types/presupuesto";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface IndicatorsProps {
  data: IndicatorData[];
  onFilterByStatus?: (estados: string | string[]) => void;
}

export function Indicators({ data, onFilterByStatus }: IndicatorsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData | null>(null);

  const handleIndicatorClick = (indicator: IndicatorData) => {
    setSelectedIndicator(indicator);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (onFilterByStatus && selectedIndicator) {
      // If indicator has specific estados, use them; otherwise use the label
      const filterValue = selectedIndicator.estados || selectedIndicator.label;
      onFilterByStatus(filterValue);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {data.map((indicator, index) => (
          <Card
            key={index}
            onClick={() => handleIndicatorClick(indicator)}
            className="shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.12),0_16px_32px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-xl border border-gray-100/50 hover:-translate-y-2 bg-white cursor-pointer active:scale-95"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-gray-600">
                {indicator.label}
              </CardTitle>
              <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", indicator.color)} />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-1">
              <div className="text-2xl font-bold text-gray-900">
                {indicator.value}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 text-emerald-600" />
                {indicator.description || `Presupuestos ${indicator.label.toLowerCase()}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filtrar presupuestos</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIndicator?.estados && selectedIndicator.estados.length > 1 ? (
                <>
                  ¿Desea filtrar los presupuestos del grupo &quot;{selectedIndicator.label}&quot;?
                  <span className="block text-xs mt-2 text-gray-500">
                    Estados: {selectedIndicator.estados.join(", ")}
                  </span>
                </>
              ) : (
                `¿Desea mostrar únicamente los presupuestos con estado "${selectedIndicator?.label}"?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-[#244F82] hover:bg-[#1a3a5f]">
              Sí, filtrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
