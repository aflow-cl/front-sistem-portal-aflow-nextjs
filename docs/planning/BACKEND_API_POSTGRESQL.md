# Guía Completa: Construcción de API Backend y Modelos PostgreSQL

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Modelos de Base de Datos PostgreSQL](#modelos-de-base-de-datos-postgresql)
3. [Relaciones entre Tablas](#relaciones-entre-tablas)
4. [Índices y Constraints](#índices-y-constraints)
5. [API Endpoints](#api-endpoints)
6. [Migraciones](#migraciones)
7. [Funciones y Triggers](#funciones-y-triggers)
8. [Buenas Prácticas](#buenas-prácticas)

---

## Arquitectura General

### Stack Tecnológico Recomendado

- **Base de Datos**: PostgreSQL 15+
- **ORM/Query Builder**: Supabase (PostgREST) o Prisma
- **API Framework**: Next.js API Routes o Express.js
- **Autenticación**: Supabase Auth
- **Validación**: Zod (ya implementado en frontend)

### Estructura de Esquemas

```
public/
├── presupuestos/
│   ├── budgets
│   ├── budget_items
│   ├── budget_history
│   └── budget_notes
├── maestro_negocio/
│   ├── contratantes
│   ├── proveedores
│   ├── productos
│   ├── servicios
│   ├── packs_servicios
│   └── direcciones
├── ajustes_aflow/
│   ├── clientes
│   ├── sucursales
│   ├── usuarios_cliente
│   ├── perfiles
│   ├── permisos
│   ├── servicios_contratados
│   └── opciones_menu
└── sistema/
    ├── usuarios
    ├── sesiones
    └── auditoria
```

---

## Modelos de Base de Datos PostgreSQL

### 1. Módulo: Presupuestos

#### Tabla: `budgets`

```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio VARCHAR(50) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES contratantes(id) ON DELETE RESTRICT,
    proyecto_id UUID, -- Referencia a proyectos (tabla futura)
    proyecto_nombre VARCHAR(255),
    
    -- Datos Generales
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(20) NOT NULL DEFAULT 'Borrador',
    moneda VARCHAR(3) NOT NULL DEFAULT 'CLP',
    tipo_cambio DECIMAL(10, 4) DEFAULT 1.0,
    
    -- Totales
    subtotal DECIMAL(15, 2) DEFAULT 0,
    iva_total DECIMAL(15, 2) DEFAULT 0,
    total_general DECIMAL(15, 2) DEFAULT 0,
    
    -- Condiciones Comerciales
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0,
    descuento_monto DECIMAL(15, 2) DEFAULT 0,
    condiciones_pago TEXT,
    observaciones_internas TEXT,
    
    -- Personalización
    formato_documento VARCHAR(20) DEFAULT 'Vertical',
    color_principal VARCHAR(7) DEFAULT '#3B82F6',
    logo_url TEXT,
    
    -- Control
    usuario_creador UUID REFERENCES usuarios(id),
    usuario_modificador UUID REFERENCES usuarios(id),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    documento_url TEXT,
    adjuntar_pdf BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT check_estado CHECK (estado IN (
        'Borrador', 'En revisión', 'En proceso', 'Pendiente',
        'Aprobado', 'Rechazado', 'Finalizado', 'Cerrado'
    )),
    CONSTRAINT check_moneda CHECK (moneda IN ('CLP', 'USD', 'EUR')),
    CONSTRAINT check_formato CHECK (formato_documento IN ('Vertical', 'Horizontal'))
);

-- Índice para búsquedas frecuentes
CREATE INDEX idx_budgets_folio ON budgets(folio);
CREATE INDEX idx_budgets_cliente ON budgets(cliente_id);
CREATE INDEX idx_budgets_estado ON budgets(estado);
CREATE INDEX idx_budgets_fecha_creacion ON budgets(fecha_creacion DESC);
CREATE INDEX idx_budgets_usuario_creador ON budgets(usuario_creador);
CREATE INDEX idx_budgets_deleted_at ON budgets(deleted_at) WHERE deleted_at IS NULL;
```

#### Tabla: `budget_items`

```sql
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    -- Información del Item
    producto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(10) NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(15, 2) NOT NULL,
    
    -- Cálculos
    iva_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 19.0,
    utilidad_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    
    -- Relaciones
    proveedor_id UUID REFERENCES proveedores(id),
    servicio_id UUID REFERENCES servicios(id),
    producto_id UUID REFERENCES productos(id),
    
    -- Orden
    orden INTEGER NOT NULL DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_unidad_medida CHECK (unidad_medida IN (
        'UN', 'M2', 'M3', 'ML', 'KG', 'HR', 'GL', 'DIA', 'MES', 'LT'
    )),
    CONSTRAINT check_cantidad_positive CHECK (cantidad > 0),
    CONSTRAINT check_precio_positive CHECK (precio_unitario >= 0)
);

CREATE INDEX idx_budget_items_budget ON budget_items(budget_id);
CREATE INDEX idx_budget_items_orden ON budget_items(budget_id, orden);
```

#### Tabla: `budget_history`

```sql
CREATE TABLE budget_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    folio VARCHAR(50) NOT NULL, -- Denormalizado para búsquedas
    
    -- Acción
    tipo VARCHAR(30) NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Usuario
    usuario_id UUID REFERENCES usuarios(id),
    usuario_nombre VARCHAR(255), -- Denormalizado
    
    -- Detalles (JSONB para flexibilidad)
    detalles JSONB DEFAULT '{}',
    
    -- Timestamp
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_tipo CHECK (tipo IN (
        'creado', 'modificado', 'cambio_estado', 'enviado',
        'aprobado', 'rechazado', 'comentario', 'eliminado'
    ))
);

CREATE INDEX idx_budget_history_budget ON budget_history(budget_id);
CREATE INDEX idx_budget_history_folio ON budget_history(folio);
CREATE INDEX idx_budget_history_fecha ON budget_history(fecha DESC);
CREATE INDEX idx_budget_history_tipo ON budget_history(tipo);
```

#### Tabla: `budget_notes`

```sql
CREATE TABLE budget_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    -- Contenido
    content TEXT NOT NULL,
    
    -- Autor
    author_id UUID REFERENCES usuarios(id),
    author_nombre VARCHAR(255), -- Denormalizado
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_budget_notes_budget ON budget_notes(budget_id);
CREATE INDEX idx_budget_notes_created ON budget_notes(created_at DESC);
CREATE INDEX idx_budget_notes_deleted ON budget_notes(deleted_at) WHERE deleted_at IS NULL;
```

---

### 2. Módulo: Maestro de Negocio

#### Tabla: `contratantes`

```sql
CREATE TABLE contratantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de Persona
    tipo_persona VARCHAR(20) NOT NULL,
    
    -- Identificación
    rut VARCHAR(20) UNIQUE NOT NULL,
    
    -- Campos Persona Natural
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    
    -- Campos Empresa
    razon_social VARCHAR(255),
    giro VARCHAR(255),
    
    -- Contacto
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    
    -- Notas
    notas TEXT,
    
    -- Metadata
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT check_tipo_persona CHECK (tipo_persona IN ('persona-natural', 'empresa')),
    CONSTRAINT check_estado_contratante CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT check_persona_natural CHECK (
        (tipo_persona = 'persona-natural' AND nombres IS NOT NULL AND apellidos IS NOT NULL) OR
        (tipo_persona = 'empresa' AND razon_social IS NOT NULL AND giro IS NOT NULL)
    )
);

CREATE INDEX idx_contratantes_rut ON contratantes(rut);
CREATE INDEX idx_contratantes_tipo ON contratantes(tipo_persona);
CREATE INDEX idx_contratantes_estado ON contratantes(estado);
CREATE INDEX idx_contratantes_email ON contratantes(email);
CREATE INDEX idx_contratantes_deleted ON contratantes(deleted_at) WHERE deleted_at IS NULL;
```

#### Tabla: `direcciones`

```sql
CREATE TABLE direcciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación Polimórfica
    entidad_tipo VARCHAR(20) NOT NULL, -- 'contratante' | 'proveedor'
    entidad_id UUID NOT NULL,
    
    -- Información de Dirección
    nombre VARCHAR(255) NOT NULL,
    region_id VARCHAR(10) NOT NULL,
    region_nombre VARCHAR(255),
    ciudad_id VARCHAR(10) NOT NULL,
    ciudad_nombre VARCHAR(255),
    comuna VARCHAR(255) NOT NULL,
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(50) NOT NULL,
    complemento VARCHAR(255),
    
    -- Flags
    es_principal BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    
    -- Contacto en Dirección
    contacto_nombre VARCHAR(255),
    contacto_telefono VARCHAR(50),
    contacto_email VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_entidad_tipo CHECK (entidad_tipo IN ('contratante', 'proveedor'))
);

CREATE INDEX idx_direcciones_entidad ON direcciones(entidad_tipo, entidad_id);
CREATE INDEX idx_direcciones_principal ON direcciones(entidad_tipo, entidad_id, es_principal) WHERE es_principal = true;
```

#### Tabla: `proveedores`

```sql
CREATE TABLE proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de Persona
    tipo_persona VARCHAR(20) NOT NULL,
    
    -- Identificación
    rut VARCHAR(20) UNIQUE NOT NULL,
    
    -- Campos Persona Natural
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    
    -- Campos Empresa
    razon_social VARCHAR(255),
    giro VARCHAR(255),
    
    -- Contacto
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    
    -- Estado y Flags
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    es_proveedor_default BOOLEAN DEFAULT false,
    
    -- Notas
    notas TEXT,
    
    -- Metadata
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT check_tipo_persona_prov CHECK (tipo_persona IN ('persona-natural', 'empresa')),
    CONSTRAINT check_estado_proveedor CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT check_persona_natural_prov CHECK (
        (tipo_persona = 'persona-natural' AND nombres IS NOT NULL AND apellidos IS NOT NULL) OR
        (tipo_persona = 'empresa' AND razon_social IS NOT NULL AND giro IS NOT NULL)
    )
);

CREATE INDEX idx_proveedores_rut ON proveedores(rut);
CREATE INDEX idx_proveedores_default ON proveedores(es_proveedor_default) WHERE es_proveedor_default = true;
CREATE INDEX idx_proveedores_estado ON proveedores(estado);
```

#### Tabla: `productos`

```sql
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
    
    -- Información del Producto
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(100), -- SKU o código interno
    categoria VARCHAR(100),
    
    -- Valores
    valor_interno DECIMAL(15, 2) NOT NULL,
    unidad_medida VARCHAR(10) NOT NULL,
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    
    -- Metadata
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_unidad_medida_prod CHECK (unidad_medida IN (
        'UN', 'M2', 'M3', 'ML', 'KG', 'HR', 'GL', 'DIA'
    )),
    CONSTRAINT check_estado_producto CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT check_valor_positive CHECK (valor_interno >= 0)
);

CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX idx_productos_codigo ON productos(codigo) WHERE codigo IS NOT NULL;
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_estado ON productos(estado);
```

#### Tabla: `servicios`

```sql
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del Servicio
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(100),
    categoria VARCHAR(100),
    
    -- Valores
    valor_base DECIMAL(15, 2) NOT NULL,
    unidad_medida VARCHAR(10),
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    
    -- Metadata
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_unidad_medida_serv CHECK (unidad_medida IN (
        'UN', 'M2', 'M3', 'ML', 'KG', 'HR', 'GL', 'DIA'
    )),
    CONSTRAINT check_estado_servicio CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT check_valor_base_positive CHECK (valor_base >= 0)
);

CREATE INDEX idx_servicios_codigo ON servicios(codigo) WHERE codigo IS NOT NULL;
CREATE INDEX idx_servicios_categoria ON servicios(categoria);
CREATE INDEX idx_servicios_estado ON servicios(estado);
```

#### Tabla: `packs_servicios`

```sql
CREATE TABLE packs_servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del Pack
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Valor Total (calculado)
    valor_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    
    -- Estado
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    
    -- Metadata
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_estado_pack CHECK (estado IN ('Activo', 'Inactivo'))
);

CREATE INDEX idx_packs_estado ON packs_servicios(estado);
```

#### Tabla: `pack_items`

```sql
CREATE TABLE pack_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID NOT NULL REFERENCES packs_servicios(id) ON DELETE CASCADE,
    
    -- Tipo de Item
    tipo VARCHAR(20) NOT NULL, -- 'servicio' | 'producto'
    item_id UUID NOT NULL, -- ID del servicio o producto
    
    -- Cantidades y Valores
    cantidad DECIMAL(10, 2) NOT NULL,
    valor_unitario DECIMAL(15, 2) NOT NULL,
    valor_total DECIMAL(15, 2) NOT NULL,
    
    -- Orden
    orden INTEGER NOT NULL DEFAULT 0,
    
    CONSTRAINT check_tipo_item CHECK (tipo IN ('servicio', 'producto')),
    CONSTRAINT check_cantidad_positive_pack CHECK (cantidad > 0)
);

CREATE INDEX idx_pack_items_pack ON pack_items(pack_id);
CREATE INDEX idx_pack_items_orden ON pack_items(pack_id, orden);
```

---

### 3. Módulo: Ajustes AFLOW

#### Tabla: `clientes`

```sql
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación
    rut VARCHAR(20) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    giro VARCHAR(255) NOT NULL,
    
    -- Dirección Principal
    direccion VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    
    -- Contacto
    telefono VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    sitio_web VARCHAR(255),
    contacto_principal VARCHAR(255),
    email_contacto VARCHAR(255),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_clientes_rut ON clientes(rut);
CREATE INDEX idx_clientes_activo ON clientes(activo) WHERE activo = true;
CREATE INDEX idx_clientes_deleted ON clientes(deleted_at) WHERE deleted_at IS NULL;
```

#### Tabla: `sucursales`

```sql
CREATE TABLE sucursales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    
    -- Información
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    
    -- Estado
    activa BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sucursales_cliente ON sucursales(cliente_id);
CREATE INDEX idx_sucursales_activa ON sucursales(activa) WHERE activa = true;
```

#### Tabla: `usuarios_cliente`

```sql
CREATE TABLE usuarios_cliente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    perfil_id UUID REFERENCES perfiles(id),
    sucursal_id UUID REFERENCES sucursales(id),
    
    -- Información Personal
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usuarios_cliente_cliente ON usuarios_cliente(cliente_id);
CREATE INDEX idx_usuarios_cliente_perfil ON usuarios_cliente(perfil_id);
CREATE INDEX idx_usuarios_cliente_email ON usuarios_cliente(email);
```

#### Tabla: `perfiles`

```sql
CREATE TABLE perfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel VARCHAR(20) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_nivel CHECK (nivel IN (
        'Administrador', 'Supervisor', 'Operador', 'Consulta'
    ))
);

CREATE INDEX idx_perfiles_nivel ON perfiles(nivel);
CREATE INDEX idx_perfiles_activo ON perfiles(activo) WHERE activo = true;
```

#### Tabla: `permisos`

```sql
CREATE TABLE permisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    
    -- Permiso
    modulo VARCHAR(100) NOT NULL,
    submodulo VARCHAR(100),
    accion VARCHAR(20) NOT NULL,
    habilitado BOOLEAN DEFAULT true,
    
    CONSTRAINT check_accion CHECK (accion IN (
        'Crear', 'Leer', 'Editar', 'Eliminar', 'Exportar'
    ))
);

CREATE INDEX idx_permisos_perfil ON permisos(perfil_id);
CREATE INDEX idx_permisos_modulo ON permisos(modulo);
```

#### Tabla: `servicios_contratados`

```sql
CREATE TABLE servicios_contratados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL, -- Referencia a servicios del módulo ajustes
    
    -- Información del Contrato
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    tarifa_mensual DECIMAL(15, 2) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_estado_contratado CHECK (estado IN (
        'Activo', 'Pausado', 'Finalizado'
    ))
);

CREATE INDEX idx_servicios_contratados_cliente ON servicios_contratados(cliente_id);
CREATE INDEX idx_servicios_contratados_estado ON servicios_contratados(estado);
```

#### Tabla: `opciones_menu`

```sql
CREATE TABLE opciones_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información
    nombre VARCHAR(255) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    icono VARCHAR(100),
    orden INTEGER NOT NULL DEFAULT 0,
    descripcion TEXT,
    
    -- Jerarquía
    modulo_padre VARCHAR(100),
    es_submenu BOOLEAN DEFAULT false,
    
    -- Visibilidad
    visible BOOLEAN DEFAULT true,
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_opciones_menu_orden ON opciones_menu(orden);
CREATE INDEX idx_opciones_menu_activo ON opciones_menu(activo) WHERE activo = true;
```

#### Tabla: `perfil_menu` (Tabla de Relación)

```sql
CREATE TABLE perfil_menu (
    perfil_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
    opcion_menu_id UUID NOT NULL REFERENCES opciones_menu(id) ON DELETE CASCADE,
    
    PRIMARY KEY (perfil_id, opcion_menu_id)
);

CREATE INDEX idx_perfil_menu_perfil ON perfil_menu(perfil_id);
CREATE INDEX idx_perfil_menu_opcion ON perfil_menu(opcion_menu_id);
```

---

### 4. Módulo: Sistema

#### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Autenticación (Supabase Auth)
    auth_user_id UUID UNIQUE, -- ID de Supabase Auth
    
    -- Información Personal
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_auth_id ON usuarios(auth_user_id);
CREATE INDEX idx_usuarios_activo ON usuarios(activo) WHERE activo = true;
```

---

## Relaciones entre Tablas

### Diagrama de Relaciones Principales

```
budgets
  ├── cliente_id → contratantes(id)
  ├── usuario_creador → usuarios(id)
  └── usuario_modificador → usuarios(id)

budget_items
  ├── budget_id → budgets(id) [CASCADE]
  ├── proveedor_id → proveedores(id)
  ├── servicio_id → servicios(id)
  └── producto_id → productos(id)

budget_history
  └── budget_id → budgets(id) [CASCADE]

budget_notes
  └── budget_id → budgets(id) [CASCADE]

direcciones
  └── (entidad_tipo, entidad_id) → contratantes | proveedores

productos
  └── proveedor_id → proveedores(id)

pack_items
  ├── pack_id → packs_servicios(id) [CASCADE]
  └── item_id → servicios(id) | productos(id)

sucursales
  └── cliente_id → clientes(id) [CASCADE]

usuarios_cliente
  ├── cliente_id → clientes(id) [CASCADE]
  ├── perfil_id → perfiles(id)
  └── sucursal_id → sucursales(id)

permisos
  └── perfil_id → perfiles(id) [CASCADE]

servicios_contratados
  └── cliente_id → clientes(id) [CASCADE]
```

---

## Índices y Constraints

### Índices Compuestos para Búsquedas Frecuentes

```sql
-- Búsqueda de presupuestos por cliente y estado
CREATE INDEX idx_budgets_cliente_estado ON budgets(cliente_id, estado) 
WHERE deleted_at IS NULL;

-- Búsqueda de presupuestos por rango de fechas
CREATE INDEX idx_budgets_fecha_rango ON budgets(fecha_creacion) 
WHERE deleted_at IS NULL;

-- Búsqueda de contratantes por tipo y estado
CREATE INDEX idx_contratantes_tipo_estado ON contratantes(tipo_persona, estado) 
WHERE deleted_at IS NULL;

-- Búsqueda de productos por proveedor y estado
CREATE INDEX idx_productos_proveedor_estado ON productos(proveedor_id, estado);

-- Búsqueda de items de presupuesto ordenados
CREATE INDEX idx_budget_items_ordenado ON budget_items(budget_id, orden);
```

### Constraints Adicionales

```sql
-- Asegurar que solo hay una dirección principal por entidad
CREATE UNIQUE INDEX idx_direcciones_principal_unica 
ON direcciones(entidad_tipo, entidad_id) 
WHERE es_principal = true AND activa = true;

-- Asegurar folio único (case insensitive)
CREATE UNIQUE INDEX idx_budgets_folio_lower ON budgets(LOWER(folio));

-- Asegurar RUT único (case insensitive)
CREATE UNIQUE INDEX idx_contratantes_rut_lower ON contratantes(LOWER(rut));
CREATE UNIQUE INDEX idx_proveedores_rut_lower ON proveedores(LOWER(rut));
CREATE UNIQUE INDEX idx_clientes_rut_lower ON clientes(LOWER(rut));
```

---

## API Endpoints

### Estructura Base de Endpoints

```
/api/v1/
├── presupuestos/
│   ├── GET    /                    # Listar presupuestos
│   ├── GET    /:id                 # Obtener presupuesto por ID
│   ├── POST   /                    # Crear presupuesto
│   ├── PUT    /:id                 # Actualizar presupuesto
│   ├── DELETE /:id                 # Eliminar presupuesto (soft delete)
│   ├── POST   /:id/duplicate       # Duplicar presupuesto
│   ├── GET    /:id/history         # Obtener historial
│   ├── POST   /:id/history         # Agregar entrada al historial
│   ├── GET    /:id/notes           # Obtener notas
│   └── POST   /:id/notes           # Agregar nota
│
├── contratantes/
│   ├── GET    /                    # Listar contratantes
│   ├── GET    /:id                 # Obtener contratante
│   ├── POST   /                    # Crear contratante
│   ├── PUT    /:id                 # Actualizar contratante
│   ├── DELETE /:id                 # Eliminar contratante
│   ├── GET    /:id/direcciones     # Obtener direcciones
│   ├── POST   /:id/direcciones     # Agregar dirección
│   ├── PUT    /:id/direcciones/:dirId  # Actualizar dirección
│   └── DELETE /:id/direcciones/:dirId   # Eliminar dirección
│
├── proveedores/
│   ├── GET    /                    # Listar proveedores
│   ├── GET    /:id                 # Obtener proveedor
│   ├── POST   /                    # Crear proveedor
│   ├── PUT    /:id                 # Actualizar proveedor
│   ├── DELETE /:id                 # Eliminar proveedor
│   ├── GET    /:id/productos       # Obtener productos
│   └── POST   /:id/productos       # Agregar producto
│
├── servicios/
│   ├── GET    /                    # Listar servicios
│   ├── GET    /:id                 # Obtener servicio
│   ├── POST   /                    # Crear servicio
│   ├── PUT    /:id                 # Actualizar servicio
│   └── DELETE /:id                 # Eliminar servicio
│
├── packs/
│   ├── GET    /                    # Listar packs
│   ├── GET    /:id                 # Obtener pack
│   ├── POST   /                    # Crear pack
│   ├── PUT    /:id                 # Actualizar pack
│   └── DELETE /:id                 # Eliminar pack
│
└── clientes/ (Ajustes AFLOW)
    ├── GET    /                    # Listar clientes
    ├── GET    /:id                 # Obtener cliente
    ├── POST   /                    # Crear cliente
    ├── PUT    /:id                 # Actualizar cliente
    └── DELETE /:id                 # Eliminar cliente
```

### Ejemplo de Implementación: Endpoint de Presupuestos

#### GET /api/v1/presupuestos

```typescript
// app/api/v1/presupuestos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Filtros
    const clienteId = searchParams.get('cliente_id');
    const estado = searchParams.get('estado');
    const fechaInicio = searchParams.get('fecha_inicio');
    const fechaFin = searchParams.get('fecha_fin');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Construir query
    let query = supabase
      .from('budgets')
      .select(`
        *,
        cliente:contratantes(*),
        usuario_creador:usuarios(id, nombre, apellido),
        items:budget_items(*)
      `)
      .is('deleted_at', null)
      .order('fecha_creacion', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Aplicar filtros
    if (clienteId) {
      query = query.eq('cliente_id', clienteId);
    }
    
    if (estado) {
      query = query.eq('estado', estado);
    }
    
    if (fechaInicio) {
      query = query.gte('fecha_creacion', fechaInicio);
    }
    
    if (fechaFin) {
      query = query.lte('fecha_creacion', fechaFin);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

#### POST /api/v1/presupuestos

```typescript
// app/api/v1/presupuestos/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod (usar schema del frontend)
    // const validated = budgetSchema.parse(body);
    
    // Generar folio
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from('budgets')
      .select('*', { count: 'exact', head: true })
      .like('folio', `COT-${year}-%`);
    
    const nextNumber = (count || 0) + 1;
    const folio = `COT-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    // Crear presupuesto
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .insert({
        folio,
        cliente_id: body.cliente_id,
        proyecto_nombre: body.proyecto_nombre,
        estado: body.estado || 'Borrador',
        moneda: body.moneda || 'CLP',
        tipo_cambio: body.tipo_cambio || 1.0,
        usuario_creador: body.usuario_creador, // De auth token
        subtotal: body.subtotal || 0,
        iva_total: body.iva_total || 0,
        total_general: body.total_general || 0,
        condiciones_pago: body.condiciones_pago,
        observaciones_internas: body.observaciones_internas,
      })
      .select()
      .single();
    
    if (budgetError) throw budgetError;
    
    // Crear items si existen
    if (body.items && body.items.length > 0) {
      const items = body.items.map((item: any, index: number) => ({
        budget_id: budget.id,
        producto: item.producto,
        descripcion: item.descripcion,
        unidad_medida: item.unidad_medida,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        iva_porcentaje: item.iva || 19.0,
        utilidad_porcentaje: item.utilidad || 0,
        total: item.total,
        proveedor_id: item.proveedor_id,
        servicio_id: item.servicio_id,
        producto_id: item.producto_id,
        orden: index,
      }));
      
      const { error: itemsError } = await supabase
        .from('budget_items')
        .insert(items);
      
      if (itemsError) throw itemsError;
    }
    
    // Crear entrada en historial
    await supabase
      .from('budget_history')
      .insert({
        budget_id: budget.id,
        folio: budget.folio,
        tipo: 'creado',
        descripcion: 'Presupuesto creado',
        usuario_id: body.usuario_creador,
        detalles: {
          cliente: body.cliente_id,
          monto: body.total_general,
        },
      });
    
    // Obtener presupuesto completo
    const { data: fullBudget } = await supabase
      .from('budgets')
      .select(`
        *,
        cliente:contratantes(*),
        items:budget_items(*)
      `)
      .eq('id', budget.id)
      .single();
    
    return NextResponse.json({
      success: true,
      data: fullBudget,
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

#### PUT /api/v1/presupuestos/:id

```typescript
// app/api/v1/presupuestos/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const budgetId = params.id;
    
    // Verificar que el presupuesto existe
    const { data: existing } = await supabase
      .from('budgets')
      .select('id, estado')
      .eq('id', budgetId)
      .is('deleted_at', null)
      .single();
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Presupuesto no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar presupuesto
    const updateData: any = {
      fecha_modificacion: new Date().toISOString(),
      usuario_modificador: body.usuario_modificador,
    };
    
    // Campos actualizables
    if (body.estado !== undefined) updateData.estado = body.estado;
    if (body.proyecto_nombre !== undefined) updateData.proyecto_nombre = body.proyecto_nombre;
    if (body.moneda !== undefined) updateData.moneda = body.moneda;
    if (body.subtotal !== undefined) updateData.subtotal = body.subtotal;
    if (body.iva_total !== undefined) updateData.iva_total = body.iva_total;
    if (body.total_general !== undefined) updateData.total_general = body.total_general;
    
    const { data: updated, error: updateError } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', budgetId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Si hay cambio de estado, registrar en historial
    if (body.estado && body.estado !== existing.estado) {
      await supabase
        .from('budget_history')
        .insert({
          budget_id: budgetId,
          folio: updated.folio,
          tipo: 'cambio_estado',
          descripcion: `Estado cambiado de ${existing.estado} a ${body.estado}`,
          usuario_id: body.usuario_modificador,
          detalles: {
            estado_anterior: existing.estado,
            estado_nuevo: body.estado,
          },
        });
    }
    
    // Actualizar items si se proporcionan
    if (body.items) {
      // Eliminar items existentes
      await supabase
        .from('budget_items')
        .delete()
        .eq('budget_id', budgetId);
      
      // Insertar nuevos items
      if (body.items.length > 0) {
        const items = body.items.map((item: any, index: number) => ({
          budget_id: budgetId,
          ...item,
          orden: index,
        }));
        
        await supabase
          .from('budget_items')
          .insert(items);
      }
    }
    
    // Registrar modificación en historial
    await supabase
      .from('budget_history')
      .insert({
        budget_id: budgetId,
        folio: updated.folio,
        tipo: 'modificado',
        descripcion: 'Presupuesto modificado',
        usuario_id: body.usuario_modificador,
        detalles: body.detalles || {},
      });
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Migraciones

### Estructura de Migraciones

```sql
-- migrations/001_initial_schema.sql
-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto

-- Crear todas las tablas (usar scripts anteriores)
-- ...

-- migrations/002_add_indexes.sql
-- Agregar índices adicionales
-- ...

-- migrations/003_add_functions.sql
-- Agregar funciones y triggers
-- ...
```

### Función para Actualizar Timestamps

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratantes_updated_at
    BEFORE UPDATE ON contratantes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Repetir para todas las tablas necesarias...
```

### Función para Generar Folio Automático

```sql
-- Función para generar folio único
CREATE OR REPLACE FUNCTION generate_budget_folio()
RETURNS TRIGGER AS $$
DECLARE
    year_val INTEGER;
    next_num INTEGER;
    new_folio VARCHAR(50);
BEGIN
    year_val := EXTRACT(YEAR FROM NOW());
    
    -- Obtener el siguiente número
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(folio FROM 'COT-' || year_val || '-(.+)') AS INTEGER)
    ), 0) + 1
    INTO next_num
    FROM budgets
    WHERE folio LIKE 'COT-' || year_val || '-%';
    
    new_folio := 'COT-' || year_val || '-' || LPAD(next_num::TEXT, 3, '0');
    
    NEW.folio := new_folio;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_budget_folio
    BEFORE INSERT ON budgets
    FOR EACH ROW
    WHEN (NEW.folio IS NULL)
    EXECUTE FUNCTION generate_budget_folio();
```

### Función para Calcular Totales de Presupuesto

```sql
-- Función para recalcular totales de presupuesto
CREATE OR REPLACE FUNCTION recalculate_budget_totals(budget_uuid UUID)
RETURNS VOID AS $$
DECLARE
    subtotal_val DECIMAL(15, 2);
    iva_val DECIMAL(15, 2);
    total_val DECIMAL(15, 2);
    descuento_pct DECIMAL(5, 2);
    descuento_mnt DECIMAL(15, 2);
BEGIN
    -- Calcular subtotal (suma de items sin IVA)
    SELECT COALESCE(SUM(total / (1 + iva_porcentaje / 100)), 0)
    INTO subtotal_val
    FROM budget_items
    WHERE budget_id = budget_uuid;
    
    -- Calcular IVA total
    SELECT COALESCE(SUM(total - (total / (1 + iva_porcentaje / 100))), 0)
    INTO iva_val
    FROM budget_items
    WHERE budget_id = budget_uuid;
    
    -- Obtener descuentos
    SELECT descuento_porcentaje, descuento_monto
    INTO descuento_pct, descuento_mnt
    FROM budgets
    WHERE id = budget_uuid;
    
    -- Calcular total general
    total_val := subtotal_val + iva_val;
    
    -- Aplicar descuento porcentual
    IF descuento_pct > 0 THEN
        total_val := total_val * (1 - descuento_pct / 100);
    END IF;
    
    -- Aplicar descuento monto
    IF descuento_mnt > 0 THEN
        total_val := total_val - descuento_mnt;
    END IF;
    
    -- Actualizar presupuesto
    UPDATE budgets
    SET 
        subtotal = subtotal_val,
        iva_total = iva_val,
        total_general = total_val,
        updated_at = NOW()
    WHERE id = budget_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger para recalcular cuando se modifica un item
CREATE OR REPLACE FUNCTION trigger_recalculate_budget()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM recalculate_budget_totals(COALESCE(NEW.budget_id, OLD.budget_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_on_item_change
    AFTER INSERT OR UPDATE OR DELETE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_recalculate_budget();
```

---

## Funciones y Triggers

### Función para Validar RUT Chileno

```sql
-- Función para validar RUT chileno
CREATE OR REPLACE FUNCTION validate_rut(rut_input VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    rut_clean VARCHAR;
    rut_number INTEGER;
    rut_dv CHAR;
    calculated_dv CHAR;
    sum INTEGER := 0;
    multiplier INTEGER := 2;
    i INTEGER;
BEGIN
    -- Limpiar RUT
    rut_clean := UPPER(REGEXP_REPLACE(rut_input, '[^0-9K]', '', 'g'));
    
    IF LENGTH(rut_clean) < 2 THEN
        RETURN FALSE;
    END IF;
    
    rut_dv := RIGHT(rut_clean, 1);
    rut_number := CAST(LEFT(rut_clean, LENGTH(rut_clean) - 1) AS INTEGER);
    
    -- Calcular dígito verificador
    WHILE rut_number > 0 LOOP
        sum := sum + (rut_number % 10) * multiplier;
        rut_number := rut_number / 10;
        multiplier := multiplier + 1;
        IF multiplier > 7 THEN
            multiplier := 2;
        END IF;
    END LOOP;
    
    calculated_dv := CASE (11 - (sum % 11))
        WHEN 11 THEN '0'
        WHEN 10 THEN 'K'
        ELSE CAST((11 - (sum % 11)) AS CHAR)
    END;
    
    RETURN rut_dv = calculated_dv;
END;
$$ LANGUAGE plpgsql;

-- Constraint para validar RUT
ALTER TABLE contratantes
ADD CONSTRAINT check_rut_valid
CHECK (validate_rut(rut));

ALTER TABLE proveedores
ADD CONSTRAINT check_rut_valid
CHECK (validate_rut(rut));

ALTER TABLE clientes
ADD CONSTRAINT check_rut_valid
CHECK (validate_rut(rut));
```

### Función para Búsqueda Full-Text

```sql
-- Crear índice GIN para búsqueda full-text
CREATE INDEX idx_budgets_search ON budgets 
USING GIN (
    to_tsvector('spanish', 
        COALESCE(folio, '') || ' ' ||
        COALESCE(proyecto_nombre, '') || ' ' ||
        COALESCE(observaciones_internas, '')
    )
);

-- Función de búsqueda
CREATE OR REPLACE FUNCTION search_budgets(search_term TEXT)
RETURNS TABLE (
    id UUID,
    folio VARCHAR,
    cliente_nombre TEXT,
    estado VARCHAR,
    total_general DECIMAL,
    fecha_creacion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.folio,
        COALESCE(
            CASE 
                WHEN c.tipo_persona = 'persona-natural' 
                THEN c.nombres || ' ' || c.apellidos
                ELSE c.razon_social
            END,
            ''
        ) AS cliente_nombre,
        b.estado,
        b.total_general,
        b.fecha_creacion
    FROM budgets b
    LEFT JOIN contratantes c ON b.cliente_id = c.id
    WHERE 
        b.deleted_at IS NULL
        AND (
            to_tsvector('spanish', 
                COALESCE(b.folio, '') || ' ' ||
                COALESCE(b.proyecto_nombre, '') || ' ' ||
                COALESCE(b.observaciones_internas, '')
            ) @@ plainto_tsquery('spanish', search_term)
            OR b.folio ILIKE '%' || search_term || '%'
        )
    ORDER BY b.fecha_creacion DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## Buenas Prácticas

### 1. Seguridad

```sql
-- Row Level Security (RLS) para Supabase
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven sus propios presupuestos o los de su equipo
CREATE POLICY "Users can view own budgets"
ON budgets FOR SELECT
USING (
    auth.uid() = usuario_creador 
    OR auth.uid() IN (
        SELECT usuario_id FROM equipo_usuarios 
        WHERE equipo_id IN (
            SELECT equipo_id FROM equipo_usuarios 
            WHERE usuario_id = auth.uid()
        )
    )
);

-- Política: Solo usuarios autenticados pueden crear
CREATE POLICY "Authenticated users can create budgets"
ON budgets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_creador);
```

### 2. Optimización de Queries

```sql
-- Usar EXPLAIN ANALYZE para optimizar queries
EXPLAIN ANALYZE
SELECT b.*, c.razon_social
FROM budgets b
JOIN contratantes c ON b.cliente_id = c.id
WHERE b.estado = 'Aprobado'
ORDER BY b.fecha_creacion DESC
LIMIT 50;

-- Crear vistas materializadas para reportes frecuentes
CREATE MATERIALIZED VIEW budget_stats_monthly AS
SELECT 
    DATE_TRUNC('month', fecha_creacion) AS mes,
    estado,
    COUNT(*) AS cantidad,
    SUM(total_general) AS total_monto
FROM budgets
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', fecha_creacion), estado;

-- Refrescar periódicamente
REFRESH MATERIALIZED VIEW CONCURRENTLY budget_stats_monthly;
```

### 3. Backup y Mantenimiento

```sql
-- Script de mantenimiento diario
-- 1. Vacuum y Analyze
VACUUM ANALYZE budgets;
VACUUM ANALYZE budget_items;
VACUUM ANALYZE contratantes;

-- 2. Actualizar estadísticas
ANALYZE budgets;
ANALYZE budget_items;

-- 3. Limpiar registros antiguos (soft delete > 1 año)
UPDATE budgets
SET deleted_at = NOW()
WHERE deleted_at IS NULL
AND created_at < NOW() - INTERVAL '1 year'
AND estado IN ('Cerrado', 'Rechazado');
```

### 4. Validación de Datos

```typescript
// Usar Zod schemas en el backend también
import { z } from 'zod';

const BudgetSchema = z.object({
  cliente_id: z.string().uuid(),
  proyecto_nombre: z.string().optional(),
  estado: z.enum([
    'Borrador', 'En revisión', 'En proceso', 'Pendiente',
    'Aprobado', 'Rechazado', 'Finalizado', 'Cerrado'
  ]),
  moneda: z.enum(['CLP', 'USD', 'EUR']),
  tipo_cambio: z.number().positive().default(1.0),
  items: z.array(z.object({
    producto: z.string().min(1),
    cantidad: z.number().positive(),
    precio_unitario: z.number().nonnegative(),
    iva_porcentaje: z.number().min(0).max(100).default(19),
  })).optional(),
});

// Validar antes de insertar
const validated = BudgetSchema.parse(requestBody);
```

### 5. Manejo de Errores

```typescript
// Estructura estándar de respuesta de error
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Códigos de error estándar
const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

// Ejemplo de uso
if (!budget) {
  return NextResponse.json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'Presupuesto no encontrado',
    },
  }, { status: 404 });
}
```

### 6. Logging y Auditoría

```sql
-- Tabla de auditoría
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabla VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    usuario_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_accion CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- Trigger de auditoría genérico
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (tabla, registro_id, accion, datos_nuevos)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (tabla, registro_id, accion, datos_anteriores, datos_nuevos)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (tabla, registro_id, accion, datos_anteriores)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas críticas
CREATE TRIGGER audit_budgets
AFTER INSERT OR UPDATE OR DELETE ON budgets
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

## Checklist de Implementación

### Fase 1: Base de Datos
- [ ] Crear todas las tablas
- [ ] Definir constraints y validaciones
- [ ] Crear índices necesarios
- [ ] Configurar triggers automáticos
- [ ] Implementar funciones de utilidad

### Fase 2: API Backend
- [ ] Implementar endpoints CRUD básicos
- [ ] Agregar validación con Zod
- [ ] Implementar autenticación/autorización
- [ ] Agregar manejo de errores
- [ ] Implementar paginación
- [ ] Agregar filtros y búsqueda

### Fase 3: Funcionalidades Avanzadas
- [ ] Implementar historial de cambios
- [ ] Agregar sistema de notas
- [ ] Implementar duplicación de presupuestos
- [ ] Agregar exportación a PDF
- [ ] Implementar notificaciones

### Fase 4: Optimización
- [ ] Optimizar queries lentas
- [ ] Implementar caché donde sea necesario
- [ ] Agregar índices adicionales según uso
- [ ] Configurar backups automáticos
- [ ] Implementar monitoreo y logging

---

## Recursos Adicionales

- [Documentación PostgreSQL](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0

