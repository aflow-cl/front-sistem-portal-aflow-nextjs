"use client";

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { VisualizationType } from '@/types/presupuesto';
import { useBudgetSettings } from '../context/BudgetSettingsContext';
import { useBudgetCalculations } from '../hooks/useBudgetFormState';
import { formatCurrency } from '@/lib/utils';
import { Building2, Calendar, FileText, Hash, Mail, MapPin, Phone, User } from 'lucide-react';

interface FormDataType {
  folio?: string;
  cliente?: Record<string, unknown>;
  proyecto?: Record<string, unknown>;
  items?: Array<Record<string, unknown>>;
}

interface BudgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormDataType;
  visualizationType: VisualizationType;
  onVisualizationChange: (type: VisualizationType) => void;
}

export function BudgetPreviewModal({
  isOpen,
  onClose,
  formData,
  visualizationType,
  onVisualizationChange,
}: BudgetPreviewModalProps) {
  const { settings } = useBudgetSettings();
  const totals = useBudgetCalculations(formData?.items || []);

  const cliente = formData?.cliente || {};
  const proyecto = formData?.proyecto || {};
  const items = formData?.items || [];

  // Font size mapping
  const fontSizeClass = {
    'Pequeña': 'text-xs',
    'Normal': 'text-sm',
    'Grande': 'text-base',
  }[settings.tamanoLetra] || 'text-sm';

  // Logo size
  const logoSize = `${settings.tamanoLogo}px`;

  // Folio style classes
  const folioClasses = {
    'Simple': 'text-lg font-semibold',
    'Destacado': 'text-2xl font-bold tracking-wide',
    'Sombra': 'text-2xl font-bold drop-shadow-lg',
  }[settings.folioEstilo] || 'text-lg font-semibold';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header con controles */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold text-gray-900">Vista Previa del Presupuesto</h2>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Visualización:
              </label>
              <Select 
                value={visualizationType} 
                onValueChange={(value) => onVisualizationChange(value as VisualizationType)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completa">Completa</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Compacta">Compacta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido scrollable */}
        <div 
          className={`flex-1 overflow-y-auto p-8 bg-gray-50 ${fontSizeClass}`}
          style={{ fontFamily: settings.tipoLetra }}
        >
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                {/* Logo */}
                {settings.logoPrincipal && (
                  <div style={{ height: logoSize, position: 'relative', minWidth: '100px' }}>
                    <Image 
                      src={settings.logoPrincipal} 
                      alt="Logo Principal" 
                      width={200}
                      height={parseInt(logoSize)}
                      style={{ height: logoSize, width: 'auto' }}
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Folio */}
                <div 
                  className={`px-6 py-3 rounded-lg ${folioClasses}`}
                  style={{ 
                    backgroundColor: settings.folioColorFondo,
                    color: '#1f2937'
                  }}
                >
                  {settings.folioOperativo}-{formData?.folio || '000000'}
                </div>
              </div>

              {/* Header Data */}
              {settings.datosCabecera && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {settings.datosCabecera}
                  </pre>
                </div>
              )}

              {/* Secondary Logo */}
              {settings.logoSecundario && (
                <div className="flex justify-end">
                  <div style={{ height: `${settings.tamanoLogo * 0.7}px`, position: 'relative', minWidth: '70px' }}>
                    <Image 
                      src={settings.logoSecundario} 
                      alt="Logo Secundario" 
                      width={140}
                      height={settings.tamanoLogo * 0.7}
                      style={{ height: `${settings.tamanoLogo * 0.7}px`, width: 'auto' }}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Client Information */}
            {visualizationType !== "Compacta" && (
              <Card className="p-6 mb-6 border-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#244F82]" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cliente.tipoPersona === 'empresa' ? (
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Razón Social</p>
                        <p className="font-medium">{String(cliente.razonSocial || '-')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Nombre</p>
                        <p className="font-medium">
                          {[cliente.primerNombre, cliente.segundoNombre, cliente.apellidoPaterno, cliente.apellidoMaterno]
                            .filter(Boolean)
                            .map(String)
                            .join(' ') || '-'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">RUT</p>
                      <p className="font-medium">{String(cliente.rut || '-')}</p>
                    </div>
                  </div>

                  {visualizationType === "Completa" && (
                    <>
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{String(cliente.email || '-')}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Teléfono</p>
                          <p className="font-medium">{String(cliente.telefono || '-')}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Dirección</p>
                          <p className="font-medium">
                            {[cliente.calle, cliente.numero, cliente.complemento, cliente.comuna]
                              .filter(Boolean)
                              .map(String)
                              .join(', ') || '-'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Project Information */}
            {visualizationType !== "Compacta" && proyecto && (
              <Card className="p-6 mb-6 border-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#244F82]" />
                  Información del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Nombre del Proyecto</p>
                    <p className="font-medium">{String(proyecto.nombre || '-')}</p>
                  </div>

                  {visualizationType === "Completa" && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Descripción</p>
                        <p className="font-medium">{String(proyecto.descripcion || '-')}</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Fecha de Inicio</p>
                          <p className="font-medium">{String(proyecto.fechaInicio || '-')}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Fecha de Término</p>
                          <p className="font-medium">{String(proyecto.fechaTermino || '-')}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Ítems</h3>
              <div className="border-2 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead style={{ backgroundColor: settings.colorCabeceraGrilla }}>
                    <tr className="text-white">
                      {visualizationType !== "Compacta" && <th className="text-left p-3 text-sm font-semibold">Producto</th>}
                      <th className="text-left p-3 text-sm font-semibold">Descripción</th>
                      {visualizationType === "Completa" && (
                        <>
                          <th className="text-right p-3 text-sm font-semibold">Cantidad</th>
                          <th className="text-right p-3 text-sm font-semibold">Valor Unit.</th>
                          <th className="text-right p-3 text-sm font-semibold">Utilidad %</th>
                          <th className="text-right p-3 text-sm font-semibold">IVA %</th>
                        </>
                      )}
                      <th className="text-right p-3 text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={visualizationType === "Completa" ? 7 : 3} className="p-6 text-center text-gray-500">
                          No hay ítems agregados
                        </td>
                      </tr>
                    ) : (
                      items.map((item: Record<string, unknown>, index: number) => (
                        <tr key={index} className={item.esComentario ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                          {visualizationType !== "Compacta" && (
                            <td className="p-3 border-t">{String(item.producto || '-')}</td>
                          )}
                          <td className="p-3 border-t">{String(item.descripcion || '-')}</td>
                          {visualizationType === "Completa" && (
                            <>
                              <td className="p-3 border-t text-right">{String(item.cantidad || 0)}</td>
                              <td className="p-3 border-t text-right">{formatCurrency(Number(item.valor) || 0)}</td>
                              <td className="p-3 border-t text-right">{String(item.utilidad || 0)}%</td>
                              <td className="p-3 border-t text-right">{String(item.iva || 0)}%</td>
                            </>
                          )}
                          <td className="p-3 border-t text-right font-semibold">
                            {formatCurrency(Number(item.total) || 0)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2">
              <div className="space-y-3">
                {visualizationType !== "Compacta" && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Subtotal:</span>
                      <span className="font-semibold text-lg">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">IVA:</span>
                      <span className="font-semibold text-lg">{formatCurrency(totals.ivaTotal)}</span>
                    </div>
                    <Separator className="bg-gray-300" />
                  </>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-[#244F82]">
                    {formatCurrency(totals.totalGeneral)}
                  </span>
                </div>
                {visualizationType !== "Compacta" && (
                  <p className="text-sm text-gray-600 text-right">
                    ({totals.itemCount} {totals.itemCount === 1 ? 'ítem' : 'ítems'})
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
