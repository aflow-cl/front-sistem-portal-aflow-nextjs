import { UseFormReturn } from 'react-hook-form';
import { FileText, CheckCircle2, Download, Building2, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';
import { regionesChile } from '../data/regionesChile';

interface FormItem {
  tipo?: string;
  valor?: number | string;
  cantidad?: number | string;
  utilidad?: number | string;
  esComentario?: boolean;
}

interface ClienteData {
  tipoPersona?: 'persona-natural' | 'empresa';
  rut?: string;
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  giro?: string;
  estado?: 'Activo' | 'Inactivo';
  email?: string;
  celular?: string;
  telefono?: string;
  regionId?: string;
  comuna?: string;
  sucursalNombre?: string;
  calle?: string;
  numero?: string;
  complemento?: string;
  notas?: string;
}

interface ProyectoData {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaTermino?: string;
  responsable?: string;
  tipoTrabajo?: string;
}

interface ResumenFinalProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  folio: string;
}

export function ResumenFinal({ form, folio }: ResumenFinalProps) {
  const formData = form.getValues();
  const clienteData = useMemo(() => (formData.cliente || {}) as ClienteData, [formData.cliente]);
  const proyecto = (formData.proyecto || {}) as ProyectoData;

  // Generate client display name
  const clienteName = useMemo(() => {
    if (clienteData.tipoPersona === 'persona-natural') {
      return `${clienteData.primerNombre || ''} ${clienteData.segundoNombre || ''} ${clienteData.apellidoPaterno || ''} ${clienteData.apellidoMaterno || ''}`.trim();
    }
    return clienteData.razonSocial || 'N/A';
  }, [clienteData]);

  const clienteGiro = useMemo(() => {
    if (clienteData.tipoPersona === 'persona-natural') {
      return 'Persona Natural';
    }
    return clienteData.giro || 'N/A';
  }, [clienteData]);

  // Calculate totals from items
  const totales = useMemo(() => {
    const items = (formData.items || []) as FormItem[];
    
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
  }, [formData.items]);

  // Get region name
  const regionNombre = useMemo(() => {
    const regionId = parseInt(clienteData.regionId || '0');
    const region = regionesChile.find(r => r.id === regionId);
    return region?.nombre || 'N/A';
  }, [clienteData.regionId]);

  // Count items
  const itemCount = useMemo(() => {
    return ((formData.items || []) as FormItem[]).filter((item: FormItem) => !item.esComentario).length;
  }, [formData.items]);

  return (
    <Card className="p-4 md:p-6 rounded-2xl shadow-lg border-gray-200">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Resumen Final del Presupuesto
        </h2>
        <p className="text-sm text-gray-600">
          Presupuesto listo para generar y descargar
        </p>
        <Badge className="mt-2 bg-[#003366] text-white px-3 py-1 text-sm">
          Folio: {folio}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Client Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
            <Building2 className="w-5 h-5 text-[#003366]" />
            Información del Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Tipo</p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteData.tipoPersona === 'persona-natural' ? 'Persona Natural' : 'Empresa'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">RUT</p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteData.rut || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">
                {clienteData.tipoPersona === 'persona-natural' ? 'Nombre Completo' : 'Razón Social'}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Giro</p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteGiro}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteData.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Estado</p>
              <Badge className={`${clienteData.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
                {clienteData.estado || 'N/A'}
              </Badge>
            </div>            
            {/* Sucursal Information */}
            {clienteData.sucursalNombre && (
              <div className="md:col-span-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="flex items-center gap-2 text-xs text-blue-700 mb-2 font-semibold">
                  <MapPin className="w-4 h-4" />
                  Sucursal
                </p>
                <p className="text-sm font-bold text-blue-900 mb-2">
                  {clienteData.sucursalNombre}
                </p>
                <p className="text-xs text-gray-700">
                  {clienteData.calle && clienteData.numero
                    ? `${clienteData.calle} ${clienteData.numero}${clienteData.complemento ? `, ${clienteData.complemento}` : ''}`
                    : 'Dirección no disponible'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {clienteData.comuna || 'N/A'}, {regionNombre}
                </p>
              </div>
            )}
                        <div>
              <p className="text-xs text-gray-600 mb-1">Región</p>
              <p className="text-sm font-semibold text-gray-900">
                {regionNombre}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Comuna</p>
              <p className="text-sm font-semibold text-gray-900">
                {clienteData.comuna || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
            <Calendar className="w-5 h-5 text-[#003366]" />
            Información del Proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-xs text-gray-600 mb-1">Nombre del Proyecto</p>
              <p className="text-base font-bold text-gray-900">
                {proyecto.nombre || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Tipo de Trabajo</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {proyecto.tipoTrabajo || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Responsable</p>
              <p className="text-sm font-semibold text-gray-900">
                {proyecto.responsable || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Fecha de Inicio</p>
              <p className="text-sm font-semibold text-gray-900">
                {proyecto.fechaInicio
                  ? new Date(proyecto.fechaInicio).toLocaleDateString('es-CL')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Fecha de Término</p>
              <p className="text-sm font-semibold text-gray-900">
                {proyecto.fechaTermino
                  ? new Date(proyecto.fechaTermino).toLocaleDateString('es-CL')
                  : 'N/A'}
              </p>
            </div>
            {proyecto.descripcion && (
              <div className="md:col-span-2">
                <p className="text-xs text-gray-600 mb-1">Descripción</p>
                <p className="text-sm text-gray-700 bg-white rounded-lg p-3">
                  {proyecto.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Budget Summary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
            <DollarSign className="w-5 h-5 text-[#22C55E]" />
            Resumen Financiero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Total de Ítems</p>
              <p className="text-2xl font-bold text-gray-900">{itemCount}</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Utilidad Promedio</p>
              <p className="text-2xl font-bold text-[#22C55E]">
                {totales.utilidadPromedio.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-gray-700">Valor Neto</span>
              <span className="text-base font-bold text-gray-900">
                ${totales.valorNeto.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium text-gray-700">IVA (19%)</span>
              <span className="text-base font-bold text-gray-900">
                ${totales.iva.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#003366] to-[#00AEEF] rounded-lg shadow-lg">
              <span className="text-base font-bold text-white">Total Final</span>
              <span className="text-xl font-bold text-white">
                ${totales.total.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Document Icon */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-2">
            <FileText className="w-8 h-8 text-[#003366]" />
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Documento generado el {new Date().toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-500">
            Haga clic en &quot;Finalizar y Descargar PDF&quot; para completar el proceso
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Download className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                Importante
              </h4>
              <p className="text-xs text-yellow-700">
                Al finalizar, se generará un PDF con toda la información del presupuesto.
                Asegúrese de que todos los datos sean correctos antes de continuar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
