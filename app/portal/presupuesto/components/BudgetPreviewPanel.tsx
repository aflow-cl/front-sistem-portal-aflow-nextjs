"use client";

import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ClienteInfo } from '@/types/presupuesto';
import { useBudgetSettings } from '../context/BudgetSettingsContext';
import { useBudgetCalculations } from '../hooks/useBudgetFormState';
import { formatCurrency } from '@/lib/utils';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

interface FormDataType {
  folio?: string;
  cliente?: Partial<ClienteInfo>;
  proyecto?: { [key: string]: unknown };
  items?: Array<Record<string, unknown>>;
}
interface BudgetPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormDataType;
  // visualizationType: VisualizationType;
  // onVisualizationChange: (type: VisualizationType) => void;
}

export function BudgetPreviewPanel({
  isOpen,
  onClose,
  formData,
}: BudgetPreviewPanelProps) {
  const { settings } = useBudgetSettings();
  const totals = useBudgetCalculations(formData?.items || []);
  const cliente: Partial<ClienteInfo> = formData?.cliente || {};
  const proyecto = formData?.proyecto || {};
  const items = formData?.items || [];
  // const fontSizeClass = {
  //   'Pequeña': 'text-xs',
  //   'Normal': 'text-sm',
  //   'Grande': 'text-base',
  // }[settings.tamanoLetra] || 'text-sm';
  const logoSize = `${settings.tamanoLogo}px`;
  // const folioClasses = {
  //   'Simple': 'text-lg font-semibold',
  //   'Destacado': 'text-2xl font-bold tracking-wide',
  //   'Sombra': 'text-2xl font-bold drop-shadow-lg',
  // }[settings.folioEstilo] || 'text-lg font-semibold';
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (previewRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Presupuesto_${formData?.folio || '000000'}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        })
        .from(previewRef.current)
        .save()
        .then(() => {
          toast.success('PDF descargado correctamente');
        });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-[80vw] max-w-[80vw] min-w-[80vw] overflow-y-auto p-0"
        style={{ width: '80vw', maxWidth: '80vw', minWidth: '80vw' }}
      >
        <SheetHeader>
          <SheetTitle>Previsualización de Presupuesto</SheetTitle>
        </SheetHeader>
        {/* Barra superior sticky solo en pantalla */}
        <div className="sticky top-0 z-30 w-full bg-[#244F82] flex items-center justify-between px-3 py-2 shadow-md no-print">
          <span className="text-white font-semibold text-base sm:text-lg">Previsualización de Presupuesto</span>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white text-[#244F82] font-semibold px-3 py-1.5 rounded transition-all duration-200 hover:bg-orange-100 hover:text-orange-600 active:scale-95 shadow group text-xs sm:text-sm"
            style={{ minWidth: 0 }}
          >
            <Download className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors duration-200" />
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>
        </div>
        {/* Contenido previsualización compacto y fondo blanco */}
        <div
          ref={previewRef}
          className="bg-white max-w-[800px] mx-auto p-2 sm:p-4 text-xs sm:text-sm print:p-2 print:max-w-[800px] print:bg-white"
          style={{ fontFamily: settings.tipoLetra, width: '100%' }}
        >
          {/* Encabezado formal */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-2 mb-2">
            {/* Logo y datos empresa */}
            <div className="flex gap-2 items-center w-2/3">
              {settings.logoPrincipal && (
                <div className="flex items-center justify-center h-full" style={{ minWidth: '60px', height: logoSize }}>
                  <Image
                    src={settings.logoPrincipal}
                    alt="Logo Empresa"
                    width={120}
                    height={parseInt(logoSize)}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="space-y-0.5 flex-1">
                <div className="text-base font-bold text-gray-900">{settings.nombreEmpresa ?? 'Nombre Empresa'}</div>
                <div className="text-xs text-gray-700">Ejecutivo: {settings.ejecutivo ?? '-'}</div>
                <div className="text-xs text-gray-700">Correo: {settings.emailEjecutivo ?? '-'}</div>
                <div className="text-xs text-gray-700">Teléfono: {settings.telefonoEjecutivo ?? '-'}</div>
                <div className="text-xs text-gray-700">Rubro: {settings.rubro ?? '-'}</div>
                <div className="text-xs text-gray-700">RUT: {settings.rutEmpresa ?? '-'}</div>
                <div className="text-xs text-gray-700">Sitio web: {settings.sitioWeb ?? '-'}</div>
              </div>
            </div>
            {/* Cotización y fecha */}
            <div className="flex flex-col items-center w-1/3">
              <div className="border border-gray-300 rounded bg-white w-full flex flex-col items-center p-2">
                <div className="text-xs font-semibold text-gray-700 mb-1">N° COTIZACIÓN</div>
                <div className="text-base font-bold text-gray-900 mb-1 w-full text-center">{settings.folioOperativo}-{formData?.folio || '000000'}</div>
              </div>
              <div className="border border-gray-300 rounded-b bg-white w-full mt-1 px-1 py-0.5 text-center">
                <span className="text-xs text-gray-700">Fecha: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="border border-gray-200 rounded-lg p-2 mb-2 bg-white">
            <div className="text-sm font-semibold text-gray-900 mb-2">Datos del Cliente</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 min-w-[120px]">Empresa Cliente:</span>
                <span className="font-medium text-gray-800 text-[11px]">{String(cliente.razonSocial ?? '-')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 min-w-[120px]">RUT Cliente:</span>
                <span className="font-medium text-gray-800 text-[11px]">{String(cliente.rut ?? '-')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 min-w-[120px]">Dirección:</span>
                <span className="font-medium text-gray-800 text-[11px]">{[cliente.calle, cliente.numero, cliente.complemento, cliente.comuna].filter(Boolean).join(', ') || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 min-w-[120px]">Nombre de Contacto:</span>
                <span className="font-medium text-gray-800 text-[11px]">{String(cliente.primerNombre ?? cliente.nombreContacto ?? '-')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 min-w-[120px]">Correo de Contacto:</span>
                <span className="font-medium text-gray-800 text-[11px]">{String(cliente.email ?? '-')}</span>
              </div>
            </div>
          </div>

          {/* Detalle de Servicios/Productos */}
          <div className="mb-2">
            <div className="text-sm font-semibold text-gray-900 mb-2">Detalle de Servicios / Productos</div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-xs">
                <thead className="bg-blue-900">
                  <tr className="text-white">
                    <th className="px-1 py-0.5 text-left">N°</th>
                    <th className="px-1 py-0.5 text-left">Servicio / Producto</th>
                    <th className="px-1 py-0.5 text-left">Descripción</th>
                    <th className="px-1 py-0.5 text-right">Cantidad</th>
                    <th className="px-1 py-0.5 text-right">Valor Unitario</th>
                    <th className="px-1 py-0.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">No hay ítems agregados</td>
                    </tr>
                  ) : (() => {
                    let lastSection: string | null = null;
                    let rowIdx = 0;
                    const rows: React.ReactNode[] = [];
                    items.forEach((item: Record<string, unknown>, idx: number) => {
                      const section = (item.seccion as string) || null;
                      if (section && section !== lastSection) {
                        rows.push(
                          <tr key={`section-${idx}`}
                              className="bg-gray-100">
                            <td colSpan={6} className="px-1 py-0.5 text-left font-bold text-blue-900 border-t border-b border-blue-200">
                              {String(section)}
                            </td>
                          </tr>
                        );
                        lastSection = section;
                      }
                      rows.push(
                        <tr key={idx} className={item.esComentario ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                          <td className="px-1 py-0.5 border-t text-gray-700">{++rowIdx}</td>
                          <td className="px-1 py-0.5 border-t text-gray-900 font-medium">{String(item.producto || '-')}</td>
                          <td className="px-1 py-0.5 border-t text-gray-700">{String(item.descripcion || '-')}</td>
                          <td className="px-1 py-0.5 border-t text-right">{String(item.cantidad || 0)}</td>
                          <td className="px-1 py-0.5 border-t text-right">{formatCurrency(Number(item.valor) || 0)}</td>
                          <td className="px-1 py-0.5 border-t text-right font-semibold">{formatCurrency(Number(item.total) || 0)}</td>
                        </tr>
                      );
                    });
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notas y resumen financiero en la misma fila debajo de la tabla */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-2 mt-2">
            <div className="bg-white border border-gray-200 rounded-lg p-2 col-span-1 md:col-span-5">
              <div className="text-xs font-semibold text-gray-900 mb-1">Notas</div>
              <div className="text-xs text-gray-700 whitespace-pre-line min-h-[40px]">
                {String(cliente.notas ?? proyecto?.observaciones ?? 'Sin notas adicionales.')}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 col-span-1 md:col-span-5 md:justify-self-end">
              <div className="text-xs font-semibold text-gray-900 mb-1">Resumen Financiero</div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700">Moneda:</span>
                <span className="font-medium">Peso Chileno (CLP)</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700">Neto:</span>
                <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700">IVA (19%):</span>
                <span className="font-semibold">{formatCurrency(totals.ivaTotal)}</span>
              </div>
              <div className="border-t border-gray-300 my-1"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total Final:</span>
                <span className="text-lg font-bold text-blue-900">{formatCurrency(totals.totalGeneral)}</span>
              </div>
            </div>
          </div>
        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; }
          }
        `}</style>
        </div>
      </SheetContent>
    </Sheet>
  );
}
