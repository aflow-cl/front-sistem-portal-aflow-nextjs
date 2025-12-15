# Deprecations & Code Cleanup Guide

> **Última actualización:** 15 de diciembre, 2025

Este documento registra los componentes y archivos que han sido deprecados o eliminados del proyecto, junto con las razones y alternativas recomendadas.

---

## 📜 Histórico de Deprecaciones

### Diciembre 2025 - Limpieza del Módulo Presupuesto

#### 1. **BudgetTable.tsx** ❌ ELIMINADO

**Ubicación anterior:** `app/portal/presupuesto/components/BudgetTable.tsx`

**Razón:**
- Componente supersedido por versión mejorada `BudgetTableEnhanced.tsx`
- Carecía de funcionalidades avanzadas (sorting, navegación, dropdown menus)
- Solo tenía 5 columnas básicas vs 9 columnas en Enhanced
- No tenía imports en ningún archivo del proyecto (código muerto)

**Alternativa:**
```typescript
// ❌ ANTES (eliminado)
import { BudgetTable } from '../components/BudgetTable';

// ✅ AHORA (usar en su lugar)
import { BudgetTableEnhanced } from '../components/BudgetTableEnhanced';
```

**Características que faltaban en versión antigua:**
- ❌ Navegación al hacer click en filas
- ❌ Dropdown menus con acciones múltiples
- ❌ Sorting de columnas
- ❌ Modal dialog integrado
- ❌ 9 columnas de información completa

**Migración:** No requiere migración - no estaba en uso.

---

#### 2. **page_new.tsx** ❌ ELIMINADO

**Ubicación anterior:** `app/portal/presupuesto/crear/page_new.tsx`

**Razón:**
- Archivo marcado explícitamente como "draft/backup - not currently used"
- Solo contenía 50 líneas de código comentado
- No tenía funcionalidad real
- Confusión en el equipo sobre cuál archivo usar

**Contenido:**
```tsx
// This file is a draft/backup - not currently used
// Keeping for reference only
/* ...imports comentados... */
```

**Migración:** No requiere migración - solo contenía código comentado.

---

#### 3. **page.tsx.backup** ❌ ELIMINADO

**Ubicación anterior:** `app/portal/presupuesto/crear/page.tsx.backup`

**Razón:**
- Backup de versión antigua del wizard de creación (736 líneas)
- Diferente estructura de imports y componentes
- Código completamente reemplazado por versión actual en `page.tsx`
- Recuperable desde Git si es necesario

**Nota sobre Backups:**
> **Política recomendada:** No mantener archivos `.backup` en el repositorio.
> Git ya provee historial completo. Usar branches para experimentos.

**Alternativa:**
```bash
# Para recuperar versiones antiguas, usar Git
git log -- app/portal/presupuesto/crear/page.tsx
git show <commit-hash>:app/portal/presupuesto/crear/page.tsx
```

---

#### 4. **Duplicación de PresupuestoTable** ✅ CONSOLIDADO

**Ubicaciones anteriores:**
- `app/portal/presupuesto/crear/components/PresupuestoTable.tsx` ❌
- `app/portal/presupuesto/editar/components/PresupuestoTable.tsx` ❌

**Ubicación actual:**
- `app/portal/presupuesto/components/PresupuestoTable.tsx` ✅

**Razón:**
- 532 líneas de código duplicado entre crear y editar
- Ambas versiones eran idénticas
- Dificultad de mantener cambios en dos lugares
- Violación del principio DRY (Don't Repeat Yourself)

**Migración:**
```typescript
// ❌ ANTES (duplicado en cada módulo)
import { PresupuestoTable } from './components/PresupuestoTable';
import { PresupuestoTable } from '../components/PresupuestoTable';

// ✅ AHORA (centralizado)
// En crear/page.tsx:
import { PresupuestoTable } from '../components/PresupuestoTable';

// En editar/[budgetId]/page.tsx:
import { PresupuestoTable } from '../../components/PresupuestoTable';
```

**Beneficios:**
- ✅ Single source of truth - un solo lugar para actualizar
- ✅ 532 líneas menos de código duplicado
- ✅ Bugs se arreglan automáticamente en ambos módulos
- ✅ Mejor organización - componentes compartidos en carpeta compartida

---

#### 5. **Route Group (private)** ❌ ELIMINADO

**Ubicación anterior:** `app/(private)/`

**Razón:**
- Carpeta completamente vacía
- Route group abandonado sin contenido
- Patrón de organización no implementado
- El módulo `portal/` maneja las rutas protegidas

**Contexto:**
Los route groups en Next.js 13+ permiten organizar rutas sin afectar URLs:
```
app/
├── (public)/    # Rutas públicas
│   └── login/
└── (private)/   # Rutas protegidas ← estaba vacío
```

**Estado actual:**
```
app/
├── (public)/
│   └── login/
└── portal/      # Maneja rutas protegidas sin route group
```

**Recomendación futura:** 
Si se desea implementar route groups más adelante:
1. Evaluar si realmente agrega valor organizacional
2. Planificar estructura completa antes de crear carpetas
3. Documentar convención en README

---

## 📊 Resumen de Impacto

| Acción | Archivos | Líneas Removidas | Impacto |
|--------|----------|------------------|---------|
| Eliminar BudgetTable.tsx | 1 | 146 | ✅ Sin breaking changes |
| Eliminar page_new.tsx | 1 | 50 | ✅ Sin breaking changes |
| Eliminar page.tsx.backup | 1 | 736 | ✅ Sin breaking changes |
| Eliminar (private) folder | 1 carpeta | 0 | ✅ Sin breaking changes |
| Consolidar PresupuestoTable | 2 → 1 | 532 (duplicado) | ✅ Imports actualizados |
| **TOTAL** | **5 items** | **1,464 líneas** | **✅ 100% exitoso** |

---

## 🎯 Política de Deprecación

Para mantener la calidad del código a futuro, seguir estas guías:

### ✅ Cuándo Deprecar un Componente

1. **Componente supersedido por versión mejorada**
   - Marcar como `@deprecated` en JSDoc
   - Mantener por 1-2 sprints antes de eliminar
   - Actualizar imports gradualmente

2. **Componente no utilizado en ninguna parte**
   - Verificar con grep/search en todo el proyecto
   - Eliminar inmediatamente si no hay referencias

3. **Código duplicado identificado**
   - Consolidar en ubicación compartida
   - Actualizar todos los imports
   - Eliminar duplicados

### ❌ Evitar

1. **No crear archivos `.backup`** 
   - Usar Git para historial
   - Crear branches para experimentos

2. **No dejar carpetas vacías**
   - Eliminar route groups sin contenido
   - Limpiar estructura después de refactors

3. **No mantener código comentado**
   - Eliminar código muerto
   - Git preserva el historial

### 📝 Proceso de Deprecación

```typescript
// Paso 1: Marcar como deprecated (mantener 1-2 sprints)
/**
 * @deprecated Use BudgetTableEnhanced instead
 * @see BudgetTableEnhanced
 */
export function BudgetTable() { ... }

// Paso 2: Actualizar todos los imports
// (buscar y reemplazar en todo el proyecto)

// Paso 3: Eliminar después del período de gracia
// rm app/portal/presupuesto/components/BudgetTable.tsx
```

---

## 🔍 Cómo Identificar Código Muerto

### Usar grep para encontrar imports:

```bash
# Buscar si un componente está siendo usado
grep -r "import.*BudgetTable" app/

# Buscar referencias a un archivo específico
grep -r "page_new" app/

# Buscar archivos .backup
find . -name "*.backup"
```

### Usar VS Code Search:

1. Presionar `Ctrl+Shift+F`
2. Buscar: `import.*ComponentName`
3. Si no hay resultados → candidato a eliminación

### Herramientas recomendadas:

- **ts-unused-exports** - Detecta exports no usados
- **depcheck** - Identifica dependencias no usadas
- **eslint-plugin-unused-imports** - Detecta imports no usados

---

## 📚 Referencias

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [React Component Deprecation Guide](https://react.dev/learn/removing-effect-dependencies)
- [Git History Recovery](https://git-scm.com/docs/git-log)

---

## 🤝 Contribuciones

Al agregar código nuevo:

1. ✅ Verificar que no duplica funcionalidad existente
2. ✅ Usar componentes compartidos cuando sea apropiado
3. ✅ Documentar razones si se crea alternativa a componente existente
4. ✅ No crear archivos `.backup` - usar Git branches
5. ✅ Eliminar código comentado antes de commit

---

**Mantenido por:** Equipo de Desarrollo AFLOW  
**Próxima revisión:** Marzo 2026
