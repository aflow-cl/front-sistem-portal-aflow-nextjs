# Guía de Migración de Mock a API Real

## 📋 Resumen Ejecutivo

Esta guía proporciona un roadmap completo para migrar el Portal AFLOW desde el sistema actual de datos mock a una API backend real con PostgreSQL y Supabase. El proyecto está diseñado con una arquitectura que facilita esta migración mediante capas de abstracción claramente definidas.

**Fecha de creación:** 22 de diciembre de 2025  
**Estado del proyecto:** Producción con Mock Data  
**Objetivo:** Migración a API Real (Q1 2026)

---

## 🎯 Objetivos de la Migración

1. **Reemplazar datos mock** con endpoints de API reales
2. **Integrar autenticación real** con Supabase Auth
3. **Implementar persistencia** de datos en PostgreSQL
4. **Mantener funcionalidad** sin interrupciones durante la transición
5. **Conservar la arquitectura** de capas actual

---

## 📊 Estado Actual vs. Objetivo

### Estado Actual (Mock)

| Componente | Implementación Actual |
|------------|----------------------|
| **Autenticación** | Mock con localStorage |
| **Base de Datos** | Arrays en memoria (mock data) |
| **API Calls** | Funciones asíncronas que retornan mock data |
| **Caché** | React Query con datos mock |
| **Persistencia** | No existe (datos se pierden al recargar) |

### Estado Objetivo (API Real)

| Componente | Implementación Objetivo |
|------------|-------------------------|
| **Autenticación** | Supabase Auth con JWT |
| **Base de Datos** | PostgreSQL con Supabase |
| **API Calls** | Next.js API Routes + Supabase Client |
| **Caché** | React Query con datos reales |
| **Persistencia** | Completa en PostgreSQL |

---

## 🏗️ Arquitectura de Migración

### Estructura de Capas

```
Frontend (React Components)
        ↓
Custom Hooks (useAuth, useBudget, etc.)
        ↓
Service Layer (services/*.ts)  ← CAPA DE MIGRACIÓN
        ↓
Next.js API Routes (app/api/*)
        ↓
Supabase Client
        ↓
PostgreSQL Database
```

**Capa crítica:** La Service Layer es el punto de migración. Solo necesitamos modificar las funciones de servicio para cambiar de mock a API real.

---

## 📝 Plan de Migración por Módulos

### Fase 1: Infraestructura Base (Semana 1-2)

#### 1.1 Configurar Supabase

**Archivo:** `data/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Variables de entorno (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 1.2 Crear Schema de Base de Datos

**Referencia:** Ver [docs/planning/BACKEND_API_POSTGRESQL.md](../planning/BACKEND_API_POSTGRESQL.md) para schema completo.

**Tablas principales:**
- `usuarios`
- `perfiles`
- `clientes`
- `sucursales`
- `contratantes`
- `proveedores`
- `servicios`
- `presupuestos`
- `items_presupuesto`
- `historico_presupuestos`
- `opciones_menu`

#### 1.3 Configurar Row Level Security (RLS)

```sql
-- Ejemplo: Presupuestos
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own presupuestos"
  ON presupuestos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presupuestos"
  ON presupuestos FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

### Fase 2: Autenticación (Semana 3)

#### 2.1 Migrar `data/supabase/auth.ts`

**ANTES (Mock):**
```typescript
export async function signIn(email: string, password: string) {
  await delay(1000);
  
  if (email === 'test@aflow.cl' && password === '123456') {
    const user = { id: '1', email, name: 'Usuario Test' };
    localStorage.setItem('user', JSON.stringify(user));
    return { user, session: { token: 'mock-token' } };
  }
  
  throw new Error('Credenciales inválidas');
}
```

**DESPUÉS (Supabase):**
```typescript
import { supabase } from './client';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return {
    user: data.user,
    session: data.session,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

#### 2.2 Actualizar `hooks/useAuth.ts`

**Cambios mínimos necesarios:**
```typescript
import { signIn, signOut, getCurrentUser } from '@/data/supabase/auth';

// Las funciones ya usan los servicios, solo cambiar la implementación
// en auth.ts es suficiente
```

---

### Fase 3: Módulo Presupuesto (Semana 4-5)

#### 3.1 Migrar `presupuestoService.ts`

**Ubicación:** `app/portal/presupuesto/api/presupuestoService.ts`

**ANTES (Mock):**
```typescript
import { mockPresupuestos } from './mockData';

export async function fetchPresupuestos() {
  await delay(800);
  return mockPresupuestos;
}

export async function createPresupuesto(data: CreatePresupuestoInput) {
  await delay(1000);
  const newPresupuesto = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  mockPresupuestos.push(newPresupuesto);
  return newPresupuesto;
}
```

**DESPUÉS (API Real):**
```typescript
import { supabase } from '@/data/supabase/client';

export async function fetchPresupuestos() {
  const { data, error } = await supabase
    .from('presupuestos')
    .select(`
      *,
      contratante:contratantes(id, nombre, rut),
      items:items_presupuesto(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createPresupuesto(presupuesto: CreatePresupuestoInput) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('presupuestos')
    .insert({
      ...presupuesto,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePresupuesto(id: string, updates: Partial<Presupuesto>) {
  const { data, error } = await supabase
    .from('presupuestos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePresupuesto(id: string) {
  const { error } = await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
```

#### 3.2 Implementar Operaciones con Ítems

**Crear presupuesto con ítems (transacción):**
```typescript
export async function createPresupuestoConItems(
  presupuesto: CreatePresupuestoInput,
  items: CreateItemInput[]
) {
  // 1. Crear presupuesto
  const { data: newPresupuesto, error: presupuestoError } = await supabase
    .from('presupuestos')
    .insert(presupuesto)
    .select()
    .single();
  
  if (presupuestoError) throw presupuestoError;
  
  // 2. Crear ítems asociados
  const itemsWithPresupuestoId = items.map(item => ({
    ...item,
    presupuesto_id: newPresupuesto.id,
  }));
  
  const { error: itemsError } = await supabase
    .from('items_presupuesto')
    .insert(itemsWithPresupuestoId);
  
  if (itemsError) {
    // Rollback: eliminar presupuesto creado
    await supabase.from('presupuestos').delete().eq('id', newPresupuesto.id);
    throw itemsError;
  }
  
  // 3. Retornar presupuesto completo
  return fetchPresupuestoById(newPresupuesto.id);
}
```

---

### Fase 4: Módulo Maestro de Negocio (Semana 6)

#### 4.1 Migrar Contratantes

**Ubicación:** `app/portal/maestro-negocio/api/maestroService.ts`

**DESPUÉS (API Real):**
```typescript
// Contratantes
export async function fetchContratantes() {
  const { data, error } = await supabase
    .from('contratantes')
    .select(`
      *,
      direcciones:direcciones_contratante(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createContratante(contratante: CreateContratanteInput) {
  const { data, error } = await supabase
    .from('contratantes')
    .insert(contratante)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Direcciones de Contratante
export async function addDireccionContratante(
  contratanteId: string,
  direccion: CreateDireccionInput
) {
  const { data, error } = await supabase
    .from('direcciones_contratante')
    .insert({
      ...direccion,
      contratante_id: contratanteId,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

#### 4.2 Migrar Proveedores y Servicios

Similar al patrón de Contratantes, reemplazar mock data con llamadas a Supabase.

---

### Fase 5: Módulo Histórico Contratante (Semana 7)

**Ubicación:** `app/portal/historico-contratante/api/historicoService.ts`

**DESPUÉS (API Real con filtros):**
```typescript
export async function fetchHistoricoPresupuestos(filters?: HistoricoFilters) {
  let query = supabase
    .from('presupuestos')
    .select(`
      *,
      contratante:contratantes(id, nombre, rut)
    `);
  
  // Aplicar filtros
  if (filters?.busqueda) {
    query = query.or(`folio.ilike.%${filters.busqueda}%,contratante.nombre.ilike.%${filters.busqueda}%`);
  }
  
  if (filters?.estado && filters.estado !== 'all') {
    query = query.eq('estado', filters.estado);
  }
  
  if (filters?.contratanteId && filters.contratanteId !== 'all') {
    query = query.eq('contratante_id', filters.contratanteId);
  }
  
  if (filters?.fechaDesde) {
    query = query.gte('fecha_inicio', filters.fechaDesde);
  }
  
  if (filters?.fechaHasta) {
    query = query.lte('fecha_inicio', filters.fechaHasta);
  }
  
  if (filters?.montoMinimo) {
    query = query.gte('total', filters.montoMinimo);
  }
  
  if (filters?.montoMaximo) {
    query = query.lte('total', filters.montoMaximo);
  }
  
  // Ordenamiento
  const orderField = filters?.ordenarPor === 'monto' ? 'total' : 
                     filters?.ordenarPor === 'fecha' ? 'fecha_inicio' : 'folio';
  const ascending = filters?.ordenDireccion === 'asc';
  
  query = query.order(orderField, { ascending });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}
```

---

### Fase 6: Módulo Ajustes AFLOW (Semana 8-9)

#### 6.1 Migrar Gestión de Clientes

**Ubicación:** `app/portal/ajustes-aflow/api/ajustesService.ts`

**Funciones a migrar:**
- `fetchClientes()`
- `createCliente()`
- `updateCliente()`
- `deleteCliente()`
- `addSucursal()`
- `addUsuarioCliente()`
- `fetchServicios()`
- `fetchPerfiles()`

**Patrón similar a otros módulos:**
```typescript
export async function createClienteCompleto(wizardData: ClienteWizardData) {
  // 1. Crear cliente
  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert(wizardData.cliente)
    .select()
    .single();
  
  if (clienteError) throw clienteError;
  
  // 2. Crear sucursal principal
  if (wizardData.sucursal) {
    await supabase.from('sucursales').insert({
      ...wizardData.sucursal,
      cliente_id: cliente.id,
      es_principal: true,
    });
  }
  
  // 3. Crear usuario administrador
  if (wizardData.usuario) {
    await supabase.from('usuarios_cliente').insert({
      ...wizardData.usuario,
      cliente_id: cliente.id,
    });
  }
  
  // 4. Asociar servicios
  if (wizardData.servicios.length > 0) {
    const serviciosContratados = wizardData.servicios.map(s => ({
      cliente_id: cliente.id,
      servicio_id: s.servicioId,
      plan: s.planSeleccionado,
      estado: 'Activo',
      fecha_inicio: new Date().toISOString(),
    }));
    
    await supabase.from('servicios_contratados').insert(serviciosContratados);
  }
  
  return cliente;
}
```

#### 6.2 Migrar Sistema de Permisos

```typescript
export async function fetchPerfilesConPermisos() {
  const { data, error } = await supabase
    .from('perfiles')
    .select(`
      *,
      permisos:permisos_perfil(
        id,
        modulo,
        submodulo,
        accion,
        habilitado
      )
    `);
  
  if (error) throw error;
  return data;
}

export async function updatePermiso(perfilId: string, permisoId: string, habilitado: boolean) {
  const { error } = await supabase
    .from('permisos_perfil')
    .update({ habilitado })
    .eq('perfil_id', perfilId)
    .eq('id', permisoId);
  
  if (error) throw error;
}
```

---

## 🔄 Estrategia de Transición

### Opción A: Migración Big Bang (Recomendada para desarrollo)

**Ventajas:**
- Cambio completo en una sola actualización
- No hay duplicación de código
- Testing más simple

**Desventajas:**
- Requiere testing exhaustivo antes del deploy
- Mayor riesgo si algo falla

**Implementación:**
1. Crear rama `feature/api-migration`
2. Migrar todos los módulos
3. Testing completo en ambiente staging
4. Deploy a producción con rollback plan

### Opción B: Migración Incremental (Recomendada para producción)

**Ventajas:**
- Menor riesgo
- Rollback fácil por módulo
- Testing gradual

**Desventajas:**
- Código duplicado temporalmente
- Complejidad de mantener dos sistemas

**Implementación:**
```typescript
// Feature flag pattern
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

export async function fetchPresupuestos() {
  if (USE_REAL_API) {
    return fetchPresupuestosFromAPI();
  } else {
    return fetchPresupuestosMock();
  }
}
```

---

## 🧪 Testing de Migración

### Checklist de Testing por Módulo

- [ ] **Autenticación**
  - [ ] Login exitoso con credenciales válidas
  - [ ] Error con credenciales inválidas
  - [ ] Logout limpia sesión
  - [ ] Redirección correcta según estado auth
  - [ ] Refresh token funciona

- [ ] **Presupuesto - Consultar**
  - [ ] Fetch de todos los presupuestos
  - [ ] Filtros funcionan correctamente
  - [ ] Ordenamiento funciona
  - [ ] Paginación funciona (si aplica)

- [ ] **Presupuesto - Crear**
  - [ ] Crear presupuesto con validación
  - [ ] Crear ítems asociados
  - [ ] Cálculo de totales correcto
  - [ ] Errores se manejan correctamente

- [ ] **Presupuesto - Editar**
  - [ ] Actualizar datos básicos
  - [ ] Agregar/Editar/Eliminar ítems
  - [ ] Historial de cambios se guarda
  - [ ] Notas se guardan correctamente

- [ ] **Maestro de Negocio**
  - [ ] CRUD de Contratantes
  - [ ] CRUD de Proveedores
  - [ ] CRUD de Servicios
  - [ ] Validación de RUT

- [ ] **Histórico Contratante**
  - [ ] Fetch con filtros múltiples
  - [ ] Estadísticas calculadas correctamente
  - [ ] Exportación (cuando se implemente)

- [ ] **Ajustes AFLOW**
  - [ ] Wizard de creación de clientes completo
  - [ ] CRUD de sucursales
  - [ ] CRUD de usuarios
  - [ ] Sistema de permisos funciona
  - [ ] Configuración de menú funciona

---

## 🚨 Manejo de Errores

### Patrón Estándar

```typescript
export async function fetchPresupuestos() {
  try {
    const { data, error } = await supabase
      .from('presupuestos')
      .select('*');
    
    if (error) {
      logger.error('Error fetching presupuestos', { error });
      throw new Error('No se pudieron cargar los presupuestos');
    }
    
    return data;
  } catch (error) {
    logger.error('Unexpected error in fetchPresupuestos', { error });
    throw error;
  }
}
```

### Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Row Level Security policy violation` | Usuario no tiene permisos | Revisar políticas RLS |
| `Foreign key constraint` | Intentando eliminar registro con relaciones | Implementar soft delete o eliminar en cascada |
| `Unique constraint violation` | Duplicado (ej: RUT, email) | Validar antes de insertar |
| `JWT expired` | Token expirado | Implementar refresh token automático |

---

## 📊 Monitoreo Post-Migración

### Métricas a Observar

1. **Performance**
   - Tiempo de respuesta de API calls
   - Tiempo de carga de páginas
   - Cache hit ratio de React Query

2. **Errores**
   - Rate de errores por endpoint
   - Errores de autenticación
   - Timeouts

3. **Uso**
   - Queries por minuto
   - Usuarios activos
   - Operaciones CRUD por módulo

### Herramientas

- **Supabase Dashboard:** Logs, analytics, performance
- **Vercel Analytics:** Frontend performance
- **Sentry:** Error tracking (opcional)
- **Custom logging:** Pino logger ya implementado

---

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] Row Level Security (RLS) habilitado en todas las tablas
- [ ] Validación de inputs en frontend y backend
- [ ] Sanitización de queries (Supabase lo hace automáticamente)
- [ ] HTTPS obligatorio
- [ ] Tokens JWT con expiración corta
- [ ] Refresh tokens seguros
- [ ] Rate limiting en API routes
- [ ] CORS configurado correctamente
- [ ] Variables de entorno nunca expuestas al cliente
- [ ] Logs no contienen información sensible

---

## 📝 Documentación Post-Migración

### Actualizar

1. **README.md principal**
   - Cambiar "Mock Data" a "PostgreSQL + Supabase"
   - Actualizar setup instructions

2. **Documentos de módulos**
   - Remover secciones "Mock Data"
   - Agregar secciones "API Endpoints"

3. **Variables de entorno**
   - Documentar todas las variables requeridas
   - Agregar .env.example actualizado

---

## 🎓 Recursos Adicionales

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **React Query with Supabase:** https://tanstack.com/query/latest/docs/react/guides/queries

---

## ✅ Checklist Final de Migración

### Pre-Migración
- [ ] Schema de base de datos creado y probado
- [ ] Supabase configurado y funcionando
- [ ] Variables de entorno configuradas
- [ ] Políticas RLS implementadas
- [ ] Datos de prueba migrados

### Durante Migración
- [ ] Autenticación migrada
- [ ] Módulo Presupuesto migrado
- [ ] Módulo Maestro Negocio migrado
- [ ] Módulo Histórico Contratante migrado
- [ ] Módulo Ajustes AFLOW migrado
- [ ] Testing completo realizado
- [ ] Performance verificada

### Post-Migración
- [ ] Monitoring configurado
- [ ] Documentación actualizada
- [ ] Equipo capacitado
- [ ] Plan de rollback preparado
- [ ] Backups automáticos configurados

---

**Estado de la guía:** ✅ Completa  
**Última actualización:** 22 de diciembre, 2025  
**Próximos pasos:** Iniciar Fase 1 (Infraestructura Base)  
**Responsable:** Equipo AFLOW Development
