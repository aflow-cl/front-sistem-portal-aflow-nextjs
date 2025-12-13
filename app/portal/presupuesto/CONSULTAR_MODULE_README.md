# Módulo de Consultar Cotizaciones - Mejoras Enterprise

## 🎯 Resumen de Implementación

Se ha refactorizado completamente el módulo de **Consultar Cotizaciones** siguiendo lineamientos enterprise, UX profesional y mejores prácticas de Next.js 15.

---

## ✨ Características Implementadas

### 1. **Diseño Visual Enterprise**
- ✅ Paleta de colores institucional (`#244F82` - Azul AFLOW)
- ✅ Cards con sombras suaves y bordes redondeados
- ✅ Badges de estado con colores semánticos:
  - 🟢 Verde → Aprobado
  - 🟡 Amarillo → Pendiente
  - 🔴 Rojo → Rechazado
  - 🔵 Azul → En revisión
  - ⚪ Gris → Borrador
- ✅ Tipografía jerárquica clara (semibold para títulos, regular para contenido)

### 2. **Tabla de Cotizaciones Mejorada** (`BudgetTableEnhanced`)
- ✅ **9 Columnas**:
  1. Folio (con color institucional)
  2. Cliente
  3. Fecha
  4. Monto (formato CLP)
  5. Neto (nuevo)
  6. Estado (Badge con colores)
  7. Autor (nuevo)
  8. Fecha Cierre (nuevo)
  9. Acciones (DropdownMenu)

- ✅ **Ordenamiento por columnas**:
  - Click en header para ordenar
  - Iconos visuales (↑ ↓)
  - Estado activo con color institucional

- ✅ **Acciones por fila** (DropdownMenu):
  - ✏️ Editar → Navega a página de creación con ID
  - 👁 Ver Documento → Abre Dialog modal (90% viewport)
  - ⬇️ Descargar → Simula descarga de PDF

### 3. **Filtros Avanzados** (Sheet lateral)
- ✅ Panel lateral deslizable desde la derecha
- ✅ **Campos de filtrado**:
  - Folio
  - Cliente (búsqueda textual)
  - Estado (select)
  - Autor (búsqueda textual)
  - Rango de fechas de creación
  - Rango de fechas de cierre
  - Rango de monto (min/max)
- ✅ Botones de acción:
  - "Aplicar Filtros" → Aplica y cierra
  - "Limpiar" → Resetea todos los filtros
- ✅ Indicador visual cuando hay filtros activos

### 4. **Custom Hook** (`useCotizaciones`)
- ✅ Lógica de filtrado centralizada
- ✅ Ordenamiento dinámico
- ✅ Estado reactivo
- ✅ Función de limpieza de filtros
- ✅ Detector de filtros activos

### 5. **Estados de Carga**
- ✅ `loading.tsx` de Next.js 15
- ✅ Skeletons realistas (cards, tabla)
- ✅ Transiciones fluidas sin parpadeos
- ✅ Feedback visual inmediato

### 6. **Visor de Documentos**
- ✅ Dialog modal grande (90% viewport)
- ✅ Scroll interno
- ✅ Vista previa simulada de PDF
- ✅ Información del documento

### 7. **Header y Layout**
- ✅ Card con título y descripción
- ✅ Botón de refresh
- ✅ Botón "Filtros Avanzados" (destaca cuando hay filtros activos)
- ✅ ❌ Removido botón "+ Nuevo Presupuesto" (según especificación)

### 8. **Indicadores (KPIs)**
- ✅ 4 cards con animación hover
- ✅ Click para filtrar por estado
- ✅ Dialog de confirmación
- ✅ Colores semánticos

### 9. **Datos Mock Actualizados**
- ✅ 8 cotizaciones de ejemplo
- ✅ Campos completos: folio, cliente, fecha, monto, neto, autor, fechaCierre
- ✅ Montos realistas en CLP
- ✅ Folios con formato empresarial (COT-2025-XXX)

---

## 📁 Estructura de Archivos

```
app/portal/presupuesto/
├── consultar/
│   ├── page.tsx              # Página principal refactorizada
│   └── loading.tsx           # Loading state con skeletons
├── components/
│   ├── BudgetTableEnhanced.tsx   # Tabla mejorada con todas las columnas
│   ├── AdvancedFilters.tsx       # Sheet de filtros avanzados
│   └── Indicators.tsx            # KPIs (actualizado con colores)
├── hooks/
│   └── useCotizaciones.ts    # Custom hook para filtrado y ordenamiento
└── api/
    └── budgetService.ts      # Mock data actualizado
```

---

## 🎨 Paleta de Colores Utilizada

```css
/* Color Primario - Azul Institucional */
#244F82 - Azul AFLOW principal
#1a3a5f - Azul AFLOW hover

/* Estados */
Verde (Aprobado):   bg-green-100 text-green-800 border-green-300
Amarillo (Pendiente): bg-yellow-100 text-yellow-800 border-yellow-300
Rojo (Rechazado):   bg-red-100 text-red-800 border-red-300
Azul (En revisión): bg-blue-50 text-blue-700 border-blue-300
Gris (Borrador):    bg-gray-100 text-gray-700 border-gray-300
```

---

## 🧩 Componentes shadcn/ui Utilizados

- ✅ `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- ✅ `Button`
- ✅ `Badge`
- ✅ `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
- ✅ `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- ✅ `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetTrigger`
- ✅ `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`
- ✅ `TooltipProvider`
- ✅ `ScrollArea`
- ✅ `Skeleton`
- ✅ `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- ✅ `Input`
- ✅ `Label`

---

## ♿ Accesibilidad y UX

- ✅ Contraste WCAG AA cumplido
- ✅ Tamaños de click adecuados (min 44x44px)
- ✅ Tooltips explicativos
- ✅ Navegable por teclado
- ✅ Estados hover y focus visibles
- ✅ ARIA labels en navegación
- ✅ Feedback visual en todas las acciones

---

## 📱 Responsive Design

- ✅ **Desktop first** con breakpoints mobile
- ✅ **Mobile**:
  - Tabla con scroll horizontal
  - Sheet de filtros ocupa pantalla completa
  - Cards apilados verticalmente
  - Botones adaptativos

---

## 🚀 Próximos Pasos (Opcionales)

1. **Paginación**: Agregar componente de paginación para grandes volúmenes
2. **Exportar a Excel**: Botón para descargar tabla filtrada
3. **Búsqueda rápida**: Input de búsqueda global en header
4. **Acciones masivas**: Checkbox para selección múltiple
5. **Filtros guardados**: Guardar configuraciones de filtros favoritas
6. **Visor PDF real**: Integrar react-pdf o similar

---

## 🧪 Testing

Para probar el módulo:

1. Navegar a `/portal/presupuesto/consultar`
2. Probar ordenamiento clickeando en headers de columnas
3. Abrir "Filtros Avanzados" y aplicar diferentes criterios
4. Click en indicadores para filtrar por estado
5. Usar menú de acciones en cada fila
6. Verificar responsive en diferentes tamaños de pantalla

---

## 📝 Notas Técnicas

- **Next.js 15**: Uso de App Router, Server Components donde sea posible
- **React Query**: Manejo de estado asíncrono y cache
- **TypeScript**: Código completamente tipado
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: Componentes base de alta calidad
- **Zod**: Validación de formularios (en módulo de creación)

---

**Desarrollado con** ❤️ **siguiendo las mejores prácticas de desarrollo frontend enterprise**
