# AFLOW Portal - Descripción Técnica del Proyecto

**Documento de Contexto Reutilizable para Continuación de Desarrollo**

---

## 📌 Resumen Ejecutivo

AFLOW Portal es un sistema empresarial modular desarrollado con Next.js 15 y TypeScript, diseñado para gestionar múltiples procesos de negocio (cotizaciones, comercio exterior, finanzas, clientes, guardias) desde una plataforma unificada con autenticación basada en roles y arquitectura limpia escalable.

### Objetivos del Proyecto

1. **Centralización:** Unificar gestión de procesos empresariales en un portal único
2. **Modularidad:** Arquitectura de módulos independientes y reutilizables
3. **Escalabilidad:** Clean Architecture preparada para crecimiento
4. **Seguridad:** Control de acceso basado en roles (RBAC)
5. **Experiencia de Usuario:** Diseño responsivo con paleta corporativa AFLOW
6. **Trazabilidad:** Logging estructurado de todas las operaciones

---

## 🎯 Filosofía de Desarrollo

### Principios Arquitectónicos

**Clean Architecture (Uncle Bob):**
```
Presentation → Application → Domain → Infrastructure
```

- **Independencia de frameworks:** La lógica de negocio no depende de Next.js
- **Testabilidad:** Cada capa es testeable aisladamente
- **Independencia de UI:** La interfaz puede cambiar sin afectar lógica
- **Independencia de base de datos:** Repositorios abstraen el storage

**Convenciones de Código:**

1. **TypeScript Estricto:** Sin `any`, tipado completo
2. **Functional First:** Preferir funciones puras sobre clases
3. **Composition over Inheritance:** Hooks y composición de componentes
4. **Single Responsibility:** Un componente = una responsabilidad
5. **DRY (Don't Repeat Yourself):** Abstracciones en `lib/utils.ts`

---

## 🏗️ Arquitectura Técnica Detallada

### Capas del Sistema

#### 1. Domain Layer (`core/domain/`)
**Responsabilidad:** Entidades de negocio, reglas, interfaces

```typescript
// Ejemplo: Entidad Contratante
export interface Contratante {
  id: string;
  tipo: TipoContratante;
  rut: string;
  // ... campos de dominio
}

export type TipoContratante = "natural" | "juridica";
```

**Reglas de dominio:**
- RUT chileno: Validación con algoritmo módulo 11
- Email: Formato RFC 5322
- Estados: `activo` determina disponibilidad

#### 2. Application Layer (`core/usecases/`, `core/services/`)
**Responsabilidad:** Casos de uso, orquestación de lógica

```typescript
// services/contratante.service.ts
export const contratanteService = {
  getAll: async (filters?: ContratanteFilters) => {
    // Lógica de negocio: filtrado, búsqueda
  },
  create: async (data: ContratanteFormData) => {
    // Validación + persistencia
  },
  // ... otros casos de uso
};
```

**Casos de uso implementados:**
- Autenticación con mock
- Gestión de perfil de usuario
- CRUD completo de Contratante
- Menú dinámico por roles

#### 3. Presentation Layer (`app/`, `components/`, `hooks/`)
**Responsabilidad:** UI, interacción con usuario

**Server Components (Next.js 15):**
```typescript
// app/(private)/modules/contratante/page.tsx
export default function ContratantePage() {
  // Renderiza UI, maneja estado local
}
```

**Custom Hooks (Reutilización):**
```typescript
// hooks/useContratante.ts
export function useContratante() {
  const [contratantes, setContratantes] = useState<Contratante[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAll = async () => { /* ... */ };
  const create = async (data: ContratanteFormData) => { /* ... */ };
  
  return { contratantes, loading, fetchAll, create };
}
```

#### 4. Infrastructure Layer (`data/`, `app/api/`)
**Responsabilidad:** Acceso a datos, APIs externas

**API Routes (Next.js):**
```typescript
// app/api/contratante/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("search");
  
  const contratantes = await contratanteService.getAll({ search: query });
  
  return NextResponse.json(ApiResponse.success(contratantes));
}
```

**Supabase Mock:**
```typescript
// data/supabase/auth.ts
const MOCK_USERS = [
  { email: "test@aflow.cl", password: "123456", role: "admin" },
  // ...
];

export async function signIn(email: string, password: string) {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Credenciales inválidas");
  // ...
}
```

---

## 🔐 Sistema de Autenticación y Permisos

### Roles Disponibles

| Rol | Nivel | Módulos Accesibles |
|-----|-------|-------------------|
| **Admin** | 3 | Todos (8 módulos) |
| **Analista** | 2 | Dashboard, Cotización, Clientes, Mi Cuenta (4 módulos) |
| **Operador** | 1 | Dashboard, Mi Cuenta (2 módulos) |

### Matriz de Permisos

```typescript
// lib/permissions.ts
export const ROLE_PERMISSIONS: Record<UserRole, Module[]> = {
  admin: [
    "dashboard", "cotizacion", "comex", "guardia",
    "finanzas", "clientes", "micuenta", "contratante"
  ],
  analista: ["dashboard", "cotizacion", "clientes", "micuenta"],
  operador: ["dashboard", "micuenta"],
};
```

### Flujo de Autenticación

```
1. Usuario ingresa credenciales en /login
2. POST /api/auth/login valida contra MOCK_USERS
3. Si válido: crea sesión en localStorage con expiración 24h
4. Redirige a /dashboard
5. Layout privado verifica sesión en cada request
6. Si sesión válida: renderiza contenido
7. Si sesión inválida: redirige a /login
```

### Protección de Rutas

```typescript
// app/(private)/layout.tsx
export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) redirect("/login");
  
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## 📊 Modelo de Datos

### Entidades Principales

#### User (Usuario del Sistema)
```typescript
interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  cargo: string;
  departamento: string;
  role: "admin" | "analista" | "operador";
  avatar?: string;
  createdAt: string;
}
```

#### Contratante (Cliente/Proveedor)
```typescript
interface Contratante {
  id: string;
  tipo: "natural" | "juridica";      // Persona Natural o Jurídica
  nombreCompleto?: string;            // Solo para tipo "natural"
  razonSocial?: string;               // Solo para tipo "juridica"
  rut: string;                        // RUT chileno con dígito verificador
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### MenuItem (Menú de Navegación)
```typescript
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  module: Module;
  group: "principal" | "operaciones" | "gestion" | "usuario";
  order: number;
}
```

### Relaciones

```
User 1:N Contratante (createdBy)
User 1:N UserPreferences (settings)
User M:N Module (via ROLE_PERMISSIONS)
```

---

## 🎨 Sistema de Diseño AFLOW

### Paleta de Colores Corporativa

```css
/* Colores Primarios */
--aflow-orange: #FF7A00;    /* Solo para CTAs y acciones principales */
--aflow-black: #000000;     /* Texto principal, fondos oscuros */
--aflow-white: #FFFFFF;     /* Fondos claros, texto sobre oscuro */

/* Grises Estructurales */
--gray-50: #FAFAFA;         /* Fondos sutiles */
--gray-100: #F5F5F5;        /* Hover states */
--gray-200: #EDEDED;        /* Bordes suaves */
--gray-300: #D4D4D4;        /* Bordes definidos */
--gray-500: #737373;        /* Texto secundario */
--gray-700: #404040;        /* Texto terciario */
--gray-900: #1A1A1A;        /* Casi negro */

/* Estados Semánticos */
--success: #10B981;         /* Verde éxito */
--warning: #F59E0B;         /* Amarillo advertencia */
--error: #EF4444;           /* Rojo error */
--info: #3B82F6;            /* Azul información */
```

### Tipografía

**Familias:**
- **Poppins** (Google Fonts) - Títulos, encabezados, navegación
- **Inter** (Google Fonts) - Contenido, formularios, tablas

**Escalas:**
```css
/* Títulos */
.h1 { font-size: 56px; font-weight: 700; line-height: 1.2; font-family: Poppins; }
.h2 { font-size: 36px; font-weight: 600; line-height: 1.3; font-family: Poppins; }
.h3 { font-size: 28px; font-weight: 500; line-height: 1.4; font-family: Poppins; }

/* Cuerpo */
.body-large { font-size: 18px; font-weight: 400; line-height: 1.6; font-family: Inter; }
.body-base { font-size: 16px; font-weight: 400; line-height: 1.6; font-family: Inter; }
.body-small { font-size: 14px; font-weight: 400; line-height: 1.5; font-family: Inter; }
```

### Componentes shadcn/ui Integrados

| Componente | Uso Principal | Variante AFLOW |
|------------|---------------|----------------|
| Button | Acciones, formularios | `variant="aflow"` (naranja) |
| Input | Campos de texto | Bordes gray-300, focus:orange |
| Card | Contenedores de contenido | Shadow-sm, rounded-lg |
| Dialog | Modales (600px/fullscreen) | Responsive automático |
| Select | Dropdowns | Chevron naranja |
| Tabs | Navegación de contenido | Active state naranja |
| Table | Datos tabulares | Striped rows, hover:gray-50 |
| Badge | Estados, etiquetas | `variant="default"`, `"outline"` |
| Switch | Toggles binarios | Checked:orange |

### Espaciado y Layout

**Contenedores:**
```css
.container { max-width: 1440px; padding: 0 24px; }  /* Mobile */
.container { padding: 0 32px; }                      /* Desktop */
```

**Cards:**
```css
.card { padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
```

**Forms:**
```css
.form-field { margin-bottom: 20px; }
.input { height: 44px; padding: 0 16px; }
.button { height: 40px; padding: 0 24px; }
```

### Responsividad

**Breakpoints:**
```typescript
const breakpoints = {
  sm: 640px,   // Mobile landscape
  md: 768px,   // Tablets
  lg: 1024px,  // Desktop
  xl: 1280px,  // Large desktop
  "2xl": 1536px // Extra large
};
```

**Estrategia Mobile-First:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 columna mobile, 2 tablet, 3 desktop */}
</div>
```

---

## 🔧 Utilidades y Helpers

### Funciones Esenciales (`lib/utils.ts`)

#### 1. `formatRut(rut: string): string`
Formatea RUT chileno a formato visual `XX.XXX.XXX-X`:

```typescript
formatRut("123456789"); // "12.345.678-9"
```

#### 2. `validateRut(rut: string): boolean`
Valida RUT chileno con algoritmo módulo 11:

```typescript
validateRut("12.345.678-9"); // true/false
```

**Algoritmo módulo 11:**
```typescript
// 1. Invertir dígitos
// 2. Multiplicar por serie 2,3,4,5,6,7,2,3...
// 3. Sumar productos
// 4. Módulo 11 de la suma
// 5. 11 - módulo = dígito verificador
// 6. Si resultado=11 → 0, si=10 → K
```

#### 3. `debounce(fn: Function, ms: number)`
Retrasa ejecución de función para optimizar búsquedas:

```typescript
const debouncedSearch = debounce((query: string) => {
  fetchResults(query);
}, 300);
```

#### 4. `cn(...inputs: ClassValue[])`
Combina clases Tailwind con condicionales:

```typescript
cn("text-base", isActive && "font-bold", className);
```

### Constantes Globales (`lib/constants.ts`)

```typescript
export const ROUTES = {
  PUBLIC: {
    LOGIN: "/login",
  },
  PRIVATE: {
    DASHBOARD: "/dashboard",
    MODULES: {
      MI_CUENTA: "/modules/micuenta",
      CONTRATANTE: "/modules/contratante",
      // ...
    },
  },
};

export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Sesión iniciada correctamente",
    SAVE: "Cambios guardados exitosamente",
  },
  ERROR: {
    GENERIC: "Ocurrió un error inesperado",
    NETWORK: "Error de conexión",
  },
};

export const MOCK_CREDENTIALS = {
  email: "test@aflow.cl",
  password: "123456",
};
```

---

## 📡 API Routes y Endpoints

### Estructura de Respuesta Estándar

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Factory functions
ApiResponse.success(data) → { success: true, data, timestamp }
ApiResponse.error(message, code) → { success: false, error: {...}, timestamp }
```

### Endpoints Implementados

#### Autenticación

**POST `/api/auth/login`**
```typescript
// Request
{ email: string, password: string }

// Response 200
{ success: true, data: { user: User, token: string } }

// Response 401
{ success: false, error: { code: "INVALID_CREDENTIALS", message: "..." } }
```

**POST `/api/auth/logout`**
```typescript
// Response 200
{ success: true, data: { message: "Sesión cerrada" } }
```

**GET `/api/auth/session`**
```typescript
// Response 200
{ success: true, data: { user: User } }

// Response 401
{ success: false, error: { code: "UNAUTHORIZED", message: "..." } }
```

#### Menú Dinámico

**GET `/api/menu`**
```typescript
// Response 200
{
  success: true,
  data: {
    items: MenuItem[],
    groups: {
      principal: MenuItem[],
      operaciones: MenuItem[],
      gestion: MenuItem[],
      usuario: MenuItem[]
    }
  }
}
```

#### Contratante (CRUD)

**GET `/api/contratante?search=keyword&tipo=natural&activo=true`**
```typescript
// Response 200
{ success: true, data: Contratante[] }
```

**POST `/api/contratante`**
```typescript
// Request
{ tipo: "natural", nombreCompleto: "...", rut: "...", ... }

// Response 201
{ success: true, data: Contratante }
```

**GET `/api/contratante/:id`**
```typescript
// Response 200
{ success: true, data: Contratante }

// Response 404
{ success: false, error: { code: "NOT_FOUND", message: "..." } }
```

**PUT `/api/contratante/:id`**
```typescript
// Request
{ nombreCompleto: "...", ... }

// Response 200
{ success: true, data: Contratante }
```

**DELETE `/api/contratante/:id`**
```typescript
// Response 200
{ success: true, data: { message: "Eliminado exitosamente" } }
```

#### Health Check

**GET `/api/healthcheck`**
```typescript
// Response 200
{
  success: true,
  data: {
    status: "healthy",
    timestamp: "2025-12-15T10:30:00Z",
    version: "1.0.0"
  }
}
```

---

## 🔍 Sistema de Logging

### Configuración Pino

```typescript
// core/logging/logger.ts
import pino from "pino";

export const appLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});
```

### Métodos Disponibles

```typescript
// Logging general
appLogger.info("Message", { metadata });
appLogger.warn("Warning", { metadata });
appLogger.error("Error", { error });
appLogger.debug("Debug info");

// Logging específico de dominio
appLogger.auth("Login attempt", { email, success: true });
appLogger.api("GET", "/api/users", 200, { duration: 150 });
appLogger.db("Query", "users", { action: "SELECT", rows: 10 });
appLogger.user("Profile updated", { userId, fields: ["nombre", "email"] });
```

### Middlewares de Logging

```typescript
// core/logging/middlewares.ts

// Wrap API routes
export async function withLogging<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    appLogger.info(`${operation} completed`, { duration: Date.now() - start });
    return result;
  } catch (error) {
    appLogger.error(`${operation} failed`, { error, duration: Date.now() - start });
    throw error;
  }
}

// Usage
const contratantes = await withLogging("Fetch contratantes", async () => {
  return await contratanteService.getAll();
});
```

---

## 🧩 Módulos del Sistema

### 1. Dashboard

**Propósito:** Vista principal con métricas y acceso rápido

**Componentes:**
- Tarjeta de bienvenida con gradiente naranja
- 4 Cards de estadísticas (cotizaciones, clientes, ingresos, operaciones)
- Lista de actividad reciente (últimas 5 acciones)
- Grid de acciones rápidas (shortcuts a módulos)

**Datos Mostrados:**
- Estadísticas con tendencias (↑ positivo, ↓ negativo)
- Timestamps relativos ("Hace 5 minutos")
- Badges de estado

### 2. Mi Cuenta

**Propósito:** Gestión de perfil, contraseña y preferencias del usuario

**Secciones (Tabs):**

#### Perfil
- Campos: nombre, apellido, email, cargo, departamento
- Validación: email formato válido, campos obligatorios
- Acción: Guardar cambios

#### Contraseña
- Campos: contraseña actual, nueva contraseña, confirmar contraseña
- Validación: mínimo 6 caracteres, contraseñas coinciden
- Acción: Cambiar contraseña

#### Preferencias
- Notificaciones: Email, Push, Sistema (Switches)
- Idioma: Español (Select)
- Zona Horaria: Santiago/Chile (Select)
- Tema: Claro/Oscuro (próximamente)

**Hooks Usados:**
```typescript
const { updateProfile, changePassword, getPreferences, updatePreferences } = useMiCuenta();
```

### 3. Contratante (CRUD Completo)

**Propósito:** Gestión de clientes y proveedores

**Funcionalidades:**
- ✅ Crear contratante (modal)
- ✅ Listar todos con tabla responsiva
- ✅ Buscar por nombre/RUT/email
- ✅ Filtrar por tipo (natural/jurídica)
- ✅ Filtrar por estado (activo/inactivo)
- ✅ Editar contratante (modal)
- ✅ Eliminar con confirmación

**Validaciones Implementadas:**

```typescript
// RUT Chileno
validateRut(rut) // Algoritmo módulo 11

// Email
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Teléfono
/^\+?[0-9]{9,15}$/.test(telefono)

// Campos obligatorios según tipo
if (tipo === "natural") {
  required: ["nombreCompleto", "rut", "correo", "telefono"]
} else {
  required: ["razonSocial", "rut", "correo", "telefono"]
}
```

**Componentes Clave:**

```typescript
// components/ContratanteTable.tsx
- Búsqueda con debounce 300ms
- Select para filtro tipo
- Select para filtro activo/inactivo
- Acciones: Editar (icon lápiz), Eliminar (icon basura)
- Responsive: scroll horizontal en mobile

// components/ContratanteForm.tsx
- Campos condicionales según tipo
- Validación en tiempo real
- Switch para estado activo
- Textarea para dirección

// components/ContratanteModal.tsx
- Dialog de shadcn/ui
- 600px en desktop, fullscreen en mobile
- Footer con botones Cancelar/Guardar
```

### 4-8. Módulos Placeholder

**Módulos con estructura base:**
- Cotización (`/modules/cotizacion`)
- Comex (`/modules/comex`)
- Guardia (`/modules/guardia`)
- Finanzas (`/modules/finanzas`)
- Clientes (`/modules/clientes`)

**Estructura común:**
```tsx
export default function ModulePlaceholderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ModuleIcon className="h-10 w-10 text-aflow-orange" />
        <h1 className="text-h2">Nombre del Módulo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Módulo en Desarrollo</CardTitle>
          <CardDescription>
            Este módulo estará disponible próximamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Funcionalidad 1</li>
            <li>Funcionalidad 2</li>
            <li>Funcionalidad 3</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="aflow">Configurar Módulo</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

## 🚀 Próximos Pasos Sugeridos

### Fase 2: Implementación de Módulos Restantes

1. **Cotización**
   - CRUD completo de cotizaciones
   - PDF generation con React-PDF
   - Estados: Borrador, Enviado, Aprobado, Rechazado
   - Versionamiento de cotizaciones

2. **Comex (Comercio Exterior)**
   - Gestión de importaciones/exportaciones
   - Tracking de documentos aduaneros
   - Cálculo de aranceles
   - Integración con API de aduanas

3. **Guardia**
   - Turnos de guardias
   - Calendario de disponibilidad
   - Notificaciones de turnos
   - Reportes de incidencias

4. **Finanzas**
   - Dashboard de ingresos/egresos
   - Facturación electrónica (SII Chile)
   - Conciliación bancaria
   - Reportes financieros

5. **Clientes (CRM)**
   - Base de datos de clientes
   - Historial de interacciones
   - Segmentación
   - Campañas de marketing

### Fase 3: Mejoras de Infraestructura

- **Migración a Supabase Real:**
  - Configurar tablas PostgreSQL
  - Row Level Security (RLS)
  - Real-time subscriptions

- **Testing:**
  - Jest + React Testing Library (unit tests)
  - Playwright (E2E tests)
  - Coverage > 80%

- **CI/CD:**
  - GitHub Actions
  - Deploy automático a Vercel
  - Preview deployments

- **Optimizaciones:**
  - React Query para caché
  - Optimistic updates
  - Code splitting por módulo
  - Image optimization

---

## 📚 Glosario de Términos

| Término | Definición |
|---------|------------|
| **AFLOW** | Nombre de la empresa/portal |
| **Contratante** | Cliente o proveedor que firma contratos (Persona Natural o Jurídica) |
| **Comex** | Comercio Exterior - módulo para operaciones de importación/exportación |
| **RUT** | Rol Único Tributario - identificador fiscal chileno |
| **Módulo 11** | Algoritmo matemático para validar dígito verificador del RUT |
| **Clean Architecture** | Patrón arquitectónico de Robert C. Martin (Uncle Bob) |
| **RBAC** | Role-Based Access Control - control de acceso basado en roles |
| **shadcn/ui** | Colección de componentes UI reutilizables para React |
| **Server Component** | Componente React que se renderiza en el servidor (Next.js 15) |
| **API Route** | Endpoint serverless en Next.js bajo `/app/api` |

---

## 🔗 Referencias y Recursos

### Documentación Oficial
- [Next.js 15 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Pino Logging](https://getpino.io/)

### Artículos Clave
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/routing)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 👨‍💻 Contexto para Nuevos Desarrolladores

### Onboarding Checklist

- [ ] Leer README.md completo
- [ ] Leer project-description.md (este documento)
- [ ] Ejecutar `npm install` y `npm run dev`
- [ ] Explorar código en este orden:
  1. `lib/constants.ts` - Entender constantes globales
  2. `types/index.d.ts` - Revisar tipos TypeScript
  3. `app/(private)/layout.tsx` - Entender flujo de autenticación
  4. `components/shared/Sidebar.tsx` - Ver menú dinámico
  5. `app/(private)/modules/contratante/` - Estudiar módulo completo
- [ ] Probar login con `test@aflow.cl` / `123456`
- [ ] Navegar todos los módulos
- [ ] Revisar logs en consola del navegador y terminal
- [ ] Leer código de `hooks/useContratante.ts` como ejemplo de patrón

### Convenciones de Commits

```bash
# Formato: tipo(scope): mensaje

feat(contratante): add export to Excel functionality
fix(auth): correct session expiration validation
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(services): extract common API logic
test(contratante): add unit tests for validation
chore(deps): update Next.js to 15.0.4
```

### Workflow de Desarrollo

```bash
# 1. Crear rama feature
git checkout -b feature/modulo-cotizacion

# 2. Desarrollar
npm run dev  # Terminal 1
npm run type-check  # Terminal 2 (watch mode)

# 3. Commit incremental
git add .
git commit -m "feat(cotizacion): add basic CRUD structure"

# 4. Push y PR
git push origin feature/modulo-cotizacion
# Crear Pull Request en GitHub

# 5. Code Review
# Esperar aprobación de al menos 1 reviewer

# 6. Merge
# Squash and merge a main
```

---

## 📝 Notas Finales

Este documento debe ser actualizado cada vez que:
- Se agregue un nuevo módulo completo
- Se modifique la arquitectura base
- Se introduzcan nuevos patrones o convenciones
- Se actualicen dependencias mayores (Next.js, React, etc.)

**Última actualización:** Diciembre 2025  
**Versión del proyecto:** 1.0.0  
**Mantenedor:** Equipo AFLOW
