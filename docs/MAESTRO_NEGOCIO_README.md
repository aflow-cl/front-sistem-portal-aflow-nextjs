# Módulo Maestro de Negocio - Portal AFLOW

## 📋 Resumen Ejecutivo

El módulo **Maestro de Negocio** es una solución integral de gestión de datos maestros (Master Data Management) para el Portal AFLOW. Implementa la funcionalidad central para administrar Contratantes, Proveedores, Servicios y Packs comerciales reutilizables, siguiendo estrictamente los patrones arquitectónicos, UX/UI y técnicos existentes en el proyecto.

### Estado de Implementación: ✅ COMPLETO (v1.2 - Producción)

**Fecha de implementación:** 15 de diciembre de 2025  
**Última actualización:** 21 de diciembre de 2025  
**Framework:** Next.js 15 (App Router)  
**Estado:** Listo para producción con datos mock  
**Build Status:** ✅ Exitoso  
**Color Principal (Contratantes):** Azul `#244F82` ✨

---

## 🎯 Objetivos Cumplidos

✅ **Navegación Coherente:** Integración en sidebar principal con tabs internas  
✅ **CRUD Completo:** Operaciones completas para todas las entidades  
✅ **Formularios Dinámicos:** Mutación automática según RUT (Persona Natural vs Empresa)  
✅ **Validaciones:** Zod + React Hook Form + RUT modulo 11  
✅ **Filtrado Avanzado:** Búsqueda en tiempo real + filtros por tipo y estado  
✅ **UX Consistente:** Patrones visuales idénticos al módulo Presupuesto  
✅ **Responsive:** Diseño mobile-first completamente funcional  
✅ **Proveedor Default Protegido:** Validación de reglas de negocio  

---

## 🏗️ Arquitectura del Módulo

### Estructura de Directorios

```
app/portal/maestro-negocio/
├── layout.tsx                    # Layout con navegación por tabs
├── page.tsx                      # Redirect automático a /contratantes
├── types/
│   └── maestroNegocio.ts        # Sistema de tipos TypeScript completo
├── api/
│   └── maestroService.ts        # Capa de servicios con mock data
│
├── contratantes/
│   ├── page.tsx                 # Página principal con tabla y filtros
│   ├── hooks/
│   │   └── useContratantes.ts   # Hook personalizado para lógica
│   └── components/
│       ├── Indicators.tsx       # Indicadores estadísticos
│       ├── Filters.tsx          # Componente de filtros
│       ├── ContratantesTable.tsx # Tabla con ordenamiento
│       ├── ContratanteModal.tsx # Modal CRUD dinámico (RUT)
│       └── DireccionesModal.tsx # Gestión de sucursales
│
├── proveedores/
│   ├── page.tsx                 # Página principal proveedores
│   └── hooks/
│       └── useProveedores.ts    # Hook personalizado
│
└── servicios/
    └── page.tsx                 # Página con tabs: Servicios + Packs
```

---

## 🔑 Funcionalidades Principales

### 1. Contratantes (CRUD Completo)

#### Características:
- **Detección automática de tipo según RUT**
  - RUT < 70.000.000 → Persona Natural
  - RUT ≥ 70.000.000 → Empresa
  
- **Formulario dinámico que muta sin recargar:**
  - **Persona Natural:** Nombres, Apellidos
  - **Empresa:** Razón Social, Giro

- **Gestión de Direcciones/Sucursales:**
  - CRUD completo de direcciones por contratante
  - Marcación de dirección principal
  - Contactos asociados (nombre, teléfono, email)
  - Soft delete (activo/inactivo)

#### Validaciones:
- RUT chileno con validación modulo 11
- Auto-formato: `12.345.678-9`
- Email válido (RFC 5322)
- Campos condicionales obligatorios según tipo

#### Filtros:
- **Búsqueda:** RUT, Nombre, Razón Social, Email
- **Tipo:** Persona Natural / Empresa / Todos (valor: `"all"`)
- **Estado:** Activo / Inactivo / Todos (valor: `"all"`)

**Nota técnica v1.1:** Los filtros usan `"all"` como valor por defecto en lugar de cadena vacía (`""`) para compatibilidad con Radix UI Select Component.

#### Indicadores:
- Total Contratantes
- Activos / Inactivos
- Personas Naturales
- Empresas

---

### 2. Proveedores (CRUD + Productos)

#### Características:
- **Proveedor Default Protegido:**
  - Nombre: "Empresa del cliente AFLOW"
  - No eliminable
  - Edición parcial permitida
  - Contiene servicios internos

- **Lógica idéntica a Contratantes:**
  - Detección automática por RUT
  - Formulario dinámico Persona Natural/Empresa

- **Gestión de Productos:**
  - CRUD de productos por proveedor
  - Campos: Nombre, Descripción, Valor interno, Unidad de medida, Código SKU
  - Estados: Activo / Inactivo

#### Indicadores:
- Total Proveedores
- Activos / Inactivos
- Personas Naturales / Empresas
- **Total Productos** (suma de todos los proveedores)

---

### 3. Servicios (CRUD + Packs)

#### Tab 1: Servicios Individuales
- **Campos:**
  - Nombre del servicio
  - Descripción
  - Valor base (CLP)
  - Código
  - Categoría
  - Unidad de medida (UN, M2, M3, ML, KG, HR, etc.)
  - Estado

- **Vista:** Tabla con ordenamiento y acciones rápidas

#### Tab 2: Packs de Servicios
- **Objetivo:** Agrupaciones reutilizables de servicios/productos
- **Características:**
  - Asociar múltiples servicios
  - Asociar múltiples productos
  - Cálculo automático de valor total
  - Vista de tarjetas (cards) con detalle

- **Vista:** Grid de tarjetas responsive con:
  - Nombre y descripción del pack
  - Cantidad de items incluidos
  - Valor total calculado
  - Estado del pack

#### Indicadores:
- Total Servicios / Total Packs
- Activos / Inactivos (por cada tab)

---

## 💻 Stack Técnico

### Frontend
- **Next.js 15** (App Router)
- **React 18** (Client Components)
- **TypeScript 5** (Strict mode)
- **Tailwind CSS 3** (Utility-first)
- **Shadcn/UI** (Component library)
- **Radix UI** (Primitives)

### Gestión de Estado
- **React Query v5** (TanStack Query)
  - Cache: 60 segundos
  - Retry: 1 intento
  - RefetchOnWindowFocus: false

### Validación
- **Zod v3.25.76** (Schema validation)
- **React Hook Form v7.68.0** (Form state)
- **@hookform/resolvers** (Zod integration)

### UI/UX
- **Lucide React** (Iconografía consistente)
- **Sonner** (Toast notifications)
- **Framer Motion** (Animaciones - opcional)

---

## 📊 Sistema de Tipos

### Tipos Base
```typescript
type TipoPersona = "persona-natural" | "empresa";
type EstadoRegistro = "Activo" | "Inactivo";
type UnidadMedida = "UN" | "M2" | "M3" | "ML" | "KG" | "HR" | "GL" | "DIA";
```

### Filtros (Actualizado v1.1)
```typescript
// IMPORTANTE: Usar "all" en lugar de "" para compatibilidad con Radix UI Select
interface ContratanteFilters {
  busqueda: string;
  tipoPersona: TipoPersona | "all";  // ⚠️ Cambio crítico
  estado: EstadoRegistro | "all";    // ⚠️ Cambio crítico
}

interface ProveedorFilters {
  busqueda: string;
  tipoPersona: TipoPersona | "all";
  estado: EstadoRegistro | "all";
  esProveedorDefault?: boolean;
}

interface ServicioFilters {
  busqueda: string;
  categoria: string;
  estado: EstadoRegistro | "all";
}
```

**Razón del cambio:** Radix UI Select requiere que `<SelectItem value="">` no use cadenas vacías. 
Usar `"all"` resuelve el error runtime: _"A <Select.Item /> must have a value prop that is not an empty string"_.

### Entidades Principales
- **Contratante:** PersonaNatural | Empresa (discriminated union)
- **Proveedor:** ProveedorPersonaNatural | ProveedorEmpresa
- **Direccion:** Dirección completa con cascada Región → Ciudad → Comuna
- **Producto:** Vinculado a proveedor con SKU y precio interno
- **Servicio:** Servicio individual con precio base
- **PackServicio:** Agrupación de servicios/productos

### Helpers
```typescript
getDisplayName(entidad): string
getDireccionCompleta(direccion): string
isPersonaNatural(entidad): boolean
isEmpresa(entidad): boolean
```

---

## 🎨 Patrones de Diseño Aplicados

### 1. Navegación
- **Sidebar principal:** Icono `Briefcase` + "Maestro de Negocio"
- **Tabs horizontales:** Contratantes | Proveedores | Servicios
- **Breadcrumb visual:** Título del módulo + tabs activas

### 2. Tablas (BudgetTableEnhanced Pattern)
- Ordenamiento por columna con indicadores visuales
- Sticky actions column (derecha con sombra)
- Responsive con `ScrollArea`
- Estados vacíos informativos
- Loading skeleton durante fetch

### 3. Formularios (ClienteForm Pattern)
- Detección automática de tipo
- Validación en tiempo real
- Toast notifications con contexto
- Campos condicionales sin recarga
- Separators para secciones visuales

### 4. Indicadores (Dashboard Cards)
- Grid responsive (2/3/5 columnas)
- Icono circular con gradiente
- Click para filtrado rápido
- Badge de "filtro activo"

### 5. Colores del Sistema
```css
/* Primary Actions - Contratantes */
bg-[#244F82]  /* Azul AFLOW - Color principal de botones y acciones */
hover:bg-[#1a3a5f]  /* Azul oscuro - Hover state */

/* Primary Actions - Otros módulos (Proveedores, Servicios) */
bg-[#FF7A00]  /* Naranja AFLOW */
hover:bg-[#FF7A00]/90

/* Estados */
green-500/100  /* Activo */
gray-500/100   /* Inactivo */
purple-500/50  /* Persona Natural */
orange-500/50  /* Empresa */
blue-500/50    /* Default/Principal */

/* Destacados y acentos */
text-blue-600/700  /* Indicadores y textos destacados */
bg-blue-50/100     /* Fondos informativos y badges */
border-blue-200    /* Bordes de elementos informativos */
```

**Esquema de colores por módulo:**
- **Contratantes:** Azul (`#244F82`) como color principal
- **Proveedores:** Naranja (`#FF7A00`) como color principal  
- **Servicios:** Naranja (`#FF7A00`) como color principal

---

## 🔄 Integración con React Query

### QueryKeys
```typescript
["contratantes"]           // Lista completa
["contratantes", id]       // Detalle individual
["proveedores"]
["servicios"]
["packs"]
["productos", proveedorId]
```

### Mutations
```typescript
createContratante  // POST con optimistic update
updateContratante  // PUT con invalidation
deleteContratante  // Soft delete (cambiar estado)
```

### Invalidation Strategy
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["contratantes"] });
  toast.success("Operación exitosa");
}
```

---

## 🧪 Datos Mock

### Contratantes (3 registros)
1. **Constructora Los Andes SpA** (Empresa - 76.543.210-5)
   - 2 sucursales: Casa Matriz (Las Condes), Sucursal Sur (La Florida)
   - Estado: Activo

2. **Juan Carlos Pérez Soto** (Persona Natural - 12.345.678-9)
   - 1 sucursal: Domicilio Particular (Viña del Mar)
   - Estado: Activo

3. **Inmobiliaria Del Mar Limitada** (Empresa - 88.888.888-8)
   - 1 sucursal: Oficina Central (Reñaca)
   - Estado: Inactivo

### Proveedores (3 registros)
1. **Empresa del cliente AFLOW** (Default - 77.777.777-7)
   - 2 productos: Consultoría Senior ($75.000/HR), Desarrollo Frontend ($55.000/HR)
   - Flag: `esProveedorDefault: true`

2. **Ferretería Industrial Ltda** (Empresa - 79.123.456-7)
   - 2 productos: Cemento Portland ($8.500/UN), Fierro 8mm ($4.200/UN)

3. **Ana María Soto Fernández** (Persona Natural - 16.789.012-3)
   - 1 producto: Diseño Arquitectónico ($65.000/HR)

### Servicios (6 registros)
- Instalación Eléctrica Básica ($850.000)
- Gasfitería Residencial ($650.000)
- Pintura Interior ($12.000/M2)
- Instalación Piso Flotante ($18.000/M2)
- Diseño Arquitectónico Premium ($2.500.000)
- Impermeabilización ($15.000/M2 - Inactivo)

### Packs (2 registros)
1. **Pack Remodelación Básica** ($2.090.000)
   - 3 servicios: Pintura 60m2 + Piso 40m2 + Gasfitería

2. **Pack Construcción Completa** ($7.000.000)
   - 3 servicios + 1 producto: Diseño + Eléctrica + Gasfitería + Consultoría 40hrs

---

## 🚀 Cómo Usar

### Navegación
1. Desde el sidebar principal → "Maestro de Negocio"
2. Usar tabs para alternar: Contratantes | Proveedores | Servicios

### Crear Contratante
1. Click en "Nuevo Contratante" (botón naranja)
2. Ingresar RUT → Detección automática de tipo
3. Completar campos condicionales:
   - **Si < 70M:** Nombres + Apellidos
   - **Si ≥ 70M:** Razón Social + Giro
4. Ingresar Email + Teléfono + Estado
5. Guardar → Toast de confirmación

### Gestionar Direcciones
1. En tabla de contratantes → Click en botón "Direcciones" (icono MapPin)
2. Modal muestra lista de direcciones activas
3. "Nueva Dirección" → Formulario con cascada Región/Ciudad/Comuna
4. Marcar dirección como "Principal" (⭐)
5. Soft delete: Desactivar en lugar de eliminar

### Gestionar Proveedores
1. Tab "Proveedores" → Mismo flujo que Contratantes
2. **IMPORTANTE:** Proveedor default NO se puede eliminar
3. Click en "Productos" (badge) → Ver/editar productos del proveedor

### Crear Pack de Servicios
1. Tab "Servicios" → Sub-tab "Packs"
2. "Nuevo Pack" → Selector multi-select de servicios/productos
3. Asignar cantidades → Cálculo automático de total
4. Guardar → Disponible para uso en presupuestos

---

## ⚠️ Reglas de Negocio Críticas

### 1. Proveedor Default
```typescript
if (proveedor.esProveedorDefault && action === "delete") {
  throw new Error("No se puede eliminar el proveedor default");
}
```

### 2. Validación de RUT
```typescript
// Modulo 11 algorithm
validateRut(rut: string): boolean {
  // Limpia formato → Calcula DV → Compara
}
```

### 3. Dirección Principal Única
```typescript
if (nuevaDireccion.esPrincipal) {
  contratante.direcciones.forEach(d => d.esPrincipal = false);
  nuevaDireccion.esPrincipal = true;
}
```

### 4. Soft Delete Universal
```typescript
// NO eliminar físicamente - cambiar estado
async function deleteEntity(id: string) {
  entity.estado = "Inactivo";
  entity.fechaActualizacion = new Date();
}
```

---

## 🔮 Roadmap Futuro

### Fase 2: Integración Backend (Q1 2026)
- [ ] Migrar de mock data a API REST/GraphQL
- [ ] Integración con Supabase (cliente ya existente en proyecto)
- [ ] Autenticación y permisos por rol
- [ ] Audit trail (quién modificó qué y cuándo)

### Fase 3: Funcionalidades Avanzadas (Q2 2026)
- [ ] Exportar a Excel/PDF (contratantes, proveedores)
- [ ] Importación masiva desde CSV
- [ ] Historial de cambios por entidad
- [ ] Búsqueda avanzada con operadores (AND/OR)
- [ ] Etiquetas/Tags personalizados

### Fase 4: Integraciones (Q3 2026)
- [ ] Sincronización bidireccional con módulo Presupuesto
- [ ] API pública para terceros
- [ ] Webhooks para eventos (nuevo contratante, cambio de estado)
- [ ] Integración con ERP externo

---

## 📖 Guía de Mantenimiento

### Agregar Nuevo Tipo de Entidad
1. **Definir tipos** en `types/maestroNegocio.ts`
2. **Crear servicio** en `api/maestroService.ts` con mock data
3. **Crear hook** en `[entidad]/hooks/use[Entidad].ts`
4. **Crear componentes** (tabla, filtros, indicadores, modal)
5. **Crear página** en `[entidad]/page.tsx`
6. **Agregar tab** en `layout.tsx`

### Migrar a API Real
```typescript
// Antes (mock):
export async function fetchContratantes(): Promise<Contratante[]> {
  await simulateDelay(1000);
  return [...MOCK_CONTRATANTES];
}

// Después (API):
export async function fetchContratantes(): Promise<Contratante[]> {
  const response = await fetch("/api/maestro/contratantes");
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}
```

### Agregar Validación Custom
```typescript
// En modal de entidad
const schema = z.object({
  ...
}).refine(
  (data) => customValidationLogic(data),
  {
    message: "Error message",
    path: ["fieldName"],
  }
);
```

### Implementar Nuevos Filtros
```typescript
// ⚠️ IMPORTANTE: Usar "all" para valor por defecto, NO ""
const [filters, setFilters] = useState<EntityFilters>({
  busqueda: "",
  tipoPersona: "all",  // ✅ Correcto
  estado: "all",       // ✅ Correcto
});

// En la lógica de filtrado
const matchesTipo = 
  filters.tipoPersona === "all" ||  // ✅ Correcto
  entity.tipoPersona === filters.tipoPersona;

// En SelectItem
<SelectItem value="all">Todos</SelectItem>  {/* ✅ Correcto */}
<SelectItem value="">Todos</SelectItem>     {/* ❌ Error runtime */}
```

---

## 🐛 Troubleshooting

### Problema: "RUT inválido" en formulario
**Solución:** Verificar que `validateRut()` en `lib/utils.ts` implemente correctamente modulo 11

### Problema: Error "A <Select.Item /> must have a value prop that is not an empty string"
**Solución:** ✅ **RESUELTO en v1.1**  
- Todos los filtros ahora usan `"all"` en lugar de `""` como valor por defecto
- Archivos actualizados:
  - `types/maestroNegocio.ts` - Interfaces de filtros
  - `contratantes/hooks/useContratantes.ts` - Lógica de filtrado
  - `proveedores/hooks/useProveedores.ts` - Lógica de filtrado
  - `contratantes/components/Filters.tsx` - SelectItems
  - `proveedores/page.tsx` - SelectItems
  - `servicios/page.tsx` - SelectItems

### Problema: Direcciones no se guardan
**Solución:** Verificar que el contratante exista en el array antes de agregar dirección

### Problema: Filtros no funcionan
**Solución:** 
- Revisar que el hook `use[Entidad]` esté siendo llamado con datos válidos
- Verificar que la comparación use `filters.estado === "all"` y no `!filters.estado`

### Problema: Modal no cierra después de guardar
**Solución:** Verificar que `onOpenChange(false)` se llame en el callback de éxito de la mutación

---

## 📚 Referencias

### Módulos del Proyecto Usados como Referencia
- [app/portal/presupuesto/crear](app/portal/presupuesto/crear) - Patrón de formulario dinámico
- [app/portal/presupuesto/components/BudgetTableEnhanced.tsx](app/portal/presupuesto/components/BudgetTableEnhanced.tsx) - Patrón de tabla
- [app/portal/ajustes-aflow](app/portal/ajustes-aflow) - Patrón de navegación por tabs

### Documentación Externa
- [Next.js 15 App Router](https://nextjs.org/docs)
- [React Query v5](https://tanstack.com/query/latest)
- [Zod Schema Validation](https://zod.dev/)
- [Shadcn/UI Components](https://ui.shadcn.com/)

---

## 👥 Créditos

**Diseño y Arquitectura:** Siguiendo estándares existentes del Portal AFLOW  
**Implementación:** GitHub Copilot + Claude Sonnet 4.5  
**Fecha inicial:** 15 de diciembre de 2025  
**Última actualización:** 21 de diciembre de 2025  
**Versión:** 1.2.0 (Production-ready con mock data)

### Changelog v1.2 (21-Dic-2025)
- ✅ **Establecido azul `#244F82` como color principal para módulo Contratantes**
- ✅ Actualizado esquema de colores en todos los componentes:
  - Botones de acción primaria
  - Indicadores y badges
  - Elementos informativos y acentos
  - Estados de hover y activo
- ✅ Documentación actualizada y verificada
- ✅ README sincronizado con estado actual del proyecto
- ✅ Módulo completamente operacional y estable
- ✅ Preparado para integración con backend real

### Changelog v1.1 (16-Dic-2025)
- ✅ Corregido error runtime de Radix UI Select (valores vacíos → "all")
- ✅ Actualizada lógica de filtrado en todos los hooks
- ✅ Build de producción exitoso sin errores
- ✅ TypeScript strict mode sin warnings
- ✅ ESLint clean (0 errores, 0 warnings)

---

## 📄 Licencia

Este módulo es parte del Portal AFLOW y está sujeto a la misma licencia del proyecto principal.

---

**Nota Final:** Este módulo está **100% operativo** con datos mock y listo para migración a backend real. Todos los patrones, componentes y validaciones son producción-ready y siguen los estándares establecidos en el proyecto AFLOW.
