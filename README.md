# AFLOW Portal - Sistema Corporativo

![AFLOW Portal](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=for-the-badge&logo=tailwind-css)

Portal Corporativo AFLOW - Sistema Modular Empresarial construido con Next.js 15, TypeScript, TailwindCSS y shadcn/ui.

## 🚀 Características

- ✅ **Next.js 15** con App Router
- ✅ **TypeScript** estricto
- ✅ **TailwindCSS** con paleta corporativa AFLOW
- ✅ **shadcn/ui** para componentes UI modernos
- ✅ **Autenticación Mock** con sistema de sesiones
- ✅ **Diseño Responsivo** mobile-first
- ✅ **Arquitectura Limpia** y escalable
- ✅ **Listo para Vercel** deployment automático

## 📋 Requisitos Previos

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0

## 🛠️ Instalación

1. **Clonar el repositorio:**

```bash
git clone https://github.com/jmardones96/front-sistem-portal-aflow-nextjs.git
cd front-sistem-portal-aflow-nextjs
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

```bash
cp .env.example .env.local
```

El proyecto usa autenticación mock, por lo que las variables de Supabase son opcionales para desarrollo.

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilación de Producción

```bash
npm run build
npm run start
```

### Verificación de Tipos

```bash
npm run type-check
```

### Formateo de Código

```bash
npm run format
```

## 🔐 Credenciales de Prueba

Para acceder al sistema, usa las siguientes credenciales:

- **Email:** test@aflow.cl
- **Password:** 123456

## 📁 Estructura del Proyecto

```
aflow-portal/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing Page
│   │   └── login/
│   │       └── page.tsx          # Login Page
│   ├── (private)/
│   │   ├── layout.tsx            # Layout privado con auth
│   │   └── page.tsx              # Página maestra privada
│   ├── layout.tsx                # Layout global
│   └── globals.css               # Estilos globales
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Header público
│   │   ├── Footer.tsx            # Footer
│   │   └── NavPublic.tsx         # Navegación pública
│   └── ui/                       # Componentes shadcn/ui
│
├── hooks/
│   └── useAuth.ts                # Hook de autenticación
│
├── lib/
│   ├── utils.ts                  # Utilidades (cn, formatRut, etc.)
│   ├── env.ts                    # Validación de variables de entorno
│   └── pino-client.ts            # Cliente de logging
│
├── data/
│   └── supabase/
│       ├── client.ts             # Cliente Supabase
│       └── auth.ts               # Autenticación mock
│
├── types/
│   └── index.d.ts                # Definiciones TypeScript
│
└── public/
    └── logo-aflow.svg            # Logo AFLOW
```

## 🎨 Paleta de Colores Corporativa

- **Naranja AFLOW (CTA):** `#FF7A00`
- **Negro:** `#000000`
- **Blanco:** `#FFFFFF`
- **Gris Oscuro:** `#1A1A1A`
- **Gris Medio:** `#4D4D4D`

## 🌐 Despliegue en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. Push del código a GitHub:

```bash
git add .
git commit -m "feat: AFLOW Portal base implementation"
git push origin main
```

2. Importa el repositorio en [Vercel](https://vercel.com):
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Selecciona el repositorio `front-sistem-portal-aflow-nextjs`
   - Click en "Deploy"

Vercel detectará automáticamente Next.js y configurará el build.

### Opción 2: Deploy CLI

```bash
npm i -g vercel
vercel
```

### Variables de Entorno en Vercel

Configura las siguientes variables en el dashboard de Vercel (opcional para mock):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

## 🔒 Sistema de Autenticación Mock

El proyecto incluye un sistema de autenticación mock para desarrollo:

- **Usuario predefinido:** test@aflow.cl / 123456
- **Sesión almacenada en localStorage**
- **Expiración de sesión:** 24 horas
- **Protección de rutas privadas**

Para implementar Supabase Auth real:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Actualiza las variables en `.env.local`
3. Reemplaza las funciones mock en `data/supabase/auth.ts`

## 🧩 Componentes shadcn/ui Instalados

- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Label
- ✅ Form (con react-hook-form + zod)
- ✅ Separator

Para agregar más componentes:

```bash
npx shadcn@latest add [component-name]
```

## 🔧 Tecnologías Utilizadas

### Core
- **Next.js 15.0.3** - Framework React
- **React 18.3.1** - UI Library
- **TypeScript 5.3.3** - Type Safety

### Styling
- **TailwindCSS 3.4.1** - Utility-first CSS
- **shadcn/ui** - Component Library
- **Lucide React** - Icons
- **class-variance-authority** - Component Variants

### Forms & Validation
- **React Hook Form 7.49.3** - Form Management
- **Zod 3.22.4** - Schema Validation
- **@hookform/resolvers** - Form Resolvers

### Backend Integration
- **@supabase/supabase-js** - Supabase Client
- **Pino** - Logging

### Developer Experience
- **ESLint** - Code Linting
- **Prettier** - Code Formatting

## 📚 Próximos Pasos (Extensión Futura)

Este es el **proyecto base**. Para extenderlo, considera:

1. **Dashboard Module** - Vista general con métricas
2. **Módulo Contratante** - CRUD completo
3. **API Routes** - Endpoints RESTful
4. **Middleware de Autenticación** - Auth edge
5. **Testing** - Jest + React Testing Library
6. **CI/CD Pipeline** - GitHub Actions
7. **Monitoring** - Sentry, Analytics
8. **Supabase Auth Real** - Replace mock

## 🐛 Solución de Problemas

### Error de Compilación TypeScript

```bash
npm run type-check
```

Verifica errores de tipos antes de compilar.

### Error de Módulos Faltantes

```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload No Funciona

```bash
# Reinicia el servidor de desarrollo
npm run dev
```

### Problemas con shadcn/ui

```bash
# Re-instala componentes
npx shadcn@latest add button input card
```

## 📄 Licencia

Este proyecto es propiedad de AFLOW. Todos los derechos reservados.

## 👥 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo AFLOW.

---

**Desarrollado con ❤️ por el equipo AFLOW**
