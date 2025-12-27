"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, X, Save, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { useBudgetSettings } from '../context/BudgetSettingsContext';

// Validation schema for ajustes form
const ajustesSchema = z.object({
  folioOperativo: z.string().min(1, 'Ingrese el prefijo del folio').max(10, 'Máximo 10 caracteres'),
  folioEstilo: z.enum(['Simple', 'Destacado', 'Sombra'] as const),
  folioColorFondo: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido'),
  tipoLetra: z.enum(['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Roboto', 'Open Sans'] as const),
  tamanoLetra: z.enum(['Pequeña', 'Normal', 'Grande'] as const),
  tamanoLogo: z.coerce.number().min(50, 'Mínimo 50px').max(200, 'Máximo 200px'),
  colorCabeceraGrilla: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido'),
  datosCabecera: z.string().max(500, 'Máximo 500 caracteres'),
});

type AjustesFormData = z.infer<typeof ajustesSchema>;

export default function AjustesPage() {
  const { settings, updateSettings, resetSettings } = useBudgetSettings();
  const [logoPrincipal, setLogoPrincipal] = useState<string | null>(settings.logoPrincipal || null);
  const [logoSecundario, setLogoSecundario] = useState<string | null>(settings.logoSecundario || null);
  const logoPrincipalInputRef = useRef<HTMLInputElement>(null);
  const logoSecundarioInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AjustesFormData>({
    resolver: zodResolver(ajustesSchema),
    defaultValues: {
      folioOperativo: settings.folioOperativo,
      folioEstilo: settings.folioEstilo,
      folioColorFondo: settings.folioColorFondo,
      tipoLetra: settings.tipoLetra,
      tamanoLetra: settings.tamanoLetra,
      tamanoLogo: settings.tamanoLogo,
      colorCabeceraGrilla: settings.colorCabeceraGrilla,
      datosCabecera: settings.datosCabecera || '',
    },
  });

  // Handle logo upload
  const handleLogoUpload = (file: File, type: 'principal' | 'secundario') => {
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('La imagen no debe superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'principal') {
        setLogoPrincipal(base64String);
      } else {
        setLogoSecundario(base64String);
      }
      toast.success(`Logo ${type} cargado correctamente`);
    };
    reader.readAsDataURL(file);
  };

  // Save settings
  const onSubmit = (data: AjustesFormData) => {
    updateSettings({
      ...data,
      logoPrincipal: logoPrincipal || undefined,
      logoSecundario: logoSecundario || undefined,
    });
    toast.success('Configuración guardada correctamente', {
      description: 'Los cambios se aplicarán en la vista previa de presupuestos',
    });
  };

  // Reset to defaults
  const handleReset = () => {
    resetSettings();
    setLogoPrincipal(null);
    setLogoSecundario(null);
    form.reset({
      folioOperativo: 'PRE',
      folioEstilo: 'Simple',
      folioColorFondo: '#f3f4f6',
      tipoLetra: 'Arial',
      tamanoLetra: 'Normal',
      tamanoLogo: 100,
      colorCabeceraGrilla: '#244F82',
      datosCabecera: '',
    });
    toast.info('Configuración restablecida a valores por defecto');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-3xl space-y-4 sm:space-y-6 bg-white rounded-xl shadow-md p-2 sm:p-6 md:p-8">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Ajustes de Personalización</h2>
          <p className="text-sm text-gray-600">Configure la apariencia y diseño de los documentos de presupuesto</p>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Logos Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Logos</CardTitle>
              <CardDescription>
                Agregue los logos que aparecerán en los documentos de presupuesto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Principal */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Logo Principal <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div
                      onClick={() => logoPrincipalInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 hover:border-[#244F82] hover:bg-gray-50 transition-colors cursor-pointer text-center"
                    >
                      {logoPrincipal ? (
                        <div className="relative inline-block">
                          <Image 
                            src={logoPrincipal} 
                            alt="Logo Principal" 
                            width={200}
                            height={128}
                            className="max-h-32 mx-auto object-contain"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogoPrincipal(null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Haga clic para subir logo principal
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG o SVG (máx. 2MB)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={logoPrincipalInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file, 'principal');
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Logo Secundario */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Logo Secundario <span className="text-gray-400 text-xs">(Opcional)</span>
                </Label>
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div
                      onClick={() => logoSecundarioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 hover:border-[#244F82] hover:bg-gray-50 transition-colors cursor-pointer text-center"
                    >
                      {logoSecundario ? (
                        <div className="relative inline-block">
                          <Image 
                            src={logoSecundario} 
                            alt="Logo Secundario" 
                            width={150}
                            height={96}
                            className="max-h-24 mx-auto object-contain"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogoSecundario(null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Haga clic para subir logo secundario
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={logoSecundarioInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file, 'secundario');
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Folio Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración de Folio</CardTitle>
              <CardDescription>
                Personalice el formato y estilo del número de folio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="folioOperativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefijo del Folio</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="PRE" maxLength={10} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Ejemplo: PRE-2024-001
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="folioEstilo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estilo del Número de Folio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Simple">Simple</SelectItem>
                          <SelectItem value="Destacado">Destacado</SelectItem>
                          <SelectItem value="Sombra">Con Sombra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="folioColorFondo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color de Fondo del Folio</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-20 h-10 p-1 cursor-pointer" />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="#f3f4f6"
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipografía y Tamaños</CardTitle>
              <CardDescription>
                Configure las fuentes y tamaños de elementos visuales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="tipoLetra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Letra</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tamanoLetra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño de Letra</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pequeña">Pequeña</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Grande">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tamanoLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño del Logo (px)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="number" 
                            min={50} 
                            max={200} 
                            step={10}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <input
                            type="range"
                            min={50}
                            max={200}
                            step={10}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#244F82]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colores del Documento</CardTitle>
              <CardDescription>
                Personalice los colores de elementos clave del presupuesto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="colorCabeceraGrilla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color de Cabecera de Grilla</FormLabel>
                    <div className="flex gap-1 sm:gap-2">
                      <FormControl>
                        <Input type="color" {...field} className="w-20 h-10 p-1 cursor-pointer" />
                      </FormControl>
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#244F82"
                        className="flex-1"
                      />
                    </div>
                    <FormDescription className="text-xs">
                      Color de fondo para los encabezados de la tabla de ítems
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Header Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos de Cabecera</CardTitle>
              <CardDescription>
                Información adicional que aparecerá en el encabezado del documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="datosCabecera"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de Cabecera</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ejemplo:&#10;Empresa AFLOW S.A.&#10;RUT: 12.345.678-9&#10;Dirección: Av. Principal #123&#10;Teléfono: +56 9 1234 5678"
                        rows={6}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Máximo 500 caracteres. Use saltos de línea para organizar la información
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-2 w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer
            </Button>
            <Button
              type="submit"
              className="bg-[#244F82] hover:bg-[#1a3a5f] gap-2 w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
}
