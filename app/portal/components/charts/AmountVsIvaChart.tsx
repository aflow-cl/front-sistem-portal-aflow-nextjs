"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AmountComparison } from "@/app/portal/hooks/useBudgetAnalytics";

interface AmountVsIvaChartProps {
  data: AmountComparison[];
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function AmountVsIvaChart({ data }: AmountVsIvaChartProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(0)}M`;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                ${(entry.value / 1000000).toFixed(1)}M CLP
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-gray-900">
                ${((payload[0].value + payload[1].value) / 1000000).toFixed(1)}M CLP
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="category"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          stroke="#d1d5db"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          stroke="#d1d5db"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(156, 163, 175, 0.1)" }} />
        <Legend
          wrapperStyle={{ fontSize: "14px" }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              neto: "Monto Neto",
              iva: "IVA (19%)",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="neto" fill="#0c3b64" radius={[4, 4, 0, 0]} />
        <Bar dataKey="iva" fill="#FF7A00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
