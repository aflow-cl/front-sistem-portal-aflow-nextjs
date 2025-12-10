# 🚀 AFLOW Portal - Sistema Corporativo

![AFLOW Portal](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)

Portal Corporativo AFLOW - Sistema Modular Empresarial construido con Next.js 15, TypeScript, TailwindCSS y shadcn/ui. Plataforma escalable y moderna diseñada para la gestión corporativa integral.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#️-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Rutas y Navegación](#-rutas-y-navegación)
- [Componentes UI](#-componentes-ui)
- [Configuración de Estilos](#-configuración-de-estilos)
- [Despliegue](#-despliegue)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Stack Tecnológico](#-stack-tecnológico)
- [Extensión del Proyecto](#-extensión-del-proyecto)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)

---

## ✨ Características

### Características Principales

- ✅ **Next.js 15** con App Router y React Server Components
- ✅ **TypeScript Estricto** para máxima seguridad de tipos
- ✅ **TailwindCSS** con sistema de diseño corporativo AFLOW
- ✅ **shadcn/ui** - Biblioteca de componentes modernos y accesibles
- ✅ **Autenticación Mock** con sistema de sesiones completo
- ✅ **Diseño Responsivo** - Mobile-first approach
- ✅ **Arquitectura Limpia** - Separación de responsabilidades
- ✅ **Logging Estructurado** con Pino
- ✅ **Validación de Formularios** con React Hook Form + Zod
- ✅ **Optimizado para SEO** y rendimiento
- ✅ **Listo para Producción** - Deploy inmediato en Vercel

### Estado del Proyecto

- ✅ Compilación exitosa sin errores
- ✅ Sin warnings de TypeScript o ESLint
- ✅ Todas las rutas funcionales
- ✅ Autenticación implementada
- ✅ Responsive design completo
- ✅ Documentación exhaustiva

---

## 🏗️ Arquitectura

### Principios de Diseño

El proyecto sigue los principios de **Clean Architecture** con las siguientes capas:

```
┌─────────────────────────────────────────────────┐
│         Capa de Presentación                    │
│  - Pages (React Server Components)              │
│  - Layouts (Public/Private)                     │
│  - UI Components (shadcn/ui)                    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│       Capa de Lógica de Negocio                 │
│  - Custom Hooks (useAuth)                       │
│  - Utilidades (formateo, validación)            │
│  - Gestión de estado                            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│           Capa de Datos                         │
│  - Supabase Client                              │
│  - Auth Mock Service                            │
│  - API Integration (futuro)                     │
└─────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
Usuario → Login Page → useAuth Hook → Auth Service Mock 
    → Session Storage → Private Routes → Portal Dashboard
```

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **Git:** Para control de versiones

Verifica tus versiones:

```powershell
node --version
npm --version
git --version
```

---

## 🛠️ Instalación

### 1. Clonar el Repositorio

```powershell
git clone https://github.com/aflow-cl/front-sistem-portal-aflow-nextjs.git
cd front-sistem-portal-aflow-nextjs
```

### 2. Instalar Dependencias

```powershell
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```powershell
# Copiar el archivo de ejemplo (si existe)
Copy-Item .env.example .env.local

# O crear uno nuevo
New-Item .env.local
```

Contenido del archivo `.env.local`:

```env
# Supabase Configuration (Opcional para mock)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Nota:** Las variables de Supabase son opcionales en desarrollo ya que el proyecto usa autenticación mock.

---

## 🏃‍♂️ Ejecución

### Modo Desarrollo

Inicia el servidor de desarrollo:

```powershell
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilación de Producción

```powershell
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start
```

### Verificación de Tipos

```powershell
npm run type-check
```

### Linting

```powershell
npm run lint
```

### Formateo de Código

```powershell
npm run format
```

---

## 📁 Estructura del Proyecto

```
aflow-portal/
├── app/                          # Next.js App Router
│   ├── (public)/                # Rutas públicas
│   │   ├── page.tsx            # Landing Page
│   │   └── login/
│   │       └── page.tsx        # Página de login
│   ├── (private)/              # Rutas privadas (futuro)
│   ├── portal/                 # Área protegida
│   │   ├── layout.tsx         # Layout privado
│   │   ├── page.tsx           # Dashboard
│   │   └── presupuesto/       # Módulo presupuesto
│   ├── layout.tsx             # Layout global
│   └── globals.css            # Estilos globales
│
├── components/                 # Componentes React
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx        # Header público
│   │   ├── Footer.tsx        # Footer
│   │   └── NavPublic.tsx     # Navegación pública
│   └── ui/                   # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       └── ParticleBackground.tsx
│
├── hooks/                     # Custom React Hooks
│   └── useAuth.ts            # Hook de autenticación
│
├── lib/                       # Librerías y utilidades
│   ├── utils.ts              # Utilidades (cn, formatRut, etc.)
│   ├── env.ts                # Validación de variables de entorno
│   └── pino-client.ts        # Cliente de logging
│
├── data/                      # Capa de datos
│   └── supabase/
│       ├── client.ts         # Cliente Supabase
│       └── auth.ts           # Servicio de autenticación mock
│
├── types/                     # Definiciones TypeScript
│   └── index.d.ts            # Tipos globales
│
├── public/                    # Archivos estáticos
│   └── images/
│       └── company/
│
├── components.json            # Configuración shadcn/ui
├── next.config.ts            # Configuración Next.js
├── tailwind.config.ts        # Configuración Tailwind
├── tsconfig.json             # Configuración TypeScript
└── package.json              # Dependencias del proyecto
```

---

## 🔐 Sistema de Autenticación

### Credenciales de Prueba

Para acceder al sistema, usa las siguientes credenciales:

```
Email:    test@aflow.cl
Password: 123456
```

### Características del Sistema Mock

- **Usuario Predefinido:** Información completa (nombre, email, rol, etc.)
- **Sesión Persistente:** Almacenada en `localStorage`
- **Expiración Automática:** 24 horas
- **Protección de Rutas:** Middleware de autenticación
- **Redirección Automática:** Login requerido para rutas privadas

### Hook useAuth

El hook `useAuth` proporciona:

```typescript
const { 
  user,              // Usuario actual
  session,           // Sesión activa
  isLoading,         // Estado de carga
  isAuthenticated,   // Estado de autenticación
  login,             // Función de login
  logout,            // Función de logout
  requireAuth        // Protección de componentes
} = useAuth();
```

### Ejemplo de Uso

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProtectedPage() {
  const { user, logout, requireAuth } = useAuth();
  
  requireAuth(); // Redirige a login si no autenticado
  
  return (
    <div>
      <h1>Bienvenido, {user?.nombre}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### Migración a Supabase Real

Para implementar autenticación real:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Configura las variables en `.env.local`
3. Actualiza las funciones en `data/supabase/auth.ts`
4. Implementa los métodos de Supabase Auth

---

## 🌐 Rutas y Navegación

### Rutas Públicas

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/` | Landing Page corporativa | `app/page.tsx` |
| `/login` | Página de autenticación | `app/login/page.tsx` |

### Rutas Privadas (Requieren Autenticación)

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/portal` | Dashboard principal | `app/portal/page.tsx` |
| `/portal/presupuesto` | Módulo de presupuesto | `app/portal/presupuesto/page.tsx` |

### Navegación Programática

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

// Navegar a una ruta
router.push("/portal");

// Reemplazar historial
router.replace("/login");

// Retroceder
router.back();
```

---

## 🧩 Componentes UI

### Componentes shadcn/ui Instalados

- ✅ **Button** - Botones con variantes
- ✅ **Input** - Campos de entrada
- ✅ **Card** - Tarjetas de contenido
- ✅ **Label** - Etiquetas de formulario
- ✅ **Form** - Formularios con validación
- ✅ **Separator** - Divisores visuales
- ✅ **Dialog** - Modales
- ✅ **Dropdown Menu** - Menús desplegables
- ✅ **Select** - Selectores
- ✅ **Switch** - Interruptores
- ✅ **Tabs** - Pestañas
- ✅ **Toast** - Notificaciones

### Agregar Nuevos Componentes

```powershell
# Ver componentes disponibles
npx shadcn@latest add

# Agregar un componente específico
npx shadcn@latest add [nombre-componente]

# Ejemplos
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Componentes Personalizados

#### ParticleBackground

Fondo animado con partículas para el hero:

```tsx
import { ParticleBackground } from "@/components/ui/ParticleBackground";

<section className="relative">
  <ParticleBackground />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</section>
```

---

## 🎨 Configuración de Estilos

### Paleta de Colores Corporativa AFLOW

```css
/* Colores principales */
--aflow-orange: #FF7A00      /* CTA y elementos destacados */
--black: #000000             /* Texto principal */
--white: #FFFFFF             /* Fondos claros */
--gray-dark: #1A1A1A         /* Fondos oscuros */
--gray-medium: #4D4D4D       /* Texto secundario */
```

### Uso en Tailwind

```tsx
// Naranja AFLOW
<div className="bg-aflow-orange text-white">
  
// Grises corporativos
<div className="bg-gray-dark text-white">
<p className="text-gray-medium">
```

### Tipografía

```css
/* Fuentes configuradas */
font-family: 'Inter', sans-serif;        /* Texto general */
font-family: 'Poppins', sans-serif;      /* Títulos */
```

Uso en componentes:

```tsx
<h1 className="font-poppins font-bold">Título</h1>
<p className="font-inter">Texto normal</p>
```

### Utilidades Personalizadas

El proyecto incluye utilidades en `lib/utils.ts`:

```typescript
import { cn, formatRut, formatCurrency } from "@/lib/utils";

// Combinar clases condicionales
<div className={cn("base-class", condition && "conditional-class")} />

// Formatear RUT chileno
formatRut("12345678-9") // → "12.345.678-9"

// Formatear moneda
formatCurrency(1234567) // → "$1.234.567"
```

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)

#### Deploy Automático con GitHub

1. **Push a GitHub:**

```powershell
git add .
git commit -m "feat: AFLOW Portal ready for production"
git push origin main
```

2. **Importar en Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `front-sistem-portal-aflow-nextjs`
   - Click en **"Deploy"**

3. **Configuración Automática:**
   - **Framework:** Next.js (detectado automáticamente)
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Variables de Entorno:**
   - En el dashboard de Vercel, ve a **Settings → Environment Variables**
   - Agrega las variables necesarias

#### Deploy con Vercel CLI

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy a producción
vercel --prod
```

### Opción 2: Otros Proveedores

#### Netlify

```powershell
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```powershell
# Build y run
docker build -t aflow-portal .
docker run -p 3000:3000 aflow-portal
```

---

## 🔧 Variables de Entorno

### Desarrollo (.env.local)

```env
# Supabase (Opcional para mock)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción (Vercel)

Configura en el dashboard de Vercel:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu clave anónima | Clave pública |
| `NEXT_PUBLIC_APP_URL` | Tu dominio | URL de producción |

---

## 📜 Scripts Disponibles

```powershell
# Desarrollo
npm run dev           # Servidor de desarrollo en puerto 3000

# Producción
npm run build         # Compilar para producción
npm run start         # Servidor de producción

# Calidad de código
npm run lint          # Ejecutar ESLint
npm run type-check    # Verificar tipos TypeScript
npm run format        # Formatear código con Prettier
```

---

## 🔨 Stack Tecnológico

### Core Framework

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.0.3 | Framework React con SSR/SSG |
| **React** | 18.3.1 | Biblioteca UI |
| **TypeScript** | 5.3.3 | Type Safety |

### Styling

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TailwindCSS** | 3.4.1 | Utility-first CSS |
| **shadcn/ui** | Latest | Sistema de componentes |
| **Lucide React** | 0.303.0 | Iconos |
| **class-variance-authority** | 0.7.0 | Variantes de componentes |

### Formularios y Validación

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | 7.68.0 | Gestión de formularios |
| **Zod** | 3.25.76 | Validación de esquemas |
| **@hookform/resolvers** | 3.10.0 | Resolvers de validación |

### Backend e Integración

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **@supabase/supabase-js** | 2.39.3 | Cliente Supabase |
| **Pino** | 8.17.2 | Logging estructurado |
| **Pino Pretty** | 10.3.1 | Formateo de logs |

### UI/UX Adicional

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Radix UI** | Various | Componentes accesibles |
| **Sonner** | 1.3.1 | Sistema de toasts |
| **clsx** | 2.1.0 | Utilidad de clases |
| **tailwind-merge** | 2.2.0 | Merge de clases Tailwind |

### Developer Tools

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **ESLint** | 8.56.0 | Linting |
| **Prettier** | Latest | Formateo de código |
| **Autoprefixer** | 10.4.17 | Prefijos CSS |
| **PostCSS** | 8.4.33 | Procesamiento CSS |

---

## 🚧 Extensión del Proyecto

Este es el **proyecto base funcional**. Para extenderlo:

### Módulos Planificados

1. **Dashboard con Métricas**
   - Gráficos y estadísticas
   - KPIs corporativos
   - Widgets personalizables

2. **Módulo Contratante**
   - CRUD completo
   - Búsqueda y filtros
   - Exportación de datos

3. **Módulo Cotización**
   - Generación de cotizaciones
   - Gestión de presupuestos
   - Reportes PDF

4. **API Routes**
   - Endpoints RESTful
   - Autenticación JWT
   - Validación de datos

5. **Gestión de Usuarios**
   - Roles y permisos
   - Invitaciones
   - Perfil de usuario

### Mejoras Técnicas

- **Testing:** Jest + React Testing Library
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, Vercel Analytics
- **i18n:** Internacionalización
- **PWA:** Progressive Web App
- **E2E Testing:** Playwright o Cypress

---

## 🐛 Solución de Problemas

### Error: Module not found

```powershell
# Limpiar cache y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error de compilación TypeScript

```powershell
# Verificar tipos
npm run type-check

# Ver detalles de errores
npx tsc --noEmit --pretty
```

### Hot Reload no funciona

```powershell
# Detener servidor (Ctrl+C) y reiniciar
npm run dev

# Si persiste, limpiar .next
Remove-Item -Recurse -Force .next
npm run dev
```

### Problemas con shadcn/ui

```powershell
# Reinstalar componentes
npx shadcn@latest add button input card form

# Verificar configuración
cat components.json
```

### Error de variables de entorno

```powershell
# Verificar archivo .env.local
cat .env.local

# Reiniciar servidor después de cambios
npm run dev
```

### Build falla en Vercel

1. Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
2. Asegúrate de que las variables de entorno estén configuradas
3. Revisa los logs de build en Vercel dashboard
4. Ejecuta `npm run build` localmente para replicar el error

---

## 👥 Contribuciones

### Proceso de Contribución

1. **Fork el repositorio**

```powershell
# Clonar tu fork
git clone https://github.com/tu-usuario/front-sistem-portal-aflow-nextjs.git
```

2. **Crear una rama feature**

```powershell
git checkout -b feature/nueva-funcionalidad
```

3. **Hacer cambios y commit**

```powershell
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

4. **Push a tu fork**

```powershell
git push origin feature/nueva-funcionalidad
```

5. **Abrir un Pull Request**

### Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: formato, punto y coma faltante, etc.
refactor: refactorización de código
test: agregar tests
chore: mantención, dependencias, etc.
```

### Code Style

- Usa **TypeScript** estricto
- Sigue las reglas de **ESLint**
- Formatea con **Prettier** antes de commit
- Escribe **componentes reutilizables**
- Agrega **comentarios** en lógica compleja

---

## 📄 Licencia

Este proyecto es propiedad de **AFLOW**. Todos los derechos reservados.

---

## 📞 Soporte y Contacto

Para soporte técnico o consultas:

- **Email:** desarrollo@aflow.cl
- **GitHub Issues:** [Reportar un problema](https://github.com/aflow-cl/front-sistem-portal-aflow-nextjs/issues)
- **Documentación:** Ver `project-description.md` para detalles técnicos

---

## 🙏 Agradecimientos

Desarrollado con ❤️ por el equipo de desarrollo AFLOW.

### Recursos Útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación React](https://react.dev)
- [Documentación TypeScript](https://www.typescriptlang.org/docs)
- [Documentación TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Producción Ready
