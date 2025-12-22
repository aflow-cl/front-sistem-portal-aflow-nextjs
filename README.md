# 🚀 AFLOW Portal - Sistema Corporativo

![AFLOW Portal](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)

Portal Corporativo AFLOW - Sistema Modular Empresarial construido con Next.js 15, TypeScript, TailwindCSS y shadcn/ui. Plataforma escalable y moderna diseñada para la gestión corporativa integral.

---

## ⚡ Quick Start (TL;DR)

¿Necesitas arrancar rápido? Aquí está todo lo esencial:

```powershell
# Clonar e instalar
git clone https://github.com/aflow-cl/front-sistem-portal-aflow-nextjs.git
cd front-sistem-portal-aflow-nextjs
npm install

# Ejecutar en desarrollo
npm run dev
```

**🌐 Abrir:** http://localhost:3000  
**🔐 Login de prueba:** `test@aflow.cl` / `123456`  
**📊 Explora el sistema:**
- **Dashboard:** `/portal` - Analytics con 3 gráficos interactivos y 4 KPIs
- **Presupuestos Consultar:** `/portal/presupuesto/consultar` - Gestión completa con filtros
- **Presupuestos Crear:** `/portal/presupuesto/crear` - Wizard de creación paso a paso
- **Presupuestos Editar:** `/portal/presupuesto/editar/[id]` - Edición con historial y notas
- **Presupuestos Historia:** `/portal/presupuesto/historia` - Timeline completo
- **Ajustes AFLOW:** `/portal/ajustes-aflow` - Configuración y administración del sistema

> **Nota:** No necesitas configurar Supabase - la autenticación mock funciona out-of-the-box.

---

## 📋 Tabla de Contenidos

- [Quick Start](#-quick-start-tldr)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#️-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Módulo Presupuesto](#-módulo-presupuesto)
- [Módulo Ajustes AFLOW](#-módulo-ajustes-aflow)
- [Rutas y Navegación](#-rutas-y-navegación)
- [Componentes UI](#-componentes-ui)
- [Configuración de Estilos](#-configuración-de-estilos)
- [Despliegue](#-despliegue)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Stack Tecnológico](#-stack-tecnológico)
- [Extensión del Proyecto](#-extensión-del-proyecto)
- [Documentación Adicional](#-documentación-adicional)
- [FAQ](#-faq-preguntas-frecuentes)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)

---

## 📊 Estado del Proyecto

| Módulo/Feature | Estado | Detalles |
|----------------|--------|----------|
| **Autenticación** | ✅ Completo | Sistema mock con sesiones, migración a Supabase documentada |
| **Landing Page** | ✅ Completo | Hero con partículas, sección features, diseño responsivo |
| **Login Page** | ✅ Completo | Carousel informativo, validación con Zod, tema dark |
| **Portal Layout** | ✅ Completo | Sidebar, header, protección de rutas, QueryProvider |
| **Dashboard Principal** | ✅ Completo | Analytics con 3 gráficos (Recharts), Indicadores KPI, useBudgetAnalytics hook |
| **Módulo Presupuesto** | ✅ Completo | CRUD completo con React Query, 4 sub-rutas funcionales |
| **Módulo Consultar** | ✅ Completo | Tabla mejorada, filtros avanzados, indicadores, paginación |
| **Módulo Crear** | ✅ Completo | Wizard completo, validación, modales, progreso |
| **Módulo Editar** | ✅ Completo | Edición completa, historial, notas, duplicar, compartir |
| **Módulo Historia** | ✅ Completo | Timeline de presupuestos, filtros por fecha/estado |
| **Módulo Ajustes AFLOW** | ✅ Completo | Dashboard, Clientes, Perfiles, Opciones Menú, Servicios |
| **Ajustes - Dashboard** | ✅ Completo | Métricas sistema, actividad reciente, KPIs administración |
| **Ajustes - Clientes** | ✅ Completo | CRUD completo, sucursales, usuarios, servicios contratados |
| **Ajustes - Perfiles** | ✅ Completo | Gestión roles, permisos granulares, asignación usuarios |
| **Ajustes - Opciones Menú** | ✅ Completo | Configuración menú, visibilidad por perfil, ordenamiento |
| **Ajustes - Servicios** | ✅ Completo | Catálogo servicios, planes, tarifas, clientes activos |
| **Módulo Contratante** | 📋 Futuro | CRUD, búsqueda avanzada, exportación |
| **Módulo Cotización** | 📋 Futuro | Generación de cotizaciones, reportes PDF |
| **API Routes** | 📋 Futuro | Endpoints RESTful, autenticación JWT |
| **Testing Suite** | 📋 Futuro | Jest, React Testing Library, E2E |

**Leyenda:** ✅ Completo | 🚧 En desarrollo | 📋 Planificado

### Métricas de Calidad

- ✅ **Build Status:** Sin errores de compilación
- ✅ **TypeScript:** Strict mode, 100% tipado
- ✅ **ESLint:** Configurado y sin errores bloqueantes
- ✅ **Deployment:** Vercel-ready, CI/CD compatible
- ✅ **Documentation:** 4 documentos técnicos completos

---

## ✨ Características

### Características Principales

- ✅ **Next.js 15.0.3** con App Router y React Server Components
- ✅ **TypeScript Estricto** para máxima seguridad de tipos
- ✅ **TailwindCSS 3.4.1** con sistema de diseño corporativo AFLOW
- ✅ **shadcn/ui** - 20+ componentes modernos y accesibles
- ✅ **Autenticación Mock** con sistema de sesiones completo
- ✅ **React Query v5** para gestión de estado del servidor y caché
- ✅ **Módulo Presupuesto Completo** - 4 sub-rutas (Consultar, Crear, Editar, Historia)
- ✅ **Módulo Ajustes AFLOW Completo** - 5 sub-rutas (Dashboard, Clientes, Perfiles, Opciones Menú, Servicios)
- ✅ **Dashboard con Analytics** - Gráficos interactivos con Recharts 3.5.1
- ✅ **Diseño Responsivo** - Mobile-first approach
- ✅ **Arquitectura Limpia** - Separación de responsabilidades
- ✅ **Logging Estructurado** con Pino
- ✅ **Validación de Formularios** con React Hook Form + Zod
- ✅ **Optimizado para SEO** y rendimiento
- ✅ **Listo para Producción** - Deploy inmediato en Vercel

### Estado del Build Actual

- ✅ **Build Status:** Compilación exitosa sin errores (Last build: Diciembre 2025)
- ✅ **TypeScript:** Zero errores con strict mode activado
- ✅ **ESLint:** Sin warnings bloqueantes
- ✅ **Todas las rutas funcionales:** 5+ rutas públicas y privadas
- ✅ **Autenticación Mock:** Sistema completo con sesiones persistentes
- ✅ **Responsive Design:** Optimizado para mobile, tablet y desktop
- ✅ **Documentación:** 4 archivos técnicos completos (README, BUILD_FIXES, DEPLOYMENT, PROJECT_DESCRIPTION)

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
│   ├── login/                  # Alias para login (compatibilidad)
│   │   └── page.tsx
│   ├── portal/                 # Área protegida
│   │   ├── layout.tsx         # Layout privado con sidebar
│   │   ├── page.tsx           # Dashboard con analytics y KPIs
│   │   ├── components/        # Componentes del portal
│   │   │   └── charts/        # Gráficos del dashboard
│   │   │       ├── AmountVsIvaChart.tsx    # Gráfico de Monto vs IVA
│   │   │       ├── BudgetStatusChart.tsx   # Gráfico por estados
│   │   │       └── TimelineChart.tsx       # Gráfico temporal
│   │   ├── hooks/             # Custom hooks del portal
│   │   │   └── useBudgetAnalytics.ts  # Hook para analytics
│   │   └── presupuesto/       # Módulo presupuesto
│   │       ├── layout.tsx     # Layout con tabs de navegación
│   │       ├── page.tsx       # Redirect a consultar
│   │       ├── api/
│   │       │   └── budgetService.ts  # Servicio API con React Query
│   │       ├── components/    # Componentes del módulo
│   │       │   ├── AdvancedFilters.tsx
│   │       │   ├── BudgetTableEnhanced.tsx
│   │       │   ├── CreateBudgetModal.tsx
│   │       │   ├── Indicators.tsx
│   │       │   └── LoadingSkeleton.tsx
│   │       ├── consultar/     # Sub-módulo consultar
│   │       │   ├── page.tsx
│   │       │   └── loading.tsx
│   │       ├── crear/         # Sub-módulo crear
│   │       │   ├── page.tsx   # Página principal de creación
│   │       │   ├── components/      # Componentes del wizard
│   │       │   │   ├── ADD_SUCURSAL_README.md
│   │       │   │   ├── AddSucursalModal.tsx
│   │       │   │   ├── ClienteForm.tsx
│   │       │   │   ├── PresupuestoTable.tsx
│   │       │   │   ├── ProgressBar.tsx
│   │       │   │   ├── ProyectoForm.tsx
│   │       │   │   ├── ResumenFinal.tsx
│   │       │   │   ├── ValidationAlert.tsx
│   │       │   │   └── WizardNavigation.tsx
│   │       │   └── data/              # Datos mock
│   │       │       ├── clientesMock.ts
│   │       │       └── regionesChile.ts
│   │       ├── editar/        # Sub-módulo editar
│   │       │   ├── README.md          # Documentación del módulo
│   │       │   ├── [budgetId]/        # Ruta dinámica
│   │       │   │   └── page.tsx       # Página de edición
│   │       │   └── components/        # Componentes de edición
│   │       │       ├── EditBudgetHeader.tsx       # Header con acciones
│   │       │       ├── BudgetHistoryTimeline.tsx  # Timeline de historial
│   │       │       ├── BudgetNotes.tsx            # Notas internas
│   │       │       ├── DuplicateBudgetModal.tsx   # Modal duplicar
│   │       │       ├── NotifyEmailModal.tsx       # Modal email
│   │       │       └── ShareWhatsAppModal.tsx     # Modal WhatsApp
│   │       ├── historia/      # Sub-módulo historia
│   │       │   └── page.tsx
│   │       └── hooks/         # Custom hooks del presupuesto
│   │           └── useCotizaciones.ts
│   ├── layout.tsx             # Layout global
│   └── globals.css            # Estilos globales
│
├── components/                 # Componentes React
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx        # Header público
│   │   ├── Footer.tsx        # Footer
│   │   └── NavPublic.tsx     # Navegación pública
│   └── ui/                   # Componentes shadcn/ui (20+ componentes)
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── LoadingOverlay.tsx
│       ├── ParticleBackground.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
│
├── hooks/                     # Custom React Hooks
│   └── useAuth.ts            # Hook de autenticación
│
├── lib/                       # Librerías y utilidades
│   ├── utils.ts              # Utilidades (cn, formatRut, formatCurrency)
│   ├── env.ts                # Validación de variables de entorno
│   └── pino-client.ts        # Cliente de logging estructurado
│
├── data/                      # Capa de datos
│   └── supabase/
│       ├── client.ts         # Cliente Supabase
│       └── auth.ts           # Servicio de autenticación mock
│
├── providers/                 # React Context Providers
│   └── QueryProvider.tsx     # React Query Provider con DevTools
│
├── types/                     # Definiciones TypeScript
│   ├── index.d.ts            # Tipos globales
│   └── presupuesto.ts        # Tipos del módulo presupuesto
│
├── public/                    # Archivos estáticos
│   └── images/
│       └── company/
│
├── BUILD_FIXES.md            # Soluciones a problemas de build
├── DEPLOYMENT.md             # Guía de despliegue
├── PRESUPUESTO_MODULE_README.md  # Doc del módulo presupuesto
├── project-description.md    # Descripción técnica del proyecto
├── components.json           # Configuración shadcn/ui
├── next.config.ts           # Configuración Next.js
├── tailwind.config.ts       # Configuración Tailwind
├── tsconfig.json            # Configuración TypeScript
└── package.json             # Dependencias del proyecto
```

### Estructura Detallada del Dashboard

El dashboard principal en `/portal` incluye:

**Componentes principales:**
- `page.tsx` - Vista principal con KPIs y gráficos
- `useBudgetAnalytics.ts` - Hook personalizado para analytics

**Gráficos (Recharts):**
- `AmountVsIvaChart.tsx` - Comparación Monto Neto vs IVA
- `BudgetStatusChart.tsx` - Distribución por estados
- `TimelineChart.tsx` - Evolución temporal

**Características:**
- 📊 3 gráficos interactivos con Recharts 3.5.1
- 📈 4 indicadores KPI en tiempo real
- 🎨 Diseño responsivo con Tailwind
- ⚡ Datos calculados con React Query

---
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

## 📊 Módulo Presupuesto

### Descripción General

Módulo completo de gestión de presupuestos con **React Query** para manejo de estado del servidor, actualizaciones optimistas y gestión de caché inteligente. Incluye 3 sub-módulos funcionales.

**Ubicación:** `app/portal/presupuesto/`

### Características del Módulo

#### 1. Consultar (`/portal/presupuesto/consultar`)
- ✅ **Indicadores KPI:** 4 cards con métricas en tiempo real (Activos, En Revisión, Finalizados, Cerrados)
- ✅ **Filtros Avanzados:** Búsqueda por cliente, filtro por estado, rango de fechas
- ✅ **Tabla Mejorada (BudgetTableEnhanced):** Paginación, ordenamiento, acciones CRUD
- ✅ **Actualizaciones Optimistas:** UI instantánea con React Query
- ✅ **Gestión de Caché:** Invalidación y refetch automático

#### 2. Crear (`/portal/presupuesto/crear`)
- ✅ **Wizard Completo de 3 Pasos:** Cliente → Proyecto → Resumen
- ✅ **Validación Avanzada:** React Hook Form + Zod en cada paso
- ✅ **Gestión de Sucursales:** Modal para agregar múltiples sucursales dinámicamente
- ✅ **Componentes del Wizard:**
  - `ClienteForm.tsx` - Formulario de datos del cliente
  - `ProyectoForm.tsx` - Formulario de datos del proyecto
  - `ResumenFinal.tsx` - Vista previa antes de crear
  - `WizardNavigation.tsx` - Navegación entre pasos
  - `ProgressBar.tsx` - Indicador visual de progreso
  - `AddSucursalModal.tsx` - Modal para agregar sucursales
  - `PresupuestoTable.tsx` - Tabla de ítems del presupuesto
  - `ValidationAlert.tsx` - Alertas de validación
- ✅ **Datos Mock:** `clientesMock.ts`, `regionesChile.ts`
- ✅ **Notificaciones:** Toast con Sonner para feedback

#### 3. Editar (`/portal/presupuesto/editar/[budgetId]`)
- ✅ **Navegación desde Tabla:** Click en fila o menú contextual "Editar"
- ✅ **Header Inteligente:** Folio, estado, fecha, acciones (copiar link, duplicar, cancelar, guardar)
- ✅ **Visualización por Tabs:** 3 pestañas (General, Cliente, Ítems)
- ✅ **Historial del Presupuesto:** Timeline con audit log completo
- ✅ **Notas Internas:** Sistema de comentarios para el equipo
- ✅ **Acciones Avanzadas:**
  - 📋 Duplicar presupuesto con modal de confirmación
  - 📧 Notificar por email con vista previa
  - 📱 Compartir por WhatsApp con mensaje personalizable
  - 🔗 Copiar link público al portapapeles
  - 💾 Guardado con detección de cambios
- ✅ **Componentes del Módulo:**
  - `EditBudgetHeader.tsx` - Header con información y acciones
  - `BudgetHistoryTimeline.tsx` - Timeline de audit log
  - `BudgetNotes.tsx` - Sistema de notas internas
  - `DuplicateBudgetModal.tsx` - Modal de duplicación
  - `NotifyEmailModal.tsx` - Modal para notificación email
  - `ShareWhatsAppModal.tsx` - Modal para compartir WhatsApp

#### 4. Historia (`/portal/presupuesto/historia`)
- ✅ **Historial Completo:** Timeline de todos los presupuestos
- ✅ **Filtros:** Por fecha, estado y cliente
- ✅ **Visualización:** Cards organizadas cronológicamente

### Componentes del Módulo

```
app/portal/presupuesto/
├── layout.tsx                  # Layout con navegación de tabs
├── page.tsx                    # Redirect a /consultar
├── api/
│   └── budgetService.ts       # API service con React Query
├── components/
│   ├── AdvancedFilters.tsx    # Filtros avanzados reutilizables
│   ├── Indicators.tsx          # 4 KPI cards
│   ├── BudgetTableEnhanced.tsx # Tabla con paginación y ordenamiento
│   ├── CreateBudgetModal.tsx   # Modal de creación
│   └── LoadingSkeleton.tsx     # Estados de carga
├── consultar/
│   ├── page.tsx               # Página de consulta
│   └── loading.tsx            # Loading state
├── crear/
│   ├── page.tsx               # Página principal de creación (wizard)
│   ├── components/            # Componentes del wizard
│   │   ├── ClienteForm.tsx           # Formulario paso 1: Cliente
│   │   ├── ProyectoForm.tsx          # Formulario paso 2: Proyecto
│   │   ├── ResumenFinal.tsx          # Vista paso 3: Resumen
│   │   ├── WizardNavigation.tsx      # Navegación entre pasos
│   │   ├── ProgressBar.tsx           # Barra de progreso visual
│   │   ├── AddSucursalModal.tsx      # Modal agregar sucursales
│   │   ├── PresupuestoTable.tsx      # Tabla de ítems
│   │   ├── ValidationAlert.tsx       # Alertas de validación
│   │   └── ADD_SUCURSAL_README.md    # Doc del modal sucursales
│   └── data/                  # Datos mock
│       ├── clientesMock.ts           # Base de clientes de prueba
│       └── regionesChile.ts          # Regiones y comunas de Chile
├── editar/
│   ├── README.md              # Documentación completa del módulo
│   ├── [budgetId]/
│   │   └── page.tsx           # Página dinámica de edición
│   └── components/            # Componentes de edición
│       ├── EditBudgetHeader.tsx       # Header con info y acciones
│       ├── BudgetHistoryTimeline.tsx  # Timeline de audit log
│       ├── BudgetNotes.tsx            # Sistema de notas internas
│       ├── DuplicateBudgetModal.tsx   # Modal de duplicación
│       ├── NotifyEmailModal.tsx       # Modal notificación email
│       └── ShareWhatsAppModal.tsx     # Modal compartir WhatsApp
├── historia/
│   └── page.tsx               # Página de historial
└── hooks/
    └── useCotizaciones.ts     # Hook para gestión de cotizaciones
```

### Stack Tecnológico del Módulo

| Tecnología | Uso |
|------------|-----|
| **React Query 5.x** | Server state management, cache, optimistic updates |
| **Sonner** | Sistema de notificaciones toast |
| **React Hook Form + Zod** | Validación de formularios |
| **shadcn/ui** | Dialog, Input, Select, Button, Badge |
| **Lucide React** | Iconografía |
| **Mock API** | Simulación de backend con delays |

### Configuración de React Query

El módulo utiliza el `QueryProvider` configurado en `providers/QueryProvider.tsx`:

```typescript
// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 60 segundos
      retry: 1,                     // 1 reintento
      refetchOnWindowFocus: false,  // No refetch en focus
    },
  },
});
```

**DevTools:** Habilitados en desarrollo para debugging de queries.

### Ejemplo de Uso de React Query

```typescript
// Fetch de presupuestos
const { data: budgets, isLoading, error } = useQuery({
  queryKey: ['budgets'],
  queryFn: budgetService.getAll,
});

// Mutación para crear presupuesto
const createMutation = useMutation({
  mutationFn: budgetService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
    toast.success('Presupuesto creado exitosamente');
  },
});
```

### Mock API Service

El servicio simula un backend real con delays y respuestas realistas:

```typescript
// budgetService.ts incluye:
- getAll(): Promise<Budget[]>          // Obtener todos
- getById(id): Promise<Budget>         // Obtener por ID
- create(data): Promise<Budget>        // Crear nuevo
- update(id, data): Promise<Budget>    // Actualizar
- delete(id): Promise<void>            // Eliminar
```

**Delay simulado:** 800ms para simular latencia de red real.

### Estados del Presupuesto

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Activo** | Verde | Presupuesto en proceso |
| **En Revisión** | Amarillo | Pendiente de aprobación |
| **Finalizado** | Azul | Completado exitosamente |
| **Cerrado** | Gris | Archivado o cancelado |

### Formateo de Datos

```typescript
// Moneda CLP
formatCurrency(1500000) // → "$1.500.000"

// Fechas
new Date().toLocaleDateString('es-CL') // → "13/12/2024"
```

### Próximas Mejoras

- 🚧 Exportación a PDF/Excel de reportes
- 🚧 Gráficos estadísticos avanzados
- 🚧 Notificaciones en tiempo real
- 🚧 Integración con API REST real
- 🚧 Sistema de permisos por rol
- 🚧 Búsqueda full-text avanzada

> **📚 Documentación detallada:** Ver [PRESUPUESTO_MODULE_README.md](./PRESUPUESTO_MODULE_README.md) y [CONSULTAR_MODULE_README.md](./app/portal/presupuesto/CONSULTAR_MODULE_README.md) para información técnica completa.

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
| `/portal` | Dashboard principal con analytics | `app/portal/page.tsx` |
| `/portal/presupuesto` | Módulo de presupuesto (redirect a consultar) | `app/portal/presupuesto/page.tsx` |
| `/portal/presupuesto/consultar` | Consulta y gestión de presupuestos | `app/portal/presupuesto/consultar/page.tsx` |
| `/portal/presupuesto/crear` | Crear nuevo presupuesto | `app/portal/presupuesto/crear/page.tsx` |
| `/portal/presupuesto/editar/[id]` | Editar presupuesto existente | `app/portal/presupuesto/editar/[budgetId]/page.tsx` |
| `/portal/presupuesto/historia` | Historial de presupuestos | `app/portal/presupuesto/historia/page.tsx` |
| `/portal/ajustes-aflow` | Módulo de ajustes (redirect a dashboard) | `app/portal/ajustes-aflow/page.tsx` |
| `/portal/ajustes-aflow/dashboard` | Dashboard de configuración | `app/portal/ajustes-aflow/dashboard/page.tsx` |
| `/portal/ajustes-aflow/clientes` | Gestión de clientes | `app/portal/ajustes-aflow/clientes/page.tsx` |
| `/portal/ajustes-aflow/perfiles` | Gestión de perfiles y permisos | `app/portal/ajustes-aflow/perfiles/page.tsx` |
| `/portal/ajustes-aflow/opciones-menu` | Configuración de menú | `app/portal/ajustes-aflow/opciones-menu/page.tsx` |
| `/portal/ajustes-aflow/servicios` | Catálogo de servicios | `app/portal/ajustes-aflow/servicios/page.tsx` |

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

- ✅ **Accordion** - Acordeones desplegables
- ✅ **Alert Dialog** - Diálogos de confirmación
- ✅ **Badge** - Etiquetas de estado
- ✅ **Button** - Botones con variantes
- ✅ **Card** - Tarjetas de contenido
- ✅ **Checkbox** - Casillas de verificación
- ✅ **Dialog** - Modales
- ✅ **Dropdown Menu** - Menús desplegables
- ✅ **Form** - Formularios con validación
- ✅ **Input** - Campos de entrada
- ✅ **Label** - Etiquetas de formulario
- ✅ **Scroll Area** - Áreas con scroll personalizado
- ✅ **Select** - Selectores
- ✅ **Separator** - Divisores visuales
- ✅ **Sheet** - Paneles laterales
- ✅ **Skeleton** - Estados de carga
- ✅ **Switch** - Interruptores
- ✅ **Table** - Tablas de datos
- ✅ **Tabs** - Pestañas
- ✅ **Textarea** - Áreas de texto
- ✅ **Toast** - Notificaciones
- ✅ **Tooltip** - Tooltips informativos

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

#### LoadingOverlay

Overlay de carga con spinner:

```tsx
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

<LoadingOverlay isLoading={isLoading} message="Cargando datos..." />
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

### Paleta de Colores del Login

El módulo de login utiliza una paleta de colores específica para crear una experiencia visual moderna y consistente:

```css
/* Fondos y degradados */
--bg-primary: #0b0b0c        /* Fondo principal oscuro */
--bg-secondary: #141518      /* Fondo secundario */
--bg-tertiary: #0d0e10       /* Fondo terciario */
--card-bg: rgba(card, 0.95)  /* Fondo de tarjeta con transparencia */

/* Colores de acento */
--aflow-blue: #3B82F6        /* Azul corporativo AFLOW */
--aflow-blue-light: #60A5FA  /* Azul claro (hover) */
--orange-accent: #F97316     /* Naranja para hovers y detalles */

/* Textos */
--text-primary: #FFFFFF      /* Texto principal */
--text-secondary: #D1D5DB    /* Texto secundario (gray-300) */
--text-muted: #9CA3AF        /* Texto atenuado (gray-400) */
--text-input: #000000        /* Texto en inputs */

/* Bordes y separadores */
--border-color: rgba(border, 0.6)  /* Bordes sutiles */
--border-input: #D1D5DB      /* Bordes de inputs (gray-300) */

/* Estados y efectos */
--input-bg: rgba(255, 255, 255, 0.95)  /* Fondo de inputs */
--input-placeholder: #6B7280  /* Placeholder (gray-500) */
--shadow-dark: rgba(0, 0, 0, 0.4)      /* Sombras principales */
--shadow-lg: rgba(0, 0, 0, 0.3)        /* Sombras de botones */
```

**Características del diseño:**
- ✅ Fondo oscuro con degradados sutiles
- ✅ Efectos de partículas animadas
- ✅ Tarjetas con backdrop blur
- ✅ Carousel informativo (desktop/tablet)
- ✅ Diseño responsivo mobile-first
- ✅ Hover states con naranja (#F97316)
- ✅ Focus ring azul corporativo

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
|------------|---------|-----------||
| **Next.js** | 15.0.3 | Framework React con SSR/SSG |
| **React** | 18.3.1 | Biblioteca UI |
| **TypeScript** | 5.3.3 | Type Safety |

### State Management

| Tecnología | Versión | Propósito |
|------------|---------|-----------||
| **@tanstack/react-query** | 5.90.12 | Server state management y caché |
| **@tanstack/react-query-devtools** | 5.91.1 | DevTools para debugging |

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
| **Recharts** | 3.5.1 | Gráficos y visualizaciones |
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

## 📚 Documentación Adicional

Este README es la guía principal del proyecto. Para información específica, consulta:

| Documento | Descripción | Link |
|-----------|-------------|------|
| **Project Description** | Documentación técnica detallada del proyecto | [project-description.md](./project-description.md) |
| **Presupuesto Module** | Documentación específica del módulo presupuesto | [PRESUPUESTO_MODULE_README.md](./PRESUPUESTO_MODULE_README.md) |
| **Consultar Module** | Guía del sub-módulo de consulta | [CONSULTAR_MODULE_README.md](./app/portal/presupuesto/CONSULTAR_MODULE_README.md) |
| **Editar Module** | Guía del sub-módulo de edición | [editar/README.md](./app/portal/presupuesto/editar/README.md) |
| **Deployment Guide** | Guía rápida de despliegue | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Build Fixes** | Problemas conocidos y sus soluciones | [BUILD_FIXES.md](./BUILD_FIXES.md) |

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Necesito configurar Supabase para usar el proyecto?

**No.** El proyecto funciona completamente con autenticación mock. Las variables de Supabase son opcionales y solo se necesitan si deseas migrar a autenticación real.

### ¿Cómo agrego un nuevo módulo como Presupuesto?

1. **Crea la estructura de carpetas:**
   ```
   app/portal/tu-modulo/
   ├── page.tsx
   ├── api/
   │   └── service.ts
   └── components/
   ```

2. **Configura React Query** (si necesitas estado del servidor)

3. **Crea los componentes** siguiendo el patrón de Presupuesto

4. **Añade la ruta** en el sidebar de `app/portal/layout.tsx`

5. **Documenta** en un README específico del módulo

### ¿Cómo migro la autenticación mock a Supabase real?

1. **Crea un proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com) y crea un proyecto
   - Copia las credenciales (URL y anon key)

2. **Configura variables de entorno:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
   ```

3. **Actualiza `data/supabase/auth.ts`:**
   - Reemplaza las funciones mock con llamadas a Supabase Auth
   - Ejemplo: `supabase.auth.signInWithPassword()`

4. **Configura políticas RLS** en Supabase para seguridad

5. **Prueba** el flujo completo de autenticación

> Ver documentación detallada en `project-description.md` sección "Migración a Autenticación Real".

### ¿Qué es React Query y por qué se usa?

**React Query** (@tanstack/react-query) es una biblioteca para gestionar el estado del servidor en React. Se usa porque:

- ✅ **Caché automático:** Evita requests redundantes
- ✅ **Actualizaciones optimistas:** UI instantánea
- ✅ **Sincronización:** Mantiene datos actualizados
- ✅ **DevTools:** Debugging fácil del estado
- ✅ **Estados integrados:** Loading, error, success

En el módulo Presupuesto, React Query gestiona el fetch, caché e invalidación de datos automáticamente.

### ¿Cómo pruebo el proyecto completo?

1. **Inicia el servidor:** 
   ```powershell
   npm run dev
   ```

2. **Login:** 
   - Ve a http://localhost:3000/login
   - Usa `test@aflow.cl` / `123456`

3. **Dashboard Principal (`/portal`):**
   - 🎯 4 indicadores KPI en tiempo real
   - 📊 3 gráficos interactivos: Monto vs IVA, Estados, Timeline
   - 💡 Datos generados con `useBudgetAnalytics` hook

4. **Módulo Presupuesto:**
   - **Consultar** (`/portal/presupuesto/consultar`):
     - Ver todos los presupuestos en tabla mejorada
     - Filtrar por cliente, estado o rango de fechas
     - Ver 4 indicadores resumen (Activos, En Revisión, Finalizados, Cerrados)
     - Editar/Eliminar con actualizaciones optimistas
     - Paginación y ordenamiento
   
   - **Crear** (`/portal/presupuesto/crear`):
     - Wizard de 3 pasos (Cliente → Proyecto → Resumen)
     - Validación con React Hook Form + Zod
     - Formularios interactivos
     - Agregar sucursales dinámicamente
   
   - **Editar** (`/portal/presupuesto/editar/[budgetId]`):
     - Navegación desde tabla (click en fila o menú "Editar")
     - Visualización completa por tabs (General, Cliente, Ítems)
     - Timeline de historial con audit log profesional
     - Sistema de notas internas para el equipo
     - Acciones: duplicar, notificar email, compartir WhatsApp
     - Header inteligente con detección de cambios
     - Componentes especializados para cada funcionalidad
   
   - **Historia** (`/portal/presupuesto/historia`):
     - Ver historial completo en timeline
     - Filtrar por fecha, estado y cliente
     - Cards organizadas cronológicamente

5. **Prueba funcionalidades avanzadas:**
   - ✅ Actualizaciones optimistas con React Query
   - ✅ Notificaciones toast con Sonner
   - ✅ Estados de carga con skeletons
   - ✅ Responsive design en mobile/tablet/desktop
   - ✅ DevTools de React Query (abrir en desarrollo)

### ¿El proyecto está listo para producción?

**Sí**, con consideraciones:

- ✅ **Code quality:** Sin errores de TypeScript/ESLint
- ✅ **Build:** Compila exitosamente para producción
- ✅ **Deployment:** Vercel-ready
- ⚠️ **Authentication:** Necesitas migrar a Supabase u otro sistema real
- ⚠️ **API:** Los servicios son mock, requieren integración backend
- ⚠️ **Testing:** No hay tests automatizados aún

### ¿Qué puedo hacer si encuentro un error?

1. **Revisa esta sección:** [Solución de Problemas](#-solución-de-problemas)
2. **Consulta BUILD_FIXES.md:** Para errores conocidos
3. **Verifica la consola:** Busca mensajes de error específicos
4. **Limpia dependencias:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```
5. **Abre un issue:** En GitHub si el problema persiste

### ¿Cómo contribuyo al proyecto?

Ver la sección [Contribuciones](#-contribuciones) para el proceso completo. En resumen:

1. Fork el repositorio
2. Crea una rama feature
3. Haz tus cambios con commits convencionales
4. Abre un Pull Request
5. Espera review y feedback

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

**Última actualización:** Diciembre 15, 2025  
**Versión:** 1.3.0  
**Estado:** ✅ Producción Ready  
**Features:**  
- ✅ Dashboard Principal con Analytics (AmountVsIvaChart, BudgetStatusChart, TimelineChart)
- ✅ Módulo Presupuesto Completo (Consultar + Crear + Editar + Historia)
- ✅ Edición Avanzada con Historial, Notas y Compartir
- ✅ React Query v5 con optimistic updates
- ✅ 20+ componentes shadcn/ui  
- ✅ Sistema de autenticación mock completo
