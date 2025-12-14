import { UseFormReturn } from 'react-hook-form';
import { Briefcase, Calendar, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { ValidationAlert } from './ValidationAlert';

interface ProyectoFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const TIPOS_TRABAJO = [
  { value: 'construccion', label: 'Construcción' },
  { value: 'mantencion', label: 'Mantención' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'reparacion', label: 'Reparación' },
  { value: 'otro', label: 'Otro' },
];

export function ProyectoForm({ form }: ProyectoFormProps) {
  const watchFechaInicio = form.watch('proyecto.fechaInicio');
  const [showValidationAlert, setShowValidationAlert] = useState(true);

  // Get validation errors
  const validationErrors = useMemo(() => {
    const errors = form.formState.errors.proyecto;
    if (!errors) return [];
    
    const errorMessages: string[] = [];
    const fieldLabels: Record<string, string> = {
      nombre: 'Nombre del Proyecto',
      descripcion: 'Descripción',
      fechaInicio: 'Fecha de Inicio',
      fechaTermino: 'Fecha de Término',
      tipoTrabajo: 'Tipo de Trabajo',
      responsable: 'Responsable',
    };

    Object.keys(errors).forEach((key) => {
      const error = errors[key as keyof typeof errors];
      if (error && typeof error === 'object' && 'message' in error) {
        const label = fieldLabels[key] || key;
        const message = (error as { message?: string }).message;
        if (message) {
          errorMessages.push(`${label}: ${message}`);
        }
      }
    });

    return errorMessages;
  }, [form.formState.errors.proyecto]);

  return (
    <Card className="p-4 md:p-6 rounded-2xl shadow-lg border-gray-200">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Información del Proyecto o Trabajo
            </h2>
            <p className="text-xs text-gray-600">
              Describa el trabajo o servicio a cotizar
            </p>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {validationErrors.length > 0 && showValidationAlert && (
        <ValidationAlert
          errors={validationErrors}
          title="Errores de Validación - Datos del Proyecto"
          onClose={() => setShowValidationAlert(false)}
        />
      )}

      <div className="space-y-6">
        {/* Información General del Proyecto */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <FileText className="w-5 h-5 text-[#003366]" />
            Datos Generales
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="proyecto.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Nombre del Proyecto <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Construcción Edificio Corporativo"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proyecto.descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Descripción General <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa brevemente el alcance y características del proyecto..."
                      {...field}
                      rows={4}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proyecto.tipoTrabajo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Tipo de Trabajo <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="Seleccione el tipo de trabajo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPOS_TRABAJO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Fechas */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <Calendar className="w-5 h-5 text-[#003366]" />
            Planificación Temporal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="proyecto.fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Fecha de Inicio <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proyecto.fechaTermino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Fecha Estimada de Término <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={watchFechaInicio}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Responsable y Observaciones */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <User className="w-5 h-5 text-[#003366]" />
            Responsabilidad y Notas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="proyecto.responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Responsable Interno <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del responsable del proyecto"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proyecto.observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Observaciones (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales, consideraciones especiales, requisitos específicos..."
                      {...field}
                      rows={3}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Información Importante
              </h4>
              <p className="text-xs text-blue-700">
                Asegúrese de que la fecha de término sea posterior o igual a la fecha de inicio.
                Esta información será utilizada para la planificación y seguimiento del proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
