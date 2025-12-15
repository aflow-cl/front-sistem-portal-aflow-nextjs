import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Calculator, Plus, Trash2, MessageSquare, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useMemo, useState } from 'react';

interface FormItem {
  tipo?: string;
  proveedor?: string;
  producto?: string;
  descripcion?: string;
  unidad?: string;
  cantidad?: number | string;
  valor?: number | string;
  utilidad?: number | string;
  iva?: number | string;
  bruto?: number;
  total?: number;
  esComentario?: boolean;
}

interface PresupuestoTableProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Mock data for providers and products
const PROVEEDORES = [
  { id: '1', nombre: 'Proveedor ABC Ltda.' },
  { id: '2', nombre: 'Constructora XYZ S.A.' },
  { id: '3', nombre: 'Materiales Chile' },
  { id: '4', nombre: 'Servicios Generales' },
  { id: '5', nombre: 'Tech Solutions' },
];

const PRODUCTOS_POR_PROVEEDOR: Record<string, Array<{ id: string; nombre: string }>> = {
  '1': [
    { id: '1-1', nombre: 'Cemento Portland' },
    { id: '1-2', nombre: 'Fierro 8mm' },
    { id: '1-3', nombre: 'Arena Gruesa' },
  ],
  '2': [
    { id: '2-1', nombre: 'Mano de Obra Maestro' },
    { id: '2-2', nombre: 'Mano de Obra Ayudante' },
    { id: '2-3', nombre: 'Equipo Retroexcavadora' },
  ],
  '3': [
    { id: '3-1', nombre: 'Pintura Látex' },
    { id: '3-2', nombre: 'Barniz Marino' },
    { id: '3-3', nombre: 'Adhesivo Cerámico' },
  ],
  '4': [
    { id: '4-1', nombre: 'Servicio de Instalación' },
    { id: '4-2', nombre: 'Servicio de Mantención' },
    { id: '4-3', nombre: 'Asesoría Técnica' },
  ],
  '5': [
    { id: '5-1', nombre: 'Software de Gestión' },
    { id: '5-2', nombre: 'Licencia Anual' },
    { id: '5-3', nombre: 'Soporte Técnico' },
  ],
};

const UNIDADES = [
  { value: 'UN', label: 'Unidad' },
  { value: 'M2', label: 'Metro²' },
  { value: 'M3', label: 'Metro³' },
  { value: 'KG', label: 'Kilogramo' },
  { value: 'LT', label: 'Litro' },
  { value: 'HR', label: 'Hora' },
  { value: 'DIA', label: 'Día' },
  { value: 'MES', label: 'Mes' },
];

export function PresupuestoTable({ form }: PresupuestoTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items' as never,
  });

  const [comentario, setComentario] = useState('');

  const items = form.watch('items') as FormItem[] | undefined;

  // Calculate totals for each item when values change
  useEffect(() => {
    items?.forEach((item: FormItem, index: number) => {
      if (item.valor && item.cantidad) {
        const valorUnitario = parseFloat(String(item.valor)) || 0;
        const cantidad = parseFloat(String(item.cantidad)) || 0;
        const utilidadPct = parseFloat(String(item.utilidad)) || 0;
        const ivaPct = parseFloat(String(item.iva)) || 19;

        // Calculate base value (valor unitario * cantidad)
        const valorBase = valorUnitario * cantidad;

        // Add utility
        const valorConUtilidad = valorBase * (1 + utilidadPct / 100);

        // Calculate IVA
        const valorIva = valorConUtilidad * (ivaPct / 100);

        // Total with IVA
        const total = valorConUtilidad + valorIva;

        // Calculate bruto (neto + IVA, without utility in the IVA calculation)
        const bruto = valorBase + (valorBase * ivaPct / 100);

        // Update calculated fields
        if (item.bruto !== bruto) {
          form.setValue(`items.${index}.bruto` as never, bruto as never, { shouldValidate: false });
        }
        if (item.total !== total) {
          form.setValue(`items.${index}.total` as never, total as never, { shouldValidate: false });
        }
      }
    });
  }, [items, form]);

  // Calculate summary totals
  const totales = useMemo(() => {
    if (!items || items.length === 0) {
      return { valorNeto: 0, iva: 0, total: 0, utilidadPromedio: 0 };
    }

    let valorNeto = 0;
    let totalUtilidad = 0;
    let countUtilidad = 0;

    items.forEach((item: FormItem) => {
      if (item.tipo === 'item' && !item.esComentario) {
        const valorUnitario = parseFloat(String(item.valor)) || 0;
        const cantidad = parseFloat(String(item.cantidad)) || 0;
        const utilidadPct = parseFloat(String(item.utilidad)) || 0;

        const valorBase = valorUnitario * cantidad;
        valorNeto += valorBase;

        if (utilidadPct > 0) {
          totalUtilidad += utilidadPct;
          countUtilidad++;
        }
      }
    });

    const iva = valorNeto * 0.19;
    const total = valorNeto + iva;
    const utilidadPromedio = countUtilidad > 0 ? totalUtilidad / countUtilidad : 0;

    return {
      valorNeto,
      iva,
      total,
      utilidadPromedio,
    };
  }, [items]);

  const handleAddItem = () => {
    append({
      tipo: 'item',
      proveedor: '',
      producto: '',
      descripcion: '',
      unidad: 'UN',
      cantidad: 1,
      valor: 0,
      utilidad: 0,
      iva: 19,
      bruto: 0,
      total: 0,
      esComentario: false,
    });
  };

  const handleAddComentario = () => {
    if (comentario.trim()) {
      append({
        tipo: 'comentario',
        descripcion: comentario,
        esComentario: true,
      });
      setComentario('');
    }
  };

  return (
    <Card className="p-4 md:p-6 rounded-2xl shadow-lg border-gray-200">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Módulo de Presupuesto
            </h2>
            <p className="text-xs text-gray-600">
              Agregue ítems, proveedores, productos y valores
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Add Item Form */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
            <Package className="w-4 h-4 text-[#003366]" />
            Agregar Nuevo Ítem
          </h3>
          <Button
            type="button"
            onClick={handleAddItem}
            className="w-full md:w-auto bg-[#22C55E] hover:bg-[#16A34A] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Ítem
          </Button>
        </div>

        {/* Items Table */}
        {fields.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">#</TableHead>
                    <TableHead className="font-semibold">Proveedor</TableHead>
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold">UND</TableHead>
                    <TableHead className="font-semibold">Cant.</TableHead>
                    <TableHead className="font-semibold">V. Unitario</TableHead>
                    <TableHead className="font-semibold">V. Neto</TableHead>
                    <TableHead className="font-semibold">IVA %</TableHead>
                    <TableHead className="font-semibold">Bruto</TableHead>
                    <TableHead className="font-semibold">Utilidad %</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const item = items?.[index];
                    
                    // Render comment row
                    if (item?.esComentario) {
                      return (
                        <TableRow key={field.id} className="bg-yellow-50">
                          <TableCell colSpan={11}>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm italic text-gray-700">
                                {item.descripcion}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // Render item row
                    const valorNeto = (parseFloat(String(item?.valor || 0)) || 0) * (parseFloat(String(item?.cantidad || 0)) || 0);

                    return (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="min-w-[180px]">
                          <FormField
                            control={form.control}
                            name={`items.${index}.proveedor`}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Reset product when provider changes
                                  form.setValue(`items.${index}.producto` as never, '' as never);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROVEEDORES.map((prov) => (
                                    <SelectItem key={prov.id} value={prov.id}>
                                      {prov.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <FormField
                            control={form.control}
                            name={`items.${index}.producto`}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!item?.proveedor}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(PRODUCTOS_POR_PROVEEDOR[item?.proveedor || ''] || []).map((prod) => (
                                    <SelectItem key={prod.id} value={prod.id}>
                                      {prod.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unidad`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {UNIDADES.map((unidad) => (
                                    <SelectItem key={unidad.value} value={unidad.value}>
                                      {unidad.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.cantidad`}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                className="h-9 w-20 text-sm"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.valor`}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                className="h-9 w-28 text-sm"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          ${valorNeto.toLocaleString('es-CL')}
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.iva`}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                {...field}
                                className="h-9 w-16 text-sm"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          ${(item?.bruto || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.utilidad`}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                {...field}
                                className="h-9 w-16 text-sm"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-bold text-[#003366]">
                          ${(item?.total || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Summary Totals */}
        {fields.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Resumen de Totales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Valor Neto</p>
                <p className="text-lg font-bold text-gray-900">
                  ${totales.valorNeto.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">IVA (19%)</p>
                <p className="text-lg font-bold text-gray-900">
                  ${totales.iva.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-lg font-bold text-[#003366]">
                  ${totales.total.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Utilidad Promedio</p>
                <p className="text-lg font-bold text-[#22C55E]">
                  {totales.utilidadPromedio.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Comment */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <MessageSquare className="w-4 h-4 text-[#003366]" />
            Agregar Comentario / Observación
          </h3>
          <div className="flex gap-2">
            <Textarea
              placeholder="Escriba un comentario o nota adicional..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={2}
              className="flex-1 ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg resize-none text-sm"
            />
            <Button
              type="button"
              onClick={handleAddComentario}
              disabled={!comentario.trim()}
              className="bg-[#003366] hover:bg-[#00AEEF] text-white h-auto"
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No hay ítems agregados
            </h3>
            <p className="text-sm text-gray-500">
              Comience agregando ítems al presupuesto usando el botón superior
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
