import { UseFormReturn } from 'react-hook-form';
import { Briefcase, Calendar as CalendarIcon, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { ValidationAlert } from './ValidationAlert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface ProyectoFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function ProyectoForm({ form }: ProyectoFormProps) {
  const watchFechaInicio = form.watch('proyecto.fechaInicio');
  const watchFechaTermino = form.watch('proyecto.fechaTermino');
  const [showValidationAlert, setShowValidationAlert] = useState(true);

  // Derive date range from form values
  const dateRange: DateRange | undefined = useMemo(() => {
    if (watchFechaInicio && watchFechaTermino) {
      return {
        from: new Date(watchFechaInicio),
        to: new Date(watchFechaTermino),
      };
    } else if (watchFechaInicio) {
      return {
        from: new Date(watchFechaInicio),
        to: undefined,
      };
    }
    return undefined;
  }, [watchFechaInicio, watchFechaTermino]);

  // Handle date range selection
  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      form.setValue('proyecto.fechaInicio', range.from.toISOString().split('T')[0], { shouldValidate: true });
    } else {
      form.setValue('proyecto.fechaInicio', '', { shouldValidate: true });
    }

    if (range?.to) {
      form.setValue('proyecto.fechaTermino', range.to.toISOString().split('T')[0], { shouldValidate: true });
    } else {
      // If we only have 'from', we might want to clear 'to' or keep it empty
      form.setValue('proyecto.fechaTermino', '', { shouldValidate: true });
    }
  };

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
          </div>
        </div>

        {/* Fechas */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <CalendarIcon className="w-5 h-5 text-[#003366]" />
            Planificación Temporal
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <FormItem className="flex flex-col">
              <Label className="text-gray-700" htmlFor="date">
                Periodo del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: es })
                      )
                    ) : (
                      <span>Seleccione un rango de fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="proyecto.fechaInicio"
                  render={() => <FormMessage className="text-red-500 text-xs" />}
                />
                <FormField
                  control={form.control}
                  name="proyecto.fechaTermino"
                  render={() => <FormMessage className="text-red-500 text-xs" />}
                />
              </div>
            </FormItem>
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
