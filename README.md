# AFLOW Portal - Sistema Empresarial Modular

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Portal corporativo modular desarrollado con Next.js 15, diseñado para gestión empresarial integrada con arquitectura limpia, autenticación Supabase, y diseño responsivo moderno.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos](#-módulos)
- [Estándares de Código](#-estándares-de-código)
- [Estándares UI/UX](#-estándares-uiux)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contribución](#-contribución)

---

## ✨ Características

### Funcionalidades Core

- ✅ **Autenticación Mock con Supabase** - Sistema de login simulado con roles (Admin, Analista, Operador)
- ✅ **Dashboard Interactivo** - Vista general con métricas, actividad reciente y acciones rápidas
- ✅ **Menú Dinámico por Roles** - Navegación adaptativa según permisos del usuario
- ✅ **Módulo Mi Cuenta** - Gestión completa de perfil, contraseña y preferencias
- ✅ **Módulo Contratante (CRUD)** - Gestión completa con modal responsivo y validaciones
- ✅ **Logging Centralizado** - Sistema Pino para trazabilidad completa
- ✅ **Diseño Responsivo** - Mobile-first con breakpoints optimizados
- ✅ **Clean Architecture** - Separación por capas (Domain, Use Cases, Services)

### Módulos Disponibles

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Dashboard** | ✅ Completo | Vista principal con estadísticas y actividad |
| **Mi Cuenta** | ✅ Completo | Perfil, contraseña, preferencias |
| **Contratante** | ✅ Completo | CRUD completo con validaciones |
| **Cotización** | 🚧 Placeholder | Gestión de cotizaciones (próximamente) |
| **Comex** | 🚧 Placeholder | Comercio exterior (próximamente) |
| **Guardia** | 🚧 Placeholder | Gestión de guardias (próximamente) |
| **Finanzas** | 🚧 Placeholder | Gestión financiera (próximamente) |
| **Clientes** | 🚧 Placeholder | CRM de clientes (próximamente) |

---

## 🛠 Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 18** - Biblioteca UI
- **TypeScript 5.3** - Tipado estático
- **TailwindCSS 3.4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles y personalizables
- **Radix UI** - Primitivas UI headless

### Backend/API
- **Next.js API Routes** - Endpoints serverless
- **Pino** - Logger de alto rendimiento
- **Zod** - Validación de esquemas TypeScript-first

### Autenticación
- **Supabase Client** - Mock authentication (desarrollo)
- **localStorage** - Persistencia de sesión

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Prefijos CSS automáticos

---

## 🏗 Arquitectura

### Clean Architecture

El proyecto implementa Clean Architecture con las siguientes capas:

```
┌─────────────────────────────────────┐
│       Presentation Layer            │
│  (Pages, Components, Hooks)         │
├─────────────────────────────────────┤
│       Application Layer             │
│    (Use Cases, Services)            │
├─────────────────────────────────────┤
│        Domain Layer                 │
│    (Entities, Types, Rules)         │
├─────────────────────────────────────┤
│    Infrastructure Layer             │
│  (API, Database, External)          │
└─────────────────────────────────────┘
```

### Patrones Implementados

- **Repository Pattern** - Abstracción de acceso a datos
- **Service Pattern** - Lógica de negocio encapsulada
- **Custom Hooks Pattern** - Lógica reutilizable de React
- **Presentational/Container Pattern** - Separación UI/lógica

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/aflow-cl/front-sistem-portal-aflow-nextjs.git
cd front-sistem-portal-aflow-nextjs

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local .env

# 4. Ejecutar en modo desarrollo
npm run dev
```

El portal estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

Archivo `.env.local`:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=AFLOW Portal
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Mock)
NEXT_PUBLIC_SUPABASE_URL=https://mock.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-anon-key-aflow-portal-development
SUPABASE_SERVICE_ROLE_KEY=mock-service-role-key-aflow-portal-development

# API
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000

# Logging
LOG_LEVEL=info
ENABLE_LOGGING=true

# Feature Flags
FEATURE_AUTH_ENABLED=true
FEATURE_MOCK_DATA=true
```

### Credenciales de Desarrollo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | test@aflow.cl | 123456 |
| Analista | analista@aflow.cl | 123456 |
| Operador | operador@aflow.cl | 123456 |

---

## 📁 Estructura del Proyecto

```
front-sistem-portal-aflow-nextjs/
├── app/
│   ├── (public)/              # Rutas públicas
│   │   └── login/
│   ├── (private)/             # Rutas privadas (requieren auth)
│   │   ├── dashboard/
│   │   ├── modules/           # Módulos de negocio
│   │   │   ├── micuenta/
│   │   │   ├── contratante/
│   │   │   ├── cotizacion/
│   │   │   └── ...
│   │   └── settings/
│   ├── api/                   # API Routes
│   │   ├── auth/
│   │   ├── menu/
│   │   ├── contratante/
│   │   └── healthcheck/
│   ├── layout.tsx             # Layout raíz
│   ├── page.tsx               # Página principal
│   └── globals.css            # Estilos globales
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   └── shared/                # Componentes compartidos
│       ├── Sidebar.tsx
│       └── Header.tsx
├── core/
│   ├── domain/                # Entidades de dominio
│   ├── usecases/              # Casos de uso
│   ├── repositories/          # Interfaces de repositorios
│   ├── services/              # Servicios de aplicación
│   └── logging/               # Sistema de logging
│       ├── logger.ts
│       └── middlewares.ts
├── data/
│   ├── db/                    # Acceso a base de datos
│   ├── supabase/              # Cliente Supabase
│   │   ├── client.ts
│   │   └── auth.ts
│   ├── api/                   # Clientes API externos
│   └── adapters/              # Adaptadores de datos
├── hooks/                     # Custom React Hooks
│   ├── useAuth.ts
│   ├── useMenu.ts
│   ├── useFetch.ts
│   └── ...
├── lib/                       # Utilidades y helpers
│   ├── utils.ts
│   ├── constants.ts
│   ├── permissions.ts
│   └── env.ts
├── types/                     # Tipos TypeScript globales
│   └── index.d.ts
├── public/                    # Assets estáticos
├── styles/                    # Estilos adicionales
├── tests/                     # Tests unitarios e integración
├── next.config.mjs            # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
├── components.json            # Configuración shadcn/ui
├── package.json
└── README.md
```

---

## 📱 Módulos

### 1. Mi Cuenta

**Ruta:** `/modules/micuenta`

**Características:**
- Edición de perfil personal
- Cambio de contraseña con validación
- Configuración de preferencias (notificaciones, idioma, zona horaria)
- Tabs para organización

**Componentes:**
- `ProfileForm.tsx` - Formulario de datos personales
- `ChangePassword.tsx` - Cambio de contraseña
- `Preferences.tsx` - Configuración de usuario

### 2. Contratante (CRUD Completo)

**Ruta:** `/modules/contratante`

**Características:**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Modal responsivo (600px desktop / fullscreen mobile)
- Validación de RUT chileno (algoritmo módulo 11)
- Soporte para Persona Natural y Jurídica
- Filtros avanzados (búsqueda, tipo, estado)
- Tabla responsiva con paginación

**Tipos de Datos:**
```typescript
interface Contratante {
  id: string;
  tipo: "natural" | "juridica";
  nombreCompleto?: string;    // Para persona natural
  razonSocial?: string;        // Para persona jurídica
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Validaciones:**
- RUT chileno con dígito verificador
- Email formato válido
- Teléfono mínimo 9 dígitos
- Campos obligatorios según tipo

---

## 🎨 Estándares UI/UX

### Paleta Corporativa AFLOW

```css
/* Colores Principales */
--aflow-orange: #FF7A00;      /* Solo CTA */
--aflow-black: #000000;
--aflow-white: #FFFFFF;

/* Colores Secundarios */
--gray-dark: #1A1A1A;
--gray-medium: #4D4D4D;
--gray-light: #EDEDED;
```

### Tipografías

- **Poppins** - Títulos y encabezados (400, 500, 600, 700)
- **Inter** - Contenido y cuerpo (400, 500, 600, 700)

### Jerarquía Tipográfica

| Elemento | Tamaño | Weight | Line Height |
|----------|--------|--------|-------------|
| H1 | 56px | 700 | 1.2 |
| H2 | 36px | 600 | 1.3 |
| H3 | 28px | 500 | 1.4 |
| Body | 18px | 400 | 1.6 |
| Small | 14px | 400 | 1.5 |

### Espaciado

- Contenedores: padding 24px (mobile) / 32px (desktop)
- Cards: padding 24px
- Inputs: height 44px
- Buttons: height 40px (default), 44px (large)

### Componentes Clave

**Botón CTA (Naranja AFLOW):**
```tsx
<Button variant="aflow">Acción Principal</Button>
```

**Card Estándar:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

---

## 💻 Estándares de Código

### TypeScript

- Tipado estricto obligatorio
- Evitar `any` (usar `unknown` si es necesario)
- Interfaces para objetos, Types para uniones/intersecciones
- Exports nombrados preferidos sobre default exports

### Naming Conventions

```typescript
// Componentes - PascalCase
export function UserProfile() { }

// Hooks - camelCase con prefijo 'use'
export function useAuth() { }

// Constantes - UPPER_SNAKE_CASE
export const API_BASE_URL = "...";

// Funciones - camelCase
export function formatRut(rut: string) { }

// Tipos/Interfaces - PascalCase
export interface User { }
export type UserRole = "admin" | "analista";
```

### Estructura de Archivos

```
module/
├── page.tsx              # Página principal
├── components/           # Componentes del módulo
│   ├── ModuleTable.tsx
│   ├── ModuleForm.tsx
│   └── ModuleModal.tsx
├── hooks/                # Hooks del módulo
│   └── useModule.ts
├── services/             # Servicios/API del módulo
│   └── module.service.ts
├── types/                # Tipos del módulo
│   └── module.d.ts
└── mock/                 # Datos mock
    └── data.json
```

### Comentarios

```typescript
/**
 * Descripción de la función
 * @param param1 - Descripción del parámetro
 * @returns Descripción del retorno
 */
export function example(param1: string): boolean {
  // Comentario de implementación
  return true;
}
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor desarrollo (port 3000)

# Build
npm run build            # Construye para producción
npm run start            # Inicia servidor producción

# Calidad de Código
npm run lint             # Ejecuta ESLint
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formatea código con Prettier

# Utilidades
npm run clean            # Limpia build y caché
```

---

## 🧪 Testing

### Estructura de Tests

```
tests/
├── unit/               # Tests unitarios
├── integration/        # Tests de integración
└── e2e/               # Tests end-to-end
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build imagen
docker build -t aflow-portal .

# Ejecutar contenedor
docker run -p 3000:3000 aflow-portal
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`

---

## 📊 Logging

### Sistema Pino

El proyecto utiliza Pino para logging estructurado:

```typescript
import { appLogger } from "@/core/logging/logger";

// Niveles disponibles
appLogger.info("Mensaje informativo");
appLogger.warn("Advertencia");
appLogger.error("Error", error);
appLogger.debug("Debug info");

// Logging específico de dominio
appLogger.auth("Login successful", { userId });
appLogger.api("GET", "/api/users", 200);
appLogger.db("Query", "users", { id: 1 });
```

### Configuración

- **Desarrollo:** Pretty print con colores
- **Producción:** JSON estructurado
- Nivel configurable por `LOG_LEVEL` env variable

---

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar funcionalidad X'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan código)
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo

**AFLOW** - Portal Empresarial  
Email: contacto@aflow.cl  
Versión: 1.0.0  
Última actualización: Diciembre 2025

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
