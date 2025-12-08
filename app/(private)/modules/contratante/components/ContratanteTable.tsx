"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Contratante, ContratanteFilters } from "../types/contratante";
import { formatRut, debounce } from "@/lib/utils";

interface ContratanteTableProps {
  contratantes: Contratante[];
  onEdit: (contratante: Contratante) => void;
  onDelete: (contratante: Contratante) => void;
  loading?: boolean;
}

/**
 * Tabla de contratantes con filtros
 */
export function ContratanteTable({
  contratantes,
  onEdit,
  onDelete,
  loading = false,
}: ContratanteTableProps) {
  const [filters, setFilters] = useState<ContratanteFilters>({
    search: "",
    tipo: "all",
    activo: "all",
  });

  // Filtrar contratantes
  const filteredContratantes = contratantes.filter((c) => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchText = `${c.nombreCompleto || c.razonSocial} ${c.rut} ${c.correo}`.toLowerCase();
      if (!searchText.includes(searchLower)) return false;
    }

    // Filtro de tipo
    if (filters.tipo !== "all" && c.tipo !== filters.tipo) return false;

    // Filtro de estado
    if (filters.activo !== "all" && c.activo !== filters.activo) return false;

    return true;
  });

  const handleSearchChange = debounce((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 300);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RUT o correo..."
            className="pl-10"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro Tipo */}
        <Select
          value={filters.tipo}
          onValueChange={(value: any) =>
            setFilters((prev) => ({ ...prev, tipo: value }))
          }
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="natural">Persona Natural</SelectItem>
            <SelectItem value="juridica">Persona Jurídica</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro Estado */}
        <Select
          value={String(filters.activo)}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              activo: value === "all" ? "all" : value === "true",
            }))
          }
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="true">Activo</SelectItem>
            <SelectItem value="false">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nombre / Razón Social</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-aflow-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredContratantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron contratantes
                </TableCell>
              </TableRow>
            ) : (
              filteredContratantes.map((contratante) => (
                <TableRow key={contratante.id}>
                  <TableCell>
                    <Badge variant={contratante.tipo === "natural" ? "default" : "secondary"}>
                      {contratante.tipo === "natural" ? "Natural" : "Jurídica"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {contratante.nombreCompleto || contratante.razonSocial}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatRut(contratante.rut)}
                  </TableCell>
                  <TableCell className="text-sm">{contratante.correo}</TableCell>
                  <TableCell className="text-sm">{contratante.telefono}</TableCell>
                  <TableCell>
                    <Badge variant={contratante.activo ? "success" : "outline"}>
                      {contratante.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(contratante)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(contratante)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contador */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredContratantes.length} de {contratantes.length} contratantes
      </div>
    </div>
  );
}
