import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndicatorData } from "@/types/presupuesto";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorsProps {
  data: IndicatorData[];
}

export function Indicators({ data }: IndicatorsProps) {
  return (
    <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
      {data.map((indicator, index) => (
        <Card
          key={index}
          className="shadow-sm hover:shadow-md transition-shadow rounded-2xl border-none"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {indicator.label}
            </CardTitle>
            <div className={cn("h-3 w-3 rounded-full", indicator.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              {indicator.value}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              Presupuestos {indicator.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
