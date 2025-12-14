import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, Building, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { regionesChile, getCiudadesByRegionId, getComunasByCiudadId, type Ciudad } from '../data/regionesChile';

interface AddSucursalModalProps {
  form?: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSucursalAdded?: (sucursal: SucursalFormData) => void;
  triggerButton?: React.ReactNode;
  clienteRut?: string;
  clienteRazonSocial?: string;
}

export interface SucursalFormData {
  id: string;
  nombre: string;
  regionId: string;
  ciudadId: string;
  comuna: string;
  calle: string;
  numero: string;
  complemento?: string;
  esPrincipal: boolean;
}

export function AddSucursalModal({ 
  form, 
  onSucursalAdded, 
  triggerButton,
  clienteRut,
  clienteRazonSocial
}: AddSucursalModalProps) {
  const [open, setOpen] = useState(false);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<SucursalFormData>({
    id: '',
    nombre: '',
    regionId: '',
    ciudadId: '',
    comuna: '',
    calle: '',
    numero: '',
    complemento: '',
    esPrincipal: false,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        id: `sucursal-${Date.now()}`,
        nombre: '',
        regionId: '',
        ciudadId: '',
        comuna: '',
        calle: '',
        numero: '',
        complemento: '',
        esPrincipal: false,
      });
      setCiudades([]);
      setComunas([]);
    }
  }, [open]);

  // Update ciudades when region changes
  useEffect(() => {
    if (formData.regionId) {
      const newCiudades = getCiudadesByRegionId(parseInt(formData.regionId));
      setCiudades(newCiudades);
      setFormData(prev => ({ ...prev, ciudadId: '', comuna: '' }));
      setComunas([]);
    }
  }, [formData.regionId]);

  // Update comunas when ciudad changes
  useEffect(() => {
    if (formData.regionId && formData.ciudadId) {
      const newComunas = getComunasByCiudadId(
        parseInt(formData.regionId),
        parseInt(formData.ciudadId)
      );
      setComunas(newComunas);
      setFormData(prev => ({ ...prev, comuna: '' }));
    }
  }, [formData.ciudadId, formData.regionId]);

  const handleInputChange = (field: keyof SucursalFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.nombre || !formData.regionId || !formData.ciudadId || 
        !formData.comuna || !formData.calle || !formData.numero) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    // If form is provided, update it directly
    if (form) {
      // Using type assertion for form setValue as we know the paths exist
      const setFormValue = (path: string, value: unknown) => {
        form.setValue(path as never, value as never);
      };
      
      setFormValue('cliente.sucursalId', formData.id);
      setFormValue('cliente.regionId', formData.regionId);
      setFormValue('cliente.ciudadId', formData.ciudadId);
      setFormValue('cliente.comuna', formData.comuna);
      setFormValue('cliente.descripcionDireccion', formData.nombre);
      setFormValue('cliente.tipoDireccion', formData.esPrincipal ? 'comercial' : 'otra');
      setFormValue('cliente.calle', formData.calle);
      setFormValue('cliente.numero', formData.numero);
      setFormValue('cliente.complemento', formData.complemento || '');
      setFormValue('cliente.sucursalNombre', formData.nombre);
    }

    // Call callback if provided
    if (onSucursalAdded) {
      onSucursalAdded(formData);
    }

    toast.success('Sucursal agregada correctamente', {
      description: formData.nombre,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
          >
            <Plus className="w-4 h-4" />
            Agregar Nueva Sucursal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="w-6 h-6 text-[#003366]" />
            Agregar Nueva Sucursal
          </DialogTitle>
          <DialogDescription>
            {clienteRazonSocial ? (
              <>Agregue una nueva sucursal para <strong>{clienteRazonSocial}</strong> ({clienteRut})</>
            ) : (
              'Complete los datos de la nueva sucursal'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nombre de Sucursal */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium">
              Nombre de Sucursal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Casa Matriz, Sucursal Las Condes, etc."
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Es Principal */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="esPrincipal"
              checked={formData.esPrincipal}
              onChange={(e) => handleInputChange('esPrincipal', e.target.checked)}
              className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
            />
            <Label htmlFor="esPrincipal" className="text-sm font-medium cursor-pointer">
              Marcar como sucursal principal
            </Label>
          </div>

          {/* Ubicación Section */}
          <div className="border-t pt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-[#003366]" />
              Ubicación
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Región */}
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-medium">
                  Región <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.regionId}
                  onValueChange={(value) => handleInputChange('regionId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionesChile.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad" className="text-sm font-medium">
                  Ciudad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.ciudadId}
                  onValueChange={(value) => handleInputChange('ciudadId', value)}
                  disabled={!formData.regionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudades.map((ciudad) => (
                      <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                        {ciudad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comuna */}
              <div className="space-y-2">
                <Label htmlFor="comuna" className="text-sm font-medium">
                  Comuna <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.comuna}
                  onValueChange={(value) => handleInputChange('comuna', value)}
                  disabled={!formData.ciudadId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {comunas.map((comuna) => (
                      <SelectItem key={comuna} value={comuna}>
                        {comuna}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calle */}
              <div className="space-y-2">
                <Label htmlFor="calle" className="text-sm font-medium">
                  Calle <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="calle"
                  placeholder="Nombre de la calle"
                  value={formData.calle}
                  onChange={(e) => handleInputChange('calle', e.target.value)}
                />
              </div>

              {/* Número */}
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numero"
                  placeholder="Número"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                />
              </div>

              {/* Complemento */}
              <div className="space-y-2">
                <Label htmlFor="complemento" className="text-sm font-medium">
                  Complemento (Opcional)
                </Label>
                <Input
                  id="complemento"
                  placeholder="Piso, oficina, depto, etc."
                  value={formData.complemento}
                  onChange={(e) => handleInputChange('complemento', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#003366] hover:bg-[#00AEEF] text-white"
          >
            Guardar Sucursal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
