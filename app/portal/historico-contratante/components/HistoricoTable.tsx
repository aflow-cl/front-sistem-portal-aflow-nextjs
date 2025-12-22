/**
 * Componente de tabla mejorada para histórico de presupuestos
 */

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Package } from "lucide-react";
import {
  PresupuestoHistorico,
  ESTADO_PRESUPUESTO_CONFIG,
  formatCurrency,
  formatDate,
} from "../types/historico";
import { PresupuestoActions } from "./PresupuestoActions";

interface HistoricoTableProps {
  presupuestos: PresupuestoHistorico[];
  isLoading?: boolean;
  onViewDetails?: (presupuesto: PresupuestoHistorico) => void;
}

export const HistoricoTable = ({
  presupuestos,
  isLoading = false,
  onViewDetails,
}: HistoricoTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#244F82]"></div>
          <span className="ml-3 text-gray-600">Cargando histórico...</span>
        </div>
      </div>
    );
  }

  if (presupuestos.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            No se encontraron presupuestos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            No hay presupuestos que coincidan con los filtros aplicados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Folio</TableHead>
              <TableHead className="font-semibold">Contratante</TableHead>
              <TableHead className="font-semibold">Fecha Inicio</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">Neto</TableHead>
              <TableHead className="font-semibold text-right">IVA</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold text-center">Ver</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presupuestos.map((presupuesto) => {
              const estadoConfig = ESTADO_PRESUPUESTO_CONFIG[presupuesto.estado];

              return (
                <TableRow
                  key={presupuesto.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Folio */}
                  <TableCell className="font-mono font-medium text-[#244F82]">
                    {presupuesto.folio}
                  </TableCell>

                  {/* Contratante */}
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {presupuesto.contratante.nombre}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {presupuesto.contratante.rut}
                      </p>
                    </div>
                  </TableCell>

                  {/* Fecha Inicio */}
                  <TableCell className="text-sm text-gray-700">
                    {formatDate(presupuesto.fechaInicio)}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge variant="outline" className={estadoConfig.badgeClass}>
                      {estadoConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Neto */}
                  <TableCell className="text-right font-medium text-gray-900">
                    {formatCurrency(presupuesto.neto)}
                  </TableCell>

                  {/* IVA */}
                  <TableCell className="text-right font-medium text-gray-700">
                    {formatCurrency(presupuesto.iva)}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right">
                    <span className="font-bold text-[#244F82]">
                      {formatCurrency(presupuesto.total)}
                    </span>
                  </TableCell>

                  {/* Botón Ver */}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(presupuesto)}
                      className="text-[#244F82] hover:bg-blue-50 hover:text-[#244F82]"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right">
                    <PresupuestoActions
                      presupuesto={presupuesto}
                      onView={onViewDetails}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
