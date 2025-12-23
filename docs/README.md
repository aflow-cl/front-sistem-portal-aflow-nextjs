# Estructura de Documentación - Portal AFLOW

Esta carpeta contiene toda la documentación técnica del proyecto organizada por categorías.

## 📁 Estructura de Carpetas

```
docs/
├── README.md                         # Este archivo
├── BUILD_FIXES.md                    # Errores resueltos del build
├── DEPLOYMENT.md                     # Guía de despliegue
├── deprecations.md                   # Historial de deprecaciones
│
├── modules/                          # Documentación por módulo
│   ├── PRESUPUESTO_MODULE_README.md
│   ├── CONSULTAR_MODULE_README.md
│   ├── IMPLEMENTACION_EDITAR_PRESUPUESTO.md
│   ├── HISTORICO_CONTRATANTE_README.md
│   ├── MAESTRO_NEGOCIO_README.md
│   └── AJUSTES_AFLOW_README.md
│
├── guides/                           # Guías técnicas
│   └── API_MIGRATION_GUIDE.md       # Guía de migración Mock → API Real
│
└── planning/                         # Documentos de planificación
    └── BACKEND_API_POSTGRESQL.md    # Especificación del backend (futuro)
```

---

## 📚 Documentos Principales

### Módulos Implementados

| Documento | Descripción | Líneas | Última actualización |
|-----------|-------------|--------|---------------------|
| [PRESUPUESTO_MODULE_README.md](./modules/PRESUPUESTO_MODULE_README.md) | Módulo Presupuesto completo | ~342 | Diciembre 2025 |
| [CONSULTAR_MODULE_README.md](./modules/CONSULTAR_MODULE_README.md) | Sub-módulo Consultar | ~220 | Diciembre 2025 |
| [IMPLEMENTACION_EDITAR_PRESUPUESTO.md](./modules/IMPLEMENTACION_EDITAR_PRESUPUESTO.md) | Sub-módulo Editar | ~304 | Diciembre 2025 |
| [HISTORICO_CONTRATANTE_README.md](./modules/HISTORICO_CONTRATANTE_README.md) | Módulo Histórico Contratante | ~600 | Diciembre 22, 2025 |
| [MAESTRO_NEGOCIO_README.md](./modules/MAESTRO_NEGOCIO_README.md) | Módulo Maestro de Negocio | ~611 | Diciembre 21, 2025 |
| [AJUSTES_AFLOW_README.md](./modules/AJUSTES_AFLOW_README.md) | Módulo Ajustes AFLOW | ~800 | Diciembre 22, 2025 |

### Guías Técnicas

| Documento | Descripción | Líneas | Última actualización |
|-----------|-------------|--------|---------------------|
| [API_MIGRATION_GUIDE.md](./guides/API_MIGRATION_GUIDE.md) | Guía completa para migrar de Mock a API Real | ~700 | Diciembre 22, 2025 |

### Planificación

| Documento | Descripción | Estado | Última actualización |
|-----------|-------------|--------|---------------------|
| [BACKEND_API_POSTGRESQL.md](./planning/BACKEND_API_POSTGRESQL.md) | Especificación completa del backend con PostgreSQL | ⚠️ Planificación | 2025 |

### Otros Documentos

| Documento | Descripción |
|-----------|-------------|
| [BUILD_FIXES.md](./BUILD_FIXES.md) | Historial de errores resueltos en el build |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guía rápida de despliegue en Vercel |
| [deprecations.md](./deprecations.md) | Tracking de código deprecado y limpieza |

---

## 🎯 Cómo Usar Esta Documentación

### Para Desarrolladores Nuevos

1. **Inicio rápido:** Lee el [README.md](../README.md) principal
2. **Arquitectura:** Consulta [project-description.md](../project-description.md)
3. **Módulos específicos:** Ve a [modules/](./modules/) según lo que necesites

### Para Implementar Funcionalidades

1. **Estudia el módulo similar:** Revisa documentación en [modules/](./modules/)
2. **Sigue los patrones:** Usa los ejemplos de código documentados
3. **Consulta la guía de migración:** [API_MIGRATION_GUIDE.md](./guides/API_MIGRATION_GUIDE.md)

### Para Resolver Problemas

1. **Build errors:** [BUILD_FIXES.md](./BUILD_FIXES.md)
2. **Deployment issues:** [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Código deprecado:** [deprecations.md](./deprecations.md)

---

## 📊 Métricas de Documentación

- **Total de archivos:** 12 documentos markdown
- **Total de líneas:** ~10,000 líneas
- **Cobertura:** 100% de módulos implementados
- **Última actualización global:** Diciembre 22, 2025

---

## ✅ Estado de Documentación por Módulo

| Módulo | Documentado | Calidad | Notas |
|--------|-------------|---------|-------|
| **Autenticación** | ✅ | ⭐⭐⭐⭐ | Incluido en README principal |
| **Landing Page** | ✅ | ⭐⭐⭐⭐ | Incluido en README principal |
| **Dashboard** | ✅ | ⭐⭐⭐⭐ | Incluido en README principal |
| **Presupuesto** | ✅ | ⭐⭐⭐⭐⭐ | Documentación completa y detallada |
| **Histórico Contratante** | ✅ | ⭐⭐⭐⭐⭐ | Nuevo - Completo |
| **Maestro Negocio** | ✅ | ⭐⭐⭐⭐⭐ | Excelente documentación |
| **Ajustes AFLOW** | ✅ | ⭐⭐⭐⭐⭐ | Nuevo - Completo |

---

## 🔄 Actualizaciones Recientes

### Diciembre 22, 2025
- ✅ Creado [HISTORICO_CONTRATANTE_README.md](./modules/HISTORICO_CONTRATANTE_README.md)
- ✅ Creado [AJUSTES_AFLOW_README.md](./modules/AJUSTES_AFLOW_README.md)
- ✅ Creado [API_MIGRATION_GUIDE.md](./guides/API_MIGRATION_GUIDE.md)
- ✅ Reorganizada estructura de carpetas (modules, guides, planning)
- ✅ Actualizado [BUILD_FIXES.md](./BUILD_FIXES.md) con estado resuelto
- ✅ Actualizados enlaces cruzados en todos los documentos

### Diciembre 21, 2025
- ✅ Actualizado [MAESTRO_NEGOCIO_README.md](./modules/MAESTRO_NEGOCIO_README.md) v1.2

### Diciembre 15, 2025
- ✅ Creado [IMPLEMENTACION_EDITAR_PRESUPUESTO.md](./modules/IMPLEMENTACION_EDITAR_PRESUPUESTO.md)
- ✅ Actualizado [deprecations.md](./deprecations.md)

---

## 📝 Convenciones de Documentación

### Formato de Nombres
- `NOMBRE_MODULO_README.md` para módulos completos
- `NOMBRE_SUBMODULO_README.md` para sub-módulos
- `NOMBRE_GUIDE.md` para guías técnicas
- Usar UPPERCASE para archivos principales

### Estructura de Documentos
1. **Título y badges** (si aplica)
2. **Resumen ejecutivo**
3. **Tabla de contenidos** (para docs >200 líneas)
4. **Objetivos cumplidos**
5. **Arquitectura**
6. **Funcionalidades**
7. **Tipos TypeScript**
8. **Mock Data** (si aplica)
9. **Stack tecnológico**
10. **Patrones de diseño**
11. **Migración a API Real**
12. **Troubleshooting**
13. **Roadmap**
14. **Changelog**

### Emojis Estándar
- ✅ Completo/Exitoso
- 🚧 En desarrollo
- 📋 Planificado
- ⚠️ Advertencia/Atención
- 🔴 Alta prioridad
- 🟡 Media prioridad
- 🟢 Baja prioridad
- 📊 Datos/Estadísticas
- 🎯 Objetivos
- 🏗️ Arquitectura
- 🔧 Herramientas/Config
- 🧪 Testing
- 📝 Notas
- 🚀 Deploy/Lanzamiento

---

## 🙏 Contribuciones

Al agregar nueva documentación:

1. **Ubicación correcta:**
   - Módulos → `modules/`
   - Guías → `guides/`
   - Planificación → `planning/`

2. **Seguir estructura:** Usa docs existentes como template

3. **Actualizar este README:** Agregar referencia en tablas

4. **Cross-references:** Enlazar con documentos relacionados

5. **Fecha de actualización:** Incluir en changelog

---

**Mantenido por:** Equipo AFLOW Development  
**Última revisión:** Diciembre 22, 2025  
**Versión:** 2.0 (Reorganización completa)
