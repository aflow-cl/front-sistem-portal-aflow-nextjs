# Modal de Agregar Sucursal - Componente Reutilizable

## Ubicación
`app/portal/presupuesto/crear/components/AddSucursalModal.tsx`

## Descripción
Componente modal reutilizable para agregar nuevas sucursales a clientes. Puede ser usado tanto dentro del wizard de creación de presupuestos como en módulos independientes de gestión de clientes.

## Características

- ✅ Formulario completo para datos de sucursal
- ✅ Validación de campos requeridos
- ✅ Selección cascada: Región → Ciudad → Comuna
- ✅ Checkbox para marcar sucursal como principal
- ✅ Integración con react-hook-form (opcional)
- ✅ Callback para capturar datos de sucursal
- ✅ Botón trigger personalizable
- ✅ Estilos consistentes con el sistema

## Uso en el Wizard de Presupuestos

```tsx
import { AddSucursalModal } from './components/AddSucursalModal';

// Dentro del componente
<AddSucursalModal 
  form={form}  // Instancia de react-hook-form
  clienteRut={selectedCliente.rut}
  clienteRazonSocial={selectedCliente.razonSocial}
  onSucursalAdded={(sucursal) => {
    // Callback cuando se agrega una sucursal
    setSucursalesDisponibles(prev => [...prev, sucursal]);
  }}
/>
```

## Uso Independiente (en otro módulo)

```tsx
import { AddSucursalModal } from '@/app/portal/presupuesto/crear/components/AddSucursalModal';

// Sin form, solo callback
<AddSucursalModal 
  clienteRut="76.123.456-7"
  clienteRazonSocial="Empresa ABC S.A."
  onSucursalAdded={(sucursal) => {
    // Enviar a API o actualizar estado
    console.log('Nueva sucursal:', sucursal);
    // Aquí puedes hacer un POST a tu API
    await createSucursal(sucursal);
  }}
/>
```

## Con Botón Trigger Personalizado

```tsx
<AddSucursalModal 
  onSucursalAdded={(sucursal) => {
    // Manejar sucursal
  }}
  triggerButton={
    <button className="custom-button">
      Mi Botón Personalizado
    </button>
  }
/>
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `form` | `UseFormReturn<any>` | No | Instancia de react-hook-form. Si se provee, actualiza automáticamente los campos del formulario |
| `onSucursalAdded` | `(sucursal: SucursalFormData) => void` | No | Callback ejecutado cuando se guarda una sucursal |
| `triggerButton` | `React.ReactNode` | No | Botón personalizado para abrir el modal. Si no se provee, usa el botón por defecto |
| `clienteRut` | `string` | No | RUT del cliente (para mostrar en el título) |
| `clienteRazonSocial` | `string` | No | Razón social del cliente (para mostrar en el título) |

## Estructura de Datos: SucursalFormData

```typescript
interface SucursalFormData {
  id: string;              // ID único generado automáticamente
  nombre: string;          // Nombre de la sucursal
  regionId: string;        // ID de la región
  ciudadId: string;        // ID de la ciudad
  comuna: string;          // Nombre de la comuna
  calle: string;           // Nombre de la calle
  numero: string;          // Número
  complemento?: string;    // Opcional: Piso, depto, oficina
  esPrincipal: boolean;    // Si es la sucursal principal
}
```

## Ejemplo de Integración con API

```tsx
import { useState } from 'react';
import { AddSucursalModal, SucursalFormData } from '@/app/portal/presupuesto/crear/components/AddSucursalModal';

function ClientesModule() {
  const [cliente, setCliente] = useState(/* ... */);
  
  const handleSucursalAdded = async (sucursal: SucursalFormData) => {
    try {
      // POST a tu API
      const response = await fetch('/api/clientes/${cliente.id}/sucursales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sucursal)
      });
      
      if (response.ok) {
        const nuevaSucursal = await response.json();
        // Actualizar estado
        setCliente(prev => ({
          ...prev,
          sucursales: [...prev.sucursales, nuevaSucursal]
        }));
        toast.success('Sucursal creada exitosamente');
      }
    } catch (error) {
      console.error('Error creando sucursal:', error);
      toast.error('Error al crear sucursal');
    }
  };
  
  return (
    <div>
      <h1>Gestión de Sucursales</h1>
      <AddSucursalModal 
        clienteRut={cliente.rut}
        clienteRazonSocial={cliente.razonSocial}
        onSucursalAdded={handleSucursalAdded}
      />
    </div>
  );
}
```

## Validaciones

El modal valida automáticamente:
- ✅ Nombre de sucursal (requerido)
- ✅ Región (requerido)
- ✅ Ciudad (requerido)
- ✅ Comuna (requerido)
- ✅ Calle (requerido)
- ✅ Número (requerido)
- ❓ Complemento (opcional)

## Flujo de Trabajo

1. Usuario hace clic en el botón trigger
2. Se abre el modal con el formulario vacío
3. Usuario completa los campos (selección cascada Región → Ciudad → Comuna)
4. Usuario hace clic en "Guardar Sucursal"
5. Se validan los campos requeridos
6. Si todo es válido:
   - Se ejecuta `onSucursalAdded` con los datos
   - Si hay `form`, se actualizan los campos automáticamente
   - Se muestra toast de éxito
   - Se cierra el modal

## Estilos

El modal usa los estilos del sistema de diseño AFLOW:
- **Color primario**: #003366
- **Color secundario**: #00AEEF
- **Bordes redondeados**: rounded-xl
- **Espaciado consistente**: gap-3, p-4
- **Diseño responsive**: max-w-3xl, grid-cols-1 md:grid-cols-2

## Dependencias

- `@/components/ui/dialog` (shadcn/ui)
- `@/components/ui/button` (shadcn/ui)
- `@/components/ui/input` (shadcn/ui)
- `@/components/ui/label` (shadcn/ui)
- `@/components/ui/select` (shadcn/ui)
- `lucide-react` (iconos)
- `sonner` (toast notifications)
- `../data/regionesChile` (datos regionales)

## Notas de Implementación

- El ID de sucursal se genera automáticamente usando `Date.now()`
- Los selects de ciudad y comuna están deshabilitados hasta que se seleccione la región/ciudad correspondiente
- El modal se cierra automáticamente después de guardar exitosamente
- El formulario se resetea cada vez que se abre el modal
