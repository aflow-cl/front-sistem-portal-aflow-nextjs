/**
 * Tabla principal de Contratantes
 * Incluye ordenamiento, acciones y estados visuales
 */

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Edit, Trash2, MapPin } from "lucide-react";
import { Contratante, ESTADO_CONFIG, getDisplayName } from "../../types/maestroNegocio";
import { SortField, SortDirection } from "../hooks/useContratantes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContratantesTableProps {
  contratantes: Contratante[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (contratante: Contratante) => void;
  onDelete: (contratante: Contratante) => void;
  onViewDirecciones: (contratante: Contratante) => void;
  isLoading?: boolean;
}

export function ContratantesTable({
  contratantes,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onViewDirecciones,
  isLoading = false,
}: ContratantesTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-[#244F82]" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-[#244F82]" />
    );
  };

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-8 font-semibold hover:bg-gray-100"
      >
        {children}
        {getSortIcon(field)}
      </Button>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#244F82]"></div>
          <span className="ml-3 text-gray-600">Cargando contratantes...</span>
        </div>
      </div>
    );
  }

  if (contratantes.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No se encontraron contratantes
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            No hay contratantes que coincidan con los filtros aplicados. Intenta ajustar
            los criterios de búsqueda.
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
              <SortableHeader field="nombre">Nombre / Razón Social</SortableHeader>
              <SortableHeader field="rut">RUT</SortableHeader>
              <TableHead>Tipo</TableHead>
              <SortableHeader field="email">Email</SortableHeader>
              <TableHead>Direcciones</TableHead>
              <SortableHeader field="estado">Estado</SortableHeader>
              <TableHead className="text-right sticky right-0 bg-gray-50 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contratantes.map((contratante) => {
              const estadoConfig = ESTADO_CONFIG[contratante.estado];
              const direccionPrincipal = contratante.direcciones.find(
                (d) => d.esPrincipal && d.activa
              );

              return (
                <TableRow
                  key={contratante.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Nombre / Razón Social */}
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-gray-900">{getDisplayName(contratante)}</p>
                      {contratante.tipoPersona === "empresa" && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {contratante.giro}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* RUT */}
                  <TableCell>
                    <span className="font-mono text-sm">{contratante.rut}</span>
                  </TableCell>

                  {/* Tipo */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        contratante.tipoPersona === "persona-natural"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      {contratante.tipoPersona === "persona-natural"
                        ? "Persona Natural"
                        : "Empresa"}
                    </Badge>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-sm text-gray-600">
                    {contratante.email}
                  </TableCell>

                  {/* Direcciones */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDirecciones(contratante)}
                      className="text-[#244F82] hover:text-[#244F82] hover:bg-blue-50"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {contratante.direcciones.filter((d) => d.activa).length}
                      {direccionPrincipal && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({direccionPrincipal.comuna})
                        </span>
                      )}
                    </Button>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge className={estadoConfig.badgeClass}>
                      {estadoConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right sticky right-0 bg-white shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(contratante)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewDirecciones(contratante)}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Ver Direcciones
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(contratante)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {contratante.estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
