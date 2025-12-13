"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import type { TimelineData } from "@/app/portal/hooks/useBudgetAnalytics";

interface TimelineChartProps {
  data: TimelineData[];
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

export function TimelineChart({ data }: TimelineChartProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(0)}M`;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">{label} 2025</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.name === "cantidad" ? "Cantidad" : "Monto Total"}:
              </span>
              <span className="font-medium text-gray-900">
                {entry.name === "cantidad"
                  ? `${entry.value} presupuestos`
                  : `$${(entry.value / 1000000).toFixed(1)}M CLP`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0c3b64" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0c3b64" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          stroke="#d1d5db"
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          stroke="#d1d5db"
          label={{
            value: "Cantidad",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#6b7280", fontSize: 12 },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={formatCurrency}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          stroke="#d1d5db"
          label={{
            value: "Monto (CLP)",
            angle: 90,
            position: "insideRight",
            style: { fill: "#6b7280", fontSize: 12 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "14px" }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              cantidad: "Cantidad de Presupuestos",
              monto: "Monto Total",
            };
            return labels[value] || value;
          }}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="monto"
          fill="url(#colorMonto)"
          stroke="none"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="cantidad"
          stroke="#FF7A00"
          strokeWidth={3}
          dot={{ fill: "#FF7A00", strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="monto"
          stroke="#0c3b64"
          strokeWidth={3}
          dot={{ fill: "#0c3b64", strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
