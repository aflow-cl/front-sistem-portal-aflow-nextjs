"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreVertical,
  Eye,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Budget, SortField, SortDirection } from "@/types/presupuesto";

interface BudgetTableEnhancedProps {
  data: Budget[];
  loading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const estadoConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  "Borrador": {
    label: "Borrador",
    variant: "outline",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-300",
  },
  "En revisión": {
    label: "En revisión",
    variant: "outline",
    className: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-300",
  },
  "En proceso": {
    label: "En proceso",
    variant: "outline",
    className: "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-300",
  },
  "Pendiente": {
    label: "Pendiente",
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300",
  },
  "Aprobado": {
    label: "Aprobado",
    variant: "default",
    className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-300",
  },
  "Rechazado": {
    label: "Rechazado",
    variant: "destructive",
    className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-300",
  },
  "Finalizado": {
    label: "Finalizado",
    variant: "default",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300",
  },
  "Cerrado": {
    label: "Cerrado",
    variant: "outline",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-300",
  },
};

export function BudgetTableEnhanced({
  data,
  loading,
  sortField,
  sortDirection,
  onSort,
}: BudgetTableEnhancedProps) {
  const router = useRouter();
  const [documentDialog, setDocumentDialog] = useState<{ open: boolean; budget: Budget | null }>({
    open: false,
    budget: null,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = (budget: Budget) => {
    toast.info(`Editando cotización ${budget.folio}`);
    router.push(`/portal/presupuesto/editar/${budget.id}`);
  };

  const handleRowClick = (budget: Budget) => {
    router.push(`/portal/presupuesto/editar/${budget.id}`);
  };

  const handleViewDocument = (budget: Budget) => {
    setDocumentDialog({ open: true, budget });
  };

  const handleDownload = (budget: Budget) => {
    toast.success(`Descargando documento ${budget.folio}.pdf`);
    // Simular descarga - implementar llamada a API
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 ml-1 text-[#244F82]" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 ml-1 text-[#244F82]" />
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-[#244F82] flex items-center"
    >
      {children}
      {getSortIcon(field)}
    </Button>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#244F82] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Cargando cotizaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron cotizaciones
            </h3>
            <p className="text-sm text-gray-600">
              Intenta ajustar los filtros o crea una nueva cotización
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Contenedor con scroll horizontal para móvil */}
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="folio">Folio</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="cliente">Cliente</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="fecha">Fecha</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right whitespace-nowrap">
                    <SortableHeader field="monto">Monto</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right whitespace-nowrap">
                    <SortableHeader field="neto">Neto</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="estado">Estado</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="autor">Autor</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                    <SortableHeader field="fechaCierre">Fecha Cierre</SortableHeader>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((budget) => (
                  <TableRow
                    key={budget.id}
                    onClick={() => handleRowClick(budget)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium text-[#244F82] whitespace-nowrap">
                      {budget.folio}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="max-w-xs truncate">{budget.cliente}</div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                      {formatDate(budget.fecha)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrency(budget.monto || 0)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 whitespace-nowrap">
                      {formatCurrency(budget.neto || 0)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant={estadoConfig[budget.estado]?.variant || "outline"}
                        className={estadoConfig[budget.estado]?.className}
                      >
                        {estadoConfig[budget.estado]?.label || budget.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm whitespace-nowrap">
                      {budget.autor || "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                      {budget.fechaCierre ? formatDate(budget.fechaCierre) : "-"}
                    </TableCell>
                    <TableCell 
                      className="text-right sticky right-0 bg-white shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)] hover:bg-gray-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs text-gray-500">
                            Acciones
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(budget);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2 text-blue-600" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(budget);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2 text-green-600" />
                            Ver Documento
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(budget);
                            }}
                            className="cursor-pointer"
                          >
                            <Download className="h-4 w-4 mr-2 text-gray-600" />
                            Descargar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog
        open={documentDialog.open}
        onOpenChange={(open) => setDocumentDialog({ open, budget: null })}
      >
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {documentDialog.budget?.folio} - {documentDialog.budget?.cliente}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full p-6">
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <Eye className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visor de Documentos
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Vista previa del documento:{" "}
                <span className="font-medium text-[#244F82]">
                  {documentDialog.budget?.documentoUrl}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                En producción, aquí se mostraría el PDF o iframe del documento
              </p>
              <div className="mt-8 p-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 italic">
                  Simulación de visor de PDF/Documento
                </p>
                <div className="mt-4 space-y-2 text-left">
                  <p className="text-sm"><span className="font-medium">Folio:</span> {documentDialog.budget?.folio}</p>
                  <p className="text-sm"><span className="font-medium">Cliente:</span> {documentDialog.budget?.cliente}</p>
                  <p className="text-sm"><span className="font-medium">Monto:</span> {documentDialog.budget?.monto ? formatCurrency(documentDialog.budget.monto) : '-'}</p>
                  <p className="text-sm"><span className="font-medium">Estado:</span> {documentDialog.budget?.estado}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
