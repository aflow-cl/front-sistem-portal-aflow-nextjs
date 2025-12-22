/**
 * Componente de filtros para Contratantes
 * Ahora usa el botón de Filtros Avanzados en lugar de barra inline
 */

import { AdvancedFiltersSheet } from "./AdvancedFiltersSheet";
import { ContratanteFilters } from "../../types/maestroNegocio";
import { SortField, SortDirection } from "../hooks/useContratantes";

interface FiltersProps {
  filters: ContratanteFilters;
  sortField: SortField;
  sortDirection: SortDirection;
  onFilterChange: (filters: ContratanteFilters) => void;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function Filters({
  filters,
  sortField,
  sortDirection,
  onFilterChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: FiltersProps) {
  const handleApplyFilters = (
    newFilters: ContratanteFilters,
    newSortField: SortField,
    newSortDirection: SortDirection
  ) => {
    onFilterChange(newFilters);
    onSortChange(newSortField, newSortDirection);
  };

  return (
    <div className="flex justify-end">
      <AdvancedFiltersSheet
        filters={filters}
        sortField={sortField}
        sortDirection={sortDirection}
        onApplyFilters={handleApplyFilters}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}
