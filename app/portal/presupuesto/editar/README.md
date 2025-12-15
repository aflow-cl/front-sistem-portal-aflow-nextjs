# Módulo de Edición de Presupuestos

## 📋 Descripción General

Módulo completo de edición de presupuestos que se activa desde la tabla de consulta de presupuestos ([BudgetTableEnhanced.tsx](../components/BudgetTableEnhanced.tsx)). Permite visualizar, editar, duplicar y gestionar presupuestos existentes con funcionalidades avanzadas de historial y notas internas.

## 🚀 Características Implementadas

### 1. Navegación desde Tabla
- **Click en fila completa**: Redirige al módulo de edición
- **Menú contextual "Editar"**: Navegación alternativa con feedback visual
- **Ruta dinámica**: `/portal/presupuesto/editar/[budgetId]`

### 2. Header del Presupuesto ([EditBudgetHeader.tsx](components/EditBudgetHeader.tsx))
- **Información contextual**:
  - Título "Editar Presupuesto"
  - Folio del presupuesto
  - Badge de estado (con colores semánticos)
  - Fecha de creación y autor
  - Indicador visual de cambios sin guardar

- **Acciones disponibles**:
  - 🔗 **Copiar link**: Copia URL de visualización pública al portapapeles
  - 📄 **Duplicar**: Abre modal de confirmación para crear copia
  - ✖️ **Cancelar**: Vuelve atrás (con confirmación si hay cambios)
  - 💾 **Guardar cambios**: Persiste las modificaciones (deshabilitado si no hay cambios)

### 3. Visualización de Datos con Tabs
La página principal muestra tres pestañas con información completa:

#### **Tab General**
- Folio (read-only)
- Estado actual
- Fecha de creación y cierre
- Autor del presupuesto
- Proyecto asociado
- Descripción completa

#### **Tab Cliente**
- Razón Social
- RUT y Giro comercial
- Dirección completa
- Ciudad y Región
- Datos de contacto (email, teléfono)

#### **Tab Ítems**
- Lista de productos/servicios cotizados
- Desglose por ítem:
  - Producto y descripción
  - Cantidad y unidad de medida
  - Precio unitario
  - Porcentajes de IVA y utilidad
  - Total calculado
- **Resumen financiero**:
  - Subtotal (Neto)
  - IVA desglosado
  - Total general destacado

### 4. Historial del Presupuesto ([BudgetHistoryTimeline.tsx](components/BudgetHistoryTimeline.tsx))

Timeline vertical con audit log profesional:

- **Eventos rastreados**:
  - ✏️ Creación del presupuesto
  - 📝 Modificaciones
  - 🔄 Cambios de estado (con estados anterior y nuevo)
  - 📤 Envíos
  - ✅ Aprobaciones
  - ❌ Rechazos (con motivo)
  - 💬 Comentarios internos
  - 🗑️ Eliminaciones

- **Información por evento**:
  - Descripción clara de la acción
  - Usuario que ejecutó la acción
  - Fecha y hora exacta
  - Detalles adicionales (campos modificados, valores anteriores/nuevos, motivos)

- **Diseño visual**:
  - Íconos coloridos por tipo de acción
  - Cards hover con borde resaltado
  - Scroll para historial extenso
  - Contador de eventos en header

### 5. Notas Internas ([BudgetNotes.tsx](components/BudgetNotes.tsx))

Sistema de comentarios internos para el equipo:

- **Agregar nueva nota**:
  - Textarea con validación
  - Botón de guardado con estado de carga
  - Toast de confirmación al agregar

- **Visualización de notas**:
  - Lista cronológica (más recientes primero)
  - Avatar y nombre del autor
  - Fecha y hora de creación
  - Contenido completo con preservación de formato
  - Indicador de edición (si fue modificada)

- **Características**:
  - Scroll para listas largas
  - Diseño distintivo con color ámbar
  - Empty state informativo
  - Contador de notas en header

### 6. Modal de Duplicación ([DuplicateBudgetModal.tsx](components/DuplicateBudgetModal.tsx))

AlertDialog profesional con información clara:

- **Contenido del modal**:
  - Ícono visual de acción
  - Título descriptivo
  - Explicación de qué incluye la copia
  - Lista de elementos copiados
  - Advertencias importantes (nuevo folio, estado Borrador, exclusiones)

- **Proceso de duplicación**:
  1. Usuario confirma acción
  2. Se muestra loading state
  3. Se genera nuevo folio único (COT-YYYY-XXX)
  4. Se crea presupuesto con estado "Borrador"
  5. Toast de éxito con nuevo folio
  6. Redirección automática al nuevo presupuesto

## 🏗️ Arquitectura

### Estructura de Archivos

```
app/portal/presupuesto/
├── editar/
│   ├── [budgetId]/
│   │   └── page.tsx                 # Página principal con params dinámicos
│   └── components/
│       ├── EditBudgetHeader.tsx     # Header con acciones
│       ├── BudgetHistoryTimeline.tsx # Timeline de cambios
│       ├── BudgetNotes.tsx          # Sistema de notas
│       └── DuplicateBudgetModal.tsx # Modal de duplicación
```

### Servicios API Extendidos ([api/budgetService.ts](../api/budgetService.ts))

Nuevos métodos agregados:

```typescript
// Obtener presupuesto con datos detallados
fetchBudgetById(id: string): Promise<BudgetDetailedData | null>

// Actualizar presupuesto existente
updateBudget(id: string, data: Partial<BudgetDetailedData>): Promise<BudgetDetailedData>

// Duplicar presupuesto
duplicateBudget(id: string): Promise<DuplicateBudgetResult>

// Obtener notas del presupuesto
fetchBudgetNotes(budgetId: string): Promise<BudgetNote[]>

// Agregar nueva nota
addBudgetNote(budgetId: string, content: string, author: string): Promise<BudgetNote>
```

### Tipos Extendidos ([types/presupuesto.ts](../../types/presupuesto.ts))

```typescript
interface BudgetDetailedData extends Budget {
  // Datos completos para edición
  proyecto?: string;
  items?: BudgetItem[];
  subtotal?: number;
  ivaTotal?: number;
  cliente_info?: {...};
  proyecto_info?: {...};
  // Metadata
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface BudgetNote {
  id: string;
  budgetId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

interface DuplicateBudgetResult {
  id: string;
  folio: string;
  originalId: string;
  createdAt: string;
}
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: `#244F82` (Azul AFLOW)
- **Estados**:
  - Borrador: Gris (`gray-100/700`)
  - En revisión: Azul (`blue-50/700`)
  - Aprobado: Verde (`green-100/800`)
  - Rechazado: Rojo (`red-100/800`)
- **Notas**: Ámbar (`amber-50/100/600`)
- **Historial**: Colores específicos por tipo de evento

### Responsive Design
- **Mobile**: Layout en columna única, botones apilados
- **Tablet**: Grid de 2 columnas, tabs compactos
- **Desktop**: Grid de 3 columnas (2+1), todos los elementos visibles

### Feedback Visual
- Toasts con Sonner en todas las acciones
- Loading skeletons durante cargas
- Estados disabled en botones durante procesamiento
- Indicador de "cambios sin guardar"
- Animaciones suaves en hover y transiciones

## 📊 Flujo de Usuario

### Escenario 1: Edición Básica
1. Usuario hace click en fila o botón "Editar"
2. Se carga página de edición con datos del presupuesto
3. Usuario revisa información en tabs
4. Usuario agrega nota interna sobre observaciones
5. Usuario hace click en "Guardar cambios"
6. Toast confirma guardado exitoso

### Escenario 2: Duplicación
1. Usuario está en edición de presupuesto
2. Click en botón "Duplicar"
3. Se muestra modal con información detallada
4. Usuario confirma la duplicación
5. Sistema crea nuevo presupuesto con folio único
6. Redirección automática a edición del nuevo presupuesto
7. Toast muestra folio del presupuesto duplicado

### Escenario 3: Compartir Visualización
1. Usuario click en "Copiar link"
2. URL se copia al portapapeles
3. Toast confirma: "Link copiado correctamente"
4. Usuario puede compartir el link generado

## 🔧 Datos Mock

El módulo funciona completamente con datos simulados:

- **Delay en cargas**: 500ms (fetchBudgetById)
- **Delay en guardado**: 800ms (updateBudget)
- **Delay en duplicación**: 800ms (duplicateBudget)
- **Historial**: 13 eventos de ejemplo filtrados por folio
- **Notas**: 3 notas de ejemplo por presupuesto
- **Ítems**: 3 ítems de ejemplo con cálculos completos

## 🚀 Integración Futura con API Real

### Pasos para migración:

1. **Reemplazar servicios mock**:
   ```typescript
   // budgetService.ts
   export async function fetchBudgetById(id: string) {
     const response = await fetch(`/api/budgets/${id}`);
     return response.json();
   }
   ```

2. **Agregar manejo de errores**:
   ```typescript
   try {
     const data = await fetchBudgetById(id);
   } catch (error) {
     if (error.status === 404) {
       // Presupuesto no encontrado
     } else if (error.status === 403) {
       // Sin permisos
     }
   }
   ```

3. **Implementar React Query mutations**:
   ```typescript
   const updateMutation = useMutation({
     mutationFn: (data) => updateBudget(budget.id, data),
     onSuccess: () => {
       queryClient.invalidateQueries(['budget', budget.id]);
     }
   });
   ```

4. **Agregar validaciones de permisos**:
   - Verificar si usuario puede editar según estado
   - Restringir duplicación según rol
   - Validar acceso a notas internas

## ✅ Testing

### Casos de Prueba Recomendados

1. **Navegación**:
   - ✓ Click en fila redirige correctamente
   - ✓ Click en "Editar" del menú funciona
   - ✓ Parámetro budgetId se captura en URL

2. **Carga de datos**:
   - ✓ Loading skeleton se muestra durante carga
   - ✓ Datos se despliegan correctamente en tabs
   - ✓ Historial filtrado por folio actual
   - ✓ Manejo de presupuesto no encontrado

3. **Acciones**:
   - ✓ Copiar link funciona en todos los navegadores
   - ✓ Modal de duplicación se abre/cierra correctamente
   - ✓ Duplicación genera folio único secuencial
   - ✓ Guardado muestra confirmación

4. **Notas**:
   - ✓ No permite agregar nota vacía
   - ✓ Nueva nota aparece al inicio de la lista
   - ✓ Usuario actual se asigna como autor

5. **Responsive**:
   - ✓ Layout se adapta en móvil
   - ✓ Botones son accesibles en todas las resoluciones
   - ✓ Tabs funcionan en touch devices

## 🔐 Seguridad

### Consideraciones implementadas:

- **Validación de ID**: Verifica que el presupuesto exista antes de renderizar
- **Confirmación de cancelación**: Si hay cambios sin guardar
- **Escape de XSS**: Todas las notas y textos están sanitizados por React
- **Prevención de doble submit**: Botones se deshabilitan durante procesamiento

### A implementar en producción:

- Validación de permisos por rol de usuario
- Rate limiting en API de notas
- Audit log de quién accede a qué presupuestos
- Encriptación de datos sensibles del cliente

## 📝 Notas de Desarrollo

### Decisiones de diseño:

1. **Por qué no reutilizar el wizard de creación?**
   - El wizard es multi-paso y orientado a entrada de datos
   - La edición requiere visualización rápida de toda la información
   - Tabs permiten mejor navegación entre secciones relacionadas
   - Se mantuvo consistencia visual y tipográfica

2. **Por qué historial y notas en sidebar?**
   - Información secundaria pero importante
   - No interfiere con datos principales
   - Scroll independiente permite listas largas
   - Visual balanceado con layout 2+1

3. **Por qué modal para duplicación?**
   - Acción destructiva (crea nuevo registro)
   - Requiere confirmación explícita
   - Permite explicar consecuencias claramente
   - Evita clicks accidentales

## 🎯 Próximos Pasos Recomendados

1. **Modo edición real del formulario**:
   - Refactorizar wizard de creación en componente reutilizable
   - Agregar modo "edit" que precargue campos
   - Mantener validaciones existentes

2. **Versionado de presupuestos**:
   - Sistema de snapshots antes de cada edición
   - Permitir rollback a versión anterior
   - Comparación visual de cambios (diff)

3. **Permisos granulares**:
   - Definir roles: Admin, Vendedor, Gerente, Solo Lectura
   - Restringir acciones según rol
   - Audit log de intentos de acceso denegados

4. **Notificaciones**:
   - Email cuando presupuesto es editado
   - Notificaciones en app para cambios de estado
   - Recordatorios de presupuestos por vencer

5. **Exportación avanzada**:
   - Generar PDF real con react-pdf
   - Exportar a Excel con detalles
   - Compartir link con expiración temporal

## 📚 Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Sonner Toasts](https://sonner.emilkowal.ski/)

---

**Desarrollado por**: AI Assistant  
**Fecha**: Diciembre 14, 2025  
**Versión del módulo**: 1.0.0  
**Estado**: ✅ Listo para producción (con API mock)
