import { UseFormReturn } from 'react-hook-form';
import { User, Building2, MapPin, Phone, Mail, Search, Users, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { regionesChile, getCiudadesByRegionId, getComunasByCiudadId, type Ciudad } from '../data/regionesChile';
import { clientesExistentes, buscarClientes, type ClienteExistente, type Sucursal } from '../data/clientesMock';
import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { AddSucursalModal, type SucursalFormData } from './AddSucursalModal';
import { ValidationAlert } from './ValidationAlert';
import { useCallback } from 'react';

interface ClienteFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onReset?: () => void;
}

const TIPOS_DIRECCION = [
  { value: 'comercial', label: 'Comercial' },
  { value: 'facturacion', label: 'Facturación' },
  { value: 'despacho', label: 'Despacho' },
  { value: 'otra', label: 'Otra' },
];

export function ClienteForm({ form }: ClienteFormProps) {
  // Helper function to safely set form values
  const setFormValue = useCallback((path: string, value: unknown, options?: { shouldValidate?: boolean }) => {
    form.setValue(path as never, value as never, options);
  }, [form]);

  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClienteDialog, setShowClienteDialog] = useState(false);
  const [filteredClientes, setFilteredClientes] = useState<ClienteExistente[]>(clientesExistentes);
  const [selectedCliente, setSelectedCliente] = useState<ClienteExistente | null>(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState<Sucursal[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState(true);
  const sucursalSelectRef = useRef<HTMLButtonElement>(null);

  const watchRegion = form.watch('cliente.regionId');
  const watchCiudad = form.watch('cliente.ciudadId');
  const watchRut = form.watch('cliente.rut');
  const watchRazonSocial = form.watch('cliente.razonSocial');

  // Reset state when form is cleared
  useEffect(() => {
    // If both RUT and Razón Social are empty, reset selected client and sucursales
    if (!watchRut && !watchRazonSocial) {
      if (selectedCliente !== null) {
        setSelectedCliente(null);
        setSucursalesDisponibles([]);
        setShowValidationAlert(true);
      }
    }
  }, [watchRut, watchRazonSocial, selectedCliente]);

  // Get validation errors
  const validationErrors = useMemo(() => {
    const errors = form.formState.errors.cliente;
    if (!errors) return [];
    
    const errorMessages: string[] = [];
    const fieldLabels: Record<string, string> = {
      rut: 'RUT',
      razonSocial: 'Razón Social',
      giro: 'Giro Comercial',
      sucursalId: 'Sucursal',
      regionId: 'Región',
      ciudadId: 'Ciudad',
      comuna: 'Comuna',
      descripcionDireccion: 'Descripción de Dirección',
      tipoDireccion: 'Tipo de Dirección',
      calle: 'Calle',
      numero: 'Número',
      email: 'Correo Electrónico',
      celular: 'Número Celular',
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
  }, [form.formState.errors.cliente]);

  // Search clientes
  useEffect(() => {
    const results = buscarClientes(searchQuery);
    setFilteredClientes(results);
  }, [searchQuery]);

  // Update ciudades when region changes
  useEffect(() => {
    if (watchRegion) {
      const newCiudades = getCiudadesByRegionId(parseInt(watchRegion));
      setCiudades(newCiudades);
      // Reset ciudad and comuna
      setFormValue('cliente.ciudadId', '');
      setFormValue('cliente.comuna', '');
      setComunas([]);
    }
  }, [watchRegion, form, setFormValue]);

  // Update comunas when ciudad changes
  useEffect(() => {
    if (watchRegion && watchCiudad) {
      const newComunas = getComunasByCiudadId(
        parseInt(watchRegion),
        parseInt(watchCiudad)
      );
      setComunas(newComunas);
      // Reset comuna
      setFormValue('cliente.comuna', '');
    }
  }, [watchCiudad, watchRegion, form, setFormValue]);

  // Format RUT as user types
  const formatRUT = (value: string) => {
    // Remove all non-alphanumeric characters
    const clean = value.replace(/[^0-9kK]/g, '');
    
    if (clean.length <= 1) return clean;
    
    // Split into body and verifier
    const body = clean.slice(0, -1);
    const verifier = clean.slice(-1);
    
    // Add dots to body
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formatted}-${verifier}`;
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setFormValue('cliente.rut', formatted);
  };

  // Handle selecting existing client
  const handleSelectCliente = (cliente: ClienteExistente) => {
    // Store selected client and show sucursales
    setSelectedCliente(cliente);
    setSucursalesDisponibles(cliente.sucursales);
    
    // Populate basic client fields - format RUT to ensure validation passes
    const formattedRut = formatRUT(cliente.rut);
    setFormValue('cliente.rut', formattedRut, { shouldValidate: true });
    setFormValue('cliente.razonSocial', cliente.razonSocial, { shouldValidate: true });
    setFormValue('cliente.giro', cliente.giro, { shouldValidate: true });
    setFormValue('cliente.email', cliente.email, { shouldValidate: true });
    setFormValue('cliente.celular', cliente.celular, { shouldValidate: true });
    setFormValue('cliente.telefono', cliente.telefono || '');
    
    // Reset address fields - will be filled when sucursal is selected
    setFormValue('cliente.sucursalId', '');
    setFormValue('cliente.regionId', '');
    setFormValue('cliente.ciudadId', '');
    setFormValue('cliente.comuna', '');
    setFormValue('cliente.descripcionDireccion', '');
    setFormValue('cliente.tipoDireccion', '');
    setFormValue('cliente.calle', '');
    setFormValue('cliente.numero', '');
    setFormValue('cliente.complemento', '');

    setShowClienteDialog(false);
    
    toast.success('Cliente cargado correctamente', {
      description: `Ahora seleccione la sucursal de ${cliente.razonSocial}`,
    });

    // Focus on sucursal select after a short delay
    setTimeout(() => {
      sucursalSelectRef.current?.focus();
      sucursalSelectRef.current?.click();
    }, 300);
  };

  // Handle sucursal selection
  const handleSucursalChange = (sucursalId: string) => {
    if (!selectedCliente) return;
    
    const sucursal = sucursalesDisponibles.find(s => s.id === sucursalId);
    if (!sucursal) return;

    // Set sucursal ID
    setFormValue('cliente.sucursalId', sucursalId);
    
    // Set region first
    setFormValue('cliente.regionId', sucursal.regionId);
    
    // Wait for region to update cities
    setTimeout(() => {
      setFormValue('cliente.ciudadId', sucursal.ciudadId);
      
      // Wait for city to update comunas
      setTimeout(() => {
        setFormValue('cliente.comuna', sucursal.comuna);
      }, 100);
    }, 100);
    
    // Set address fields
    setFormValue('cliente.descripcionDireccion', sucursal.nombre);
    setFormValue('cliente.tipoDireccion', sucursal.esPrincipal ? 'comercial' : 'otra');
    setFormValue('cliente.calle', sucursal.calle);
    setFormValue('cliente.numero', sucursal.numero);
    setFormValue('cliente.complemento', sucursal.complemento || '');
    
    // Store sucursal name for display in ResumenFinal
    setFormValue('cliente.sucursalNombre', sucursal.nombre);

    toast.success('Sucursal seleccionada', {
      description: sucursal.nombre,
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 sm:p-6 rounded-xl">
      <Card className="p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-shadow duration-300 border-gray-200/60 bg-white">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Datos del Contratante / Cliente
              </h2>
              <p className="text-[11px] text-gray-600">
                Registre la información completa del cliente
              </p>
            </div>
          </div>

          {/* Select Existing Client Button */}
          <Dialog open={showClienteDialog} onOpenChange={setShowClienteDialog}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 border-[#003366] text-[#003366] hover:bg-blue-50 w-full sm:w-auto text-xs sm:text-sm h-9"
              >
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xs:inline">Seleccionar Cliente Existente</span>
                <span className="inline xs:hidden">Seleccionar Cliente</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4 text-[#003366]" />
                  Seleccionar Cliente Existente
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Busque y seleccione un cliente para autocompletar sus datos
                </DialogDescription>
              </DialogHeader>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input
                  placeholder="Buscar por razón social, RUT o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Clients List */}
              <div className="space-y-1.5 mt-2">
                {filteredClientes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-1.5 text-gray-300" />
                    <p className="font-medium text-xs">No se encontraron clientes</p>
                    <p className="text-[11px]">Intente con otros términos de búsqueda</p>
                  </div>
                ) : (
                  filteredClientes.map((cliente) => (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => handleSelectCliente(cliente)}
                      className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-[#003366] hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-1.5">
                            <h3 className="font-semibold text-sm text-gray-900">
                              {cliente.razonSocial}
                            </h3>
                            <Badge className="bg-orange-500 text-white hover:bg-orange-500 text-[10px] font-bold px-2.5 py-0.5 border-0 w-fit rounded-full">
                              {cliente.rut}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {cliente.giro}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {cliente.sucursales.length} sucursal{cliente.sucursales.length !== 1 ? 'es' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {cliente.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {cliente.celular}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Validation Alert */}
      {validationErrors.length > 0 && showValidationAlert && (
        <ValidationAlert
          errors={validationErrors}
          title="Errores de Validación - Datos del Cliente"
          onClose={() => setShowValidationAlert(false)}
        />
      )}

      <div className="space-y-4">
        {/* Sucursal Selection - Only shown when client is selected */}
        {selectedCliente && sucursalesDisponibles.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#003366] rounded-xl p-3">
            <div className="flex flex-col sm:flex-row items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Seleccione la Sucursal
                  </h3>
                  {form.watch('cliente.sucursalId') && (
                    <Badge className="bg-green-500 text-white text-[10px] w-fit">
                      ✓ Listo para avanzar
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 mb-2">
                  Cliente: <strong className="block sm:inline mt-0.5 sm:mt-0">{selectedCliente.razonSocial}</strong>
                  <span className="hidden sm:inline"> - </span>
                  <span className="block sm:inline">Elija la sucursal para este presupuesto</span>
                </p>
                <FormField
                  control={form.control}
                  name="cliente.sucursalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-sm mb-1">
                        Sucursal <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSucursalChange(value);
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger 
                            ref={sucursalSelectRef}
                            className="ring-2 ring-[#003366] focus:ring-[#00AEEF] rounded-lg h-9 text-sm font-medium"
                          >
                            <SelectValue placeholder="👉 Seleccione una sucursal..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] min-w-[280px] max-w-[calc(100vw-2rem)]">
                          {sucursalesDisponibles.map((sucursal) => (
                            <SelectItem 
                              key={sucursal.id} 
                              value={sucursal.id}
                              className="py-1.5 px-2 cursor-pointer"
                            >
                              <div className="flex flex-col gap-1.5 w-full">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Building className="w-3.5 h-3.5 text-[#003366] flex-shrink-0" />
                                  <span className="font-medium text-sm break-words flex-1 min-w-0">{sucursal.nombre}</span>
                                  {sucursal.esPrincipal && (
                                    <Badge variant="default" className="bg-[#00AEEF] text-[10px] px-1.5 py-0.5 flex-shrink-0">
                                      Principal
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-gray-500 pl-5 break-words">
                                  {sucursal.calle} {sucursal.numero}, {sucursal.comuna}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                {/* Add New Sucursal Button */}
                <div className="mt-2">
                  <AddSucursalModal 
                    form={form}
                    clienteRut={selectedCliente.rut}
                    clienteRazonSocial={selectedCliente.razonSocial}
                    onSucursalAdded={(sucursal: SucursalFormData) => {
                      // Add to available sucursales list
                      setSucursalesDisponibles(prev => [...prev, sucursal]);
                      toast.success('Sucursal disponible', {
                        description: 'La nueva sucursal se agregó y seleccionó automáticamente',
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Información Básica */}
        <div className="bg-white p-4 rounded-lg">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
            <Building2 className="w-4 h-4 text-[#003366]" />
            Información de la Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="cliente.rut"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    RUT <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12.345.678-9"
                      {...field}
                      onChange={handleRUTChange}
                      className={`ring-1 rounded-lg transition-all h-9 ${
                        fieldState.error 
                          ? 'ring-red-500 border-red-500 bg-red-50 focus:ring-red-600' 
                          : 'ring-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.razonSocial"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Razón Social <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Empresa S.A."
                      {...field}
                      className={`ring-1 rounded-lg transition-all h-9 ${
                        fieldState.error 
                          ? 'ring-red-500 border-red-500 bg-red-50 focus:ring-red-600' 
                          : 'ring-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.giro"
              render={({ field, fieldState }) => (
                <FormItem className="md:col-span-2 xl:col-span-3">
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Giro <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Construcción y servicios generales"
                      {...field}
                      className={`ring-1 rounded-lg transition-all h-9 ${
                        fieldState.error 
                          ? 'ring-red-500 border-red-500 bg-red-50 focus:ring-red-600' 
                          : 'ring-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs font-medium" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-gray-50/60 p-4 rounded-lg">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
            <MapPin className="w-4 h-4 text-[#003366]" />
            Ubicación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="cliente.regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Región <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Seleccione región" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                      {regionesChile.map((region) => (
                        <SelectItem 
                          key={region.id} 
                          value={region.id.toString()}
                          className="text-sm py-1.5 px-2 cursor-pointer"
                        >
                          {region.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.ciudadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Ciudad <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchRegion}
                  >
                    <FormControl>
                      <SelectTrigger className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9 text-sm disabled:opacity-50">
                        <SelectValue placeholder="Seleccione ciudad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                      {ciudades.map((ciudad) => (
                        <SelectItem 
                          key={ciudad.id} 
                          value={ciudad.id.toString()}
                          className="text-sm py-1.5 px-2 cursor-pointer"
                        >
                          {ciudad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Comuna <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchCiudad}
                  >
                    <FormControl>
                      <SelectTrigger className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9 text-sm disabled:opacity-50">
                        <SelectValue placeholder="Seleccione comuna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                      {comunas.map((comuna) => (
                        <SelectItem 
                          key={comuna} 
                          value={comuna}
                          className="text-sm py-1.5 px-2 cursor-pointer"
                        >
                          {comuna}
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

        {/* Dirección */}
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Dirección Completa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="cliente.tipoDireccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Tipo de Dirección <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                      {TIPOS_DIRECCION.map((tipo) => (
                        <SelectItem 
                          key={tipo.value} 
                          value={tipo.value}
                          className="text-sm py-1.5 px-2 cursor-pointer"
                        >
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.descripcionDireccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Descripción Dirección <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Oficina central"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.calle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Calle <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Av. Libertador Bernardo O'Higgins"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Número <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.complemento"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 text-sm mb-1">Complemento (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Oficina 501, Piso 5"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-gray-50/60 p-4 rounded-lg">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
            <Phone className="w-4 h-4 text-[#003366]" />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="cliente.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Correo Electrónico <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contacto@empresa.cl"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    Número Celular <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm mb-1">
                    Número Teléfono (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+56 2 1234 5678"
                      {...field}
                      className="ring-1 ring-gray-300 focus:ring-blue-500 rounded-lg h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      </Card>
    </div>
  );
}
