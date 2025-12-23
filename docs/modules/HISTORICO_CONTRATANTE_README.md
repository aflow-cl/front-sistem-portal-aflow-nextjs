# Módulo Histórico de Contratantes - Portal AFLOW

## 📋 Resumen Ejecutivo

El módulo **Histórico de Contratantes** es una solución completa de consulta y análisis de presupuestos históricos para el Portal AFLOW. Proporciona una vista integral de todos los presupuestos generados, con capacidades avanzadas de filtrado, búsqueda, estadísticas en tiempo real y exportación de datos, siguiendo los patrones arquitectónicos y UX/UI establecidos en el proyecto.

### Estado de Implementación: ✅ COMPLETO (v1.0 - Producción)

**Fecha de implementación:** Diciembre 2025  
**Última actualización:** 22 de diciembre de 2025  
**Framework:** Next.js 15 (App Router)  
**Estado:** Listo para producción con datos mock  
**Build Status:** ✅ Exitoso  
**Ruta de acceso:** `/portal/historico-contratante`

---

## 🎯 Objetivos Cumplidos

✅ **Vista Completa de Histórico:** Acceso a todos los presupuestos del sistema  
✅ **Filtros Avanzados:** Búsqueda por múltiples criterios (estado, fecha, monto, contratante)  
✅ **Indicadores en Tiempo Real:** Estadísticas dinámicas basadas en filtros activos  
✅ **Ordenamiento Flexible:** Columnas ordenables (folio, fecha, monto, estado)  
✅ **Acciones por Registro:** Ver detalle, descargar PDF, compartir link  
✅ **Diseño Responsive:** Experiencia optimizada en móvil y escritorio  
✅ **Integración con React Query:** Caché y sincronización automática  
✅ **Preparado para Export:** Estructura lista para exportación Excel/PDF (roadmap)

---

## 🏗️ Arquitectura del Módulo

### Estructura de Directorios

```
app/portal/historico-contratante/
├── layout.tsx                    # Layout con título y breadcrumbs
├── page.tsx                      # Página principal con filtros e indicadores
├── types/
│   └── historico.ts             # Sistema de tipos TypeScript completo
├── api/
│   └── historicoService.ts      # Capa de servicios con mock data
├── hooks/
│   └── useHistoricoContratante.ts # Hook personalizado para filtros y stats
└── components/
    ├── Indicators.tsx           # Indicadores estadísticos (KPIs)
    ├── HistoricoTable.tsx       # Tabla con ordenamiento y acciones
    └── AdvancedFilters.tsx      # Panel de filtros avanzados
```

---

## 🔑 Funcionalidades Principales

### 1. Vista de Histórico

#### Características Principales:
- **Listado completo** de todos los presupuestos generados
- **Actualización en tiempo real** mediante React Query
- **Paginación virtual** (preparada para grandes volúmenes)
- **Estados múltiples:** Borrador, Pendiente, Aprobado, Rechazado, En Proceso, Finalizado, Cancelado

#### Columnas de la Tabla:
- **Folio:** Identificador único del presupuesto (ej: `PRES-2024-0001`)
- **Contratante:** Nombre y RUT del cliente
- **Período:** Fecha inicio - Fecha fin
- **Estado:** Badge visual con color por estado
- **Montos:** Neto, IVA y Total
- **Acciones:** Ver, Descargar, Compartir

---

### 2. Sistema de Filtros Avanzados

#### Filtros Disponibles:

##### 📝 Búsqueda General
- Busca en: Folio, Nombre de Contratante, RUT
- Búsqueda en tiempo real (debounce automático)

##### 🎨 Filtro por Estado
- Todos (por defecto)
- Borrador
- Pendiente
- Aprobado
- Rechazado
- En Proceso
- Finalizado
- Cancelado

##### 👤 Filtro por Contratante
- Dropdown con todos los contratantes del sistema
- Opción "Todos los contratantes" (por defecto)

##### 📅 Rango de Fechas
- **Desde:** Fecha inicio mínima
- **Hasta:** Fecha inicio máxima
- Validación: "Hasta" no puede ser menor que "Desde"

##### 💰 Rango de Montos
- **Monto Mínimo:** Filtro de total >= valor
- **Monto Máximo:** Filtro de total <= valor
- Formato automático de moneda (separadores de miles)

##### 🔄 Ordenamiento
- **Ordenar por:**
  - Folio (alfabético)
  - Fecha (cronológico)
  - Monto (numérico)
  - Estado (alfabético)
- **Dirección:** Ascendente / Descendente

#### Gestión de Filtros:
- **Botón "Limpiar Filtros":** Resetea todos los filtros al estado inicial
- **Contador de filtros activos:** Muestra cantidad de filtros aplicados
- **Persistencia visual:** Indicador visual cuando hay filtros activos

---

### 3. Indicadores Estadísticos (KPIs)

Los indicadores se **recalculan automáticamente** según los filtros aplicados:

#### Indicadores Disponibles:

##### 📊 Total de Presupuestos
- Cantidad de registros que cumplen los filtros actuales
- Indicador visual: Icono de documento

##### 💵 Total Neto
- Suma de montos netos filtrados
- Formato: CLP con separadores de miles

##### 🧾 Total IVA
- Suma de IVA de presupuestos filtrados
- Formato: CLP con separadores de miles

##### 💰 Total General
- Suma de totales (Neto + IVA) filtrados
- Formato: CLP con separadores de miles
- Destacado con color primario

##### 📈 Promedio por Presupuesto
- Cálculo: Total General / Cantidad de presupuestos
- Formato: CLP con separadores de miles

##### 🎯 Distribución por Estado
- Contadores individuales por cada estado
- Vista rápida de la composición del portafolio

**Nota:** Los indicadores se actualizan instantáneamente al modificar cualquier filtro.

---

### 4. Acciones por Presupuesto

Cada registro en la tabla incluye botones de acción:

#### Ver Detalle (Ícono Ojo)
- Redirige a `/portal/presupuesto/consultar?id={presupuestoId}`
- Muestra información completa del presupuesto

#### Descargar PDF (Ícono Download)
- Descarga documento del presupuesto
- Actualmente simula descarga (mock)
- **Roadmap:** Generación real de PDF con plantilla corporativa

#### Compartir Link (Ícono Share)
- Copia enlace al portapapeles
- Notificación toast de confirmación
- Link formato: `https://portal.aflow.cl/presupuestos/{id}`

---

## 📊 Sistema de Tipos TypeScript

### Tipo Principal: `PresupuestoHistorico`

```typescript
export interface PresupuestoHistorico {
  id: string;
  folio: string;
  contratante: {
    id: string;
    nombre: string;
    rut: string;
  };
  fechaInicio: string;       // ISO date string
  fechaFin?: string;          // ISO date string (opcional)
  estado: EstadoPresupuesto;
  neto: number;
  iva: number;
  total: number;
  documentoUrl?: string;
  linkCompartir?: string;
  observaciones?: string;
  creadoPor?: string;
  fechaCreacion?: string;
  ultimaModificacion?: string;
}
```

### Tipo de Estados

```typescript
export type EstadoPresupuesto = 
  | "Borrador" 
  | "Pendiente" 
  | "Aprobado" 
  | "Rechazado" 
  | "En Proceso"
  | "Finalizado"
  | "Cancelado";
```

### Tipo de Filtros

```typescript
export interface HistoricoFilters {
  busqueda: string;
  estado: EstadoPresupuesto | "all";
  contratanteId: string;
  fechaDesde?: string;
  fechaHasta?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  ordenarPor: "folio" | "fecha" | "monto" | "estado";
  ordenDireccion: "asc" | "desc";
}
```

### Tipo de Estadísticas

```typescript
export interface HistoricoStats {
  total: number;
  totalNeto: number;
  totalIva: number;
  totalGeneral: number;
  porEstado: Record<EstadoPresupuesto, number>;
  promedioMonto: number;
}
```

---

## 🎨 Configuración de Estados (UX/UI)

Cada estado tiene su configuración visual definida en `ESTADO_PRESUPUESTO_CONFIG`:

| Estado | Color Badge | Borde | Icono |
|--------|-------------|-------|-------|
| **Borrador** | Gris | `border-gray-300` | FileEdit |
| **Pendiente** | Amarillo | `border-yellow-300` | Clock |
| **Aprobado** | Verde | `border-green-300` | CheckCircle2 |
| **Rechazado** | Rojo | `border-red-300` | XCircle |
| **En Proceso** | Azul | `border-blue-300` | RefreshCw |
| **Finalizado** | Esmeralda | `border-emerald-300` | CheckCheck |
| **Cancelado** | Naranja | `border-orange-300` | Ban |

---

## 💾 Mock Data

### Cantidad de Registros
- **15 presupuestos históricos** con datos realistas
- Variedad de estados y montos
- Múltiples contratantes (3 empresas diferentes)
- Rango temporal: Enero 2024 - Diciembre 2024

### Características del Mock:
- **Folios secuenciales:** `PRES-2024-0001` a `PRES-2024-0060`
- **Contratantes:**
  - Constructora Los Andes S.A. (76.123.456-7)
  - Inmobiliaria Central (77.654.321-8)
  - Edificaciones Modernas Ltda. (78.987.654-3)
- **Montos variados:** Desde $2.5M hasta $45M
- **Distribución de estados:**
  - Finalizados: 4
  - Aprobados: 3
  - En Proceso: 3
  - Pendientes: 2
  - Borradores: 2
  - Rechazado: 1

---

## 🔧 Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 15** | App Router, Server Components |
| **TypeScript** | Sistema de tipos completo |
| **React Query** | Gestión de estado y caché |
| **shadcn/ui** | Componentes UI (Table, Select, Input, Badge, Button) |
| **Lucide Icons** | Iconografía (Search, Filter, Download, Share, Eye, X) |
| **Sonner** | Sistema de notificaciones toast |
| **date-fns** | Manipulación y formateo de fechas |
| **Tailwind CSS** | Estilos y diseño responsive |

---

## 🎭 Patrones de Diseño Aplicados

### 1. Custom Hook Pattern
- `useHistoricoContratante()` encapsula lógica de filtros y estadísticas
- Separación de concerns: UI vs. Lógica de negocio
- Reutilizable y testeable

### 2. Presentational vs. Container Components
- **Containers:** `page.tsx` (orquestación)
- **Presentational:** `Indicators.tsx`, `HistoricoTable.tsx`, `AdvancedFilters.tsx`

### 3. Service Layer Pattern
- `historicoService.ts` abstrae llamadas API
- Fácil migración de mock a backend real

### 4. Optimistic Updates
- Preparado para mutaciones optimistas con React Query
- `queryKey: ["historico-presupuestos"]`

---

## 🧪 Funcionalidades del Custom Hook

### `useHistoricoContratante(presupuestos)`

#### Entrada:
- `presupuestos: PresupuestoHistorico[]` - Array de presupuestos desde React Query

#### Estado Manejado:
- `filters: HistoricoFilters` - Estado de todos los filtros
- Valores iniciales configurados para mejor UX

#### Funciones Retornadas:

```typescript
return {
  filters,                          // Estado actual de filtros
  setFilters,                       // Actualizar filtros
  filteredAndSortedPresupuestos,    // Array filtrado y ordenado
  clearFilters,                     // Resetear todos los filtros
  hasActiveFilters,                 // Boolean: ¿Hay filtros activos?
  estadisticas,                     // KPIs calculados
  contratantesUnicos                // Lista de contratantes para dropdown
};
```

#### Lógica de Filtrado:
1. **Búsqueda:** Busca en folio, nombre contratante, RUT (case-insensitive)
2. **Estado:** Filtra por estado exacto (si no es "all")
3. **Contratante:** Filtra por ID de contratante (si no es "all")
4. **Rango de fechas:** Inclusivo en ambos extremos
5. **Rango de montos:** Filtra por total del presupuesto
6. **Ordenamiento:** Aplicado después de filtros

#### Cálculo de Estadísticas:
- Se ejecuta sobre el array **ya filtrado**
- Actualización automática en cada cambio de filtro
- Performance optimizada con memoización

---

## 📱 Responsive Design

### Breakpoints:

#### Mobile (< 768px)
- Filtros en accordion colapsable
- Tabla con scroll horizontal
- Indicadores apilados verticalmente
- Botones de acción simplificados

#### Tablet (768px - 1024px)
- Filtros en 2 columnas
- Tabla visible completa
- Indicadores en 2 filas

#### Desktop (> 1024px)
- Layout completo con filtros a la izquierda
- Tabla con todas las columnas visibles
- Indicadores en fila horizontal (5 columnas)

---

## 🔗 Integración con Otros Módulos

### Presupuesto (Consultar)
- Botón "Ver Detalle" redirige a `/portal/presupuesto/consultar?id={id}`
- Parámetro de query string con ID del presupuesto

### Maestro de Negocio (Contratantes)
- Carga lista de contratantes para filtro dropdown
- Muestra nombre y RUT en tabla

### Dashboard Principal
- Potencial integración: Widget de últimos presupuestos
- Gráfico de evolución temporal (roadmap)

---

## 🚀 Migración a API Real

### Endpoint Propuesto:

```typescript
// GET /api/presupuestos/historico
// Query params opcionales:
// - busqueda: string
// - estado: EstadoPresupuesto
// - contratanteId: string
// - fechaDesde: ISO date
// - fechaHasta: ISO date
// - montoMin: number
// - montoMax: number
// - ordenarPor: string
// - ordenDireccion: "asc" | "desc"
// - page: number
// - limit: number

export async function fetchHistoricoPresupuestos(
  params?: HistoricoFilters & { page?: number; limit?: number }
): Promise<{
  data: PresupuestoHistorico[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/presupuestos/historico?${queryString}`);
  return response.json();
}
```

### Pasos de Migración:

1. **Reemplazar mock en `historicoService.ts`:**
   ```typescript
   // Cambiar:
   export async function fetchHistoricoPresupuestos() {
     await delay(800);
     return mockHistorico;
   }
   
   // Por:
   export async function fetchHistoricoPresupuestos(filters?: HistoricoFilters) {
     const response = await fetch('/api/presupuestos/historico', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(filters)
     });
     return response.json();
   }
   ```

2. **Mover filtrado al backend:**
   - Filtros aplicados en SQL/ORM
   - Paginación server-side
   - Ordenamiento en query

3. **Actualizar React Query:**
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ["historico-presupuestos", filters],
     queryFn: () => fetchHistoricoPresupuestos(filters),
     keepPreviousData: true
   });
   ```

4. **Implementar exportación real:**
   - Endpoint: `GET /api/presupuestos/historico/export?format=excel|pdf`
   - Generación de Excel con `exceljs`
   - Generación de PDF con `pdfmake` o `react-pdf`

---

## 🐛 Troubleshooting

### Problema: Filtros no actualizan la tabla
**Solución:** Verificar que `setFilters` está actualizando el estado correctamente. Revisar React DevTools.

### Problema: Indicadores muestran valores incorrectos
**Solución:** Los indicadores se calculan sobre `filteredAndSortedPresupuestos`. Verificar lógica de filtrado en el hook.

### Problema: Ordenamiento no funciona
**Solución:** Revisar que `ordenarPor` y `ordenDireccion` estén en el estado de filtros y que la función de ordenamiento maneje todos los casos.

### Problema: Fechas no se filtran correctamente
**Solución:** Asegurar que las fechas están en formato ISO string y que la comparación usa `new Date()`.

### Problema: Export Excel/PDF no disponible
**Solución:** Esta funcionalidad está en roadmap (Phase 2). Actualmente muestra toast de "Funcionalidad próximamente".

---

## 📈 Roadmap (Futuras Mejoras)

### Phase 2: Exportación
- ✅ Implementación de estructura base
- 🔄 Exportación a Excel (formato XLSX)
- 🔄 Exportación a PDF con plantilla corporativa
- 🔄 Exportación con filtros aplicados

### Phase 3: Analytics Avanzados
- 📊 Gráfico de evolución temporal de montos
- 📊 Gráfico de distribución por estado (pie chart)
- 📊 Comparativa entre períodos
- 📊 Top 10 contratantes por volumen

### Phase 4: Notificaciones
- 🔔 Alertas de presupuestos próximos a vencer
- 🔔 Recordatorios de seguimiento
- 🔔 Notificaciones de cambios de estado

### Phase 5: Colaboración
- 👥 Comentarios en presupuestos
- 👥 Asignación de responsables
- 👥 Historial de actividad (audit trail)

---

## 📚 Ejemplos de Uso

### Buscar presupuestos finalizados de un contratante específico

1. En el filtro "Contratante", seleccionar "Constructora Los Andes S.A."
2. En el filtro "Estado", seleccionar "Finalizado"
3. Ver resultados filtrados en la tabla
4. Los indicadores muestran solo estadísticas de registros filtrados

### Exportar presupuestos de un rango de fechas (Roadmap)

1. Establecer "Desde": 01/01/2024
2. Establecer "Hasta": 31/03/2024
3. Hacer clic en botón "Exportar a Excel"
4. Descargar archivo `presupuestos_Q1_2024.xlsx`

### Ver presupuestos con monto superior a $20M

1. En "Monto Mínimo", escribir: 20000000
2. Ver tabla filtrada automáticamente
3. Indicadores muestran solo presupuestos >= $20M

---

## 🔐 Consideraciones de Seguridad

### Control de Acceso
- **Requisito:** Usuario autenticado con rol adecuado
- **Middleware:** Protección en `layout.tsx`
- **Scope:** Solo presupuestos de contratantes asociados al usuario

### Datos Sensibles
- **RUT:** Enmascaramiento opcional (configurable por empresa)
- **Montos:** Visibles solo con permisos de "Ver Información Financiera"
- **Documentos:** URLs firmadas con expiración (S3 presigned URLs)

### Audit Trail
- **Acción de consulta:** Registro en log de auditoría
- **Filtros aplicados:** Guardar en historial de usuario
- **Exportaciones:** Registrar quién exportó y cuándo

---

## 📝 Notas Técnicas

### Performance
- **React Query Cache:** 5 minutos (staleTime configurable)
- **Debounce en búsqueda:** 300ms
- **Virtual Scrolling:** Preparado para implementar con `react-window` si > 1000 registros

### Accesibilidad
- **Aria Labels:** En todos los botones de acción
- **Keyboard Navigation:** Tab, Enter, Space funcionales
- **Screen Readers:** Anuncios de cambios en indicadores

### SEO
- **Metadata:** Título y descripción en `layout.tsx`
- **Breadcrumbs:** Implementados con schema.org

---

## ✅ Checklist de Implementación

- [x] Estructura de archivos y carpetas
- [x] Sistema de tipos TypeScript completo
- [x] Mock data con 15+ registros variados
- [x] Servicio API con async/await
- [x] Custom hook con lógica de filtros
- [x] Componente Indicators con KPIs
- [x] Componente HistoricoTable con ordenamiento
- [x] Componente AdvancedFilters completo
- [x] Integración con React Query
- [x] Diseño responsive (mobile, tablet, desktop)
- [x] Validaciones de formulario (rangos de fecha/monto)
- [x] Sistema de notificaciones (toast)
- [x] Acciones por registro (Ver, Descargar, Compartir)
- [x] Limpiar filtros con un click
- [x] Contador de filtros activos
- [x] Build exitoso sin errores
- [ ] Exportación a Excel (roadmap)
- [ ] Exportación a PDF (roadmap)
- [ ] Gráficos analytics (roadmap)

---

## 📞 Soporte y Contacto

Para dudas sobre este módulo:
- **Documentación general:** Ver [README.md](../../README.md) principal
- **Módulo Presupuesto:** Ver [PRESUPUESTO_MODULE_README.md](./PRESUPUESTO_MODULE_README.md)
- **Maestro de Negocio:** Ver [MAESTRO_NEGOCIO_README.md](./MAESTRO_NEGOCIO_README.md)
- **Guía Migración API:** Ver [API_MIGRATION_GUIDE.md](../guides/API_MIGRATION_GUIDE.md)

---

## 📄 Changelog

### v1.0 - 22 de diciembre de 2025
- ✅ Implementación inicial completa
- ✅ Filtros avanzados con 7 criterios diferentes
- ✅ Indicadores dinámicos en tiempo real
- ✅ Integración con React Query
- ✅ Diseño responsive completo
- ✅ 15 presupuestos mock para desarrollo
- ✅ Documentación completa
- ✅ Build exitoso sin warnings

---

**Estado del módulo:** ✅ Listo para Producción  
**Próxima revisión:** Migración a API real (Enero 2026)  
**Responsable:** Equipo AFLOW Development
