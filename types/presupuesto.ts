export interface Budget {
  id: string;
  folio: string;
  cliente: string;
  fecha: string;
  estado: "Borrador" | "En revisión" | "En proceso" | "Finalizado" | "Cerrado";
  monto?: number;
  descripcion?: string;
}

export interface IndicatorData {
  label: string;
  value: number;
  color: string;
}

export interface FilterState {
  cliente: string;
  estado: string;
  fecha: string;
}

export interface CreateBudgetInput {
  cliente: string;
  descripcion: string;
  monto: number;
}
