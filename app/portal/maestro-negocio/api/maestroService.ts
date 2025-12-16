/**
 * Servicio API para el módulo Maestro de Negocio
 * Gestiona CRUD de Contratantes, Proveedores, Servicios, Productos y Packs
 * Actualmente usa datos mock con latencia simulada
 */

import {
  Contratante,
  Proveedor,
  Servicio,
  Producto,
  PackServicio,
  Direccion,
  CreateContratanteInput,
  UpdateContratanteInput,
  CreateProveedorInput,
  UpdateProveedorInput,
  CreateServicioInput,
  UpdateServicioInput,
  CreateProductoInput,
  UpdateProductoInput,
  CreatePackServicioInput,
  UpdatePackServicioInput,
  CreateDireccionInput,
} from "../types/maestroNegocio";

// ============================================
// MOCK DATA - CONTRATANTES
// ============================================

const MOCK_CONTRATANTES: Contratante[] = [
  {
    id: "cont-1",
    tipoPersona: "empresa",
    rut: "76.543.210-5",
    razonSocial: "Constructora Los Andes SpA",
    giro: "Construcción y Obras Civiles",
    email: "contacto@losandes.cl",
    telefono: "+56 2 2345 6789",
    estado: "Activo",
    fechaCreacion: "2024-01-15T10:00:00Z",
    fechaActualizacion: "2024-11-20T15:30:00Z",
    direcciones: [
      {
        id: "dir-1",
        nombre: "Casa Matriz",
        regionId: "13",
        regionNombre: "Región Metropolitana",
        ciudadId: "131",
        ciudadNombre: "Santiago",
        comuna: "Las Condes",
        calle: "Av. Apoquindo",
        numero: "4500",
        complemento: "Piso 12, Of. 1201",
        esPrincipal: true,
        contactoNombre: "María González",
        contactoTelefono: "+56 9 8765 4321",
        contactoEmail: "maria.gonzalez@losandes.cl",
        activa: true,
      },
      {
        id: "dir-2",
        nombre: "Sucursal Sur",
        regionId: "13",
        regionNombre: "Región Metropolitana",
        ciudadId: "131",
        ciudadNombre: "Santiago",
        comuna: "La Florida",
        calle: "Av. Vicuña Mackenna",
        numero: "7110",
        esPrincipal: false,
        contactoNombre: "Pedro Ramírez",
        contactoTelefono: "+56 9 7654 3210",
        contactoEmail: "pedro.ramirez@losandes.cl",
        activa: true,
      },
    ],
    notas: "Cliente preferencial con más de 15 proyectos completados",
  },
  {
    id: "cont-2",
    tipoPersona: "persona-natural",
    rut: "12.345.678-9",
    nombres: "Juan Carlos",
    apellidos: "Pérez Soto",
    email: "jcperez@gmail.com",
    telefono: "+56 9 9876 5432",
    estado: "Activo",
    fechaCreacion: "2024-03-10T08:30:00Z",
    fechaActualizacion: "2024-10-15T12:00:00Z",
    direcciones: [
      {
        id: "dir-3",
        nombre: "Domicilio Particular",
        regionId: "5",
        regionNombre: "Región de Valparaíso",
        ciudadId: "51",
        ciudadNombre: "Valparaíso",
        comuna: "Viña del Mar",
        calle: "Av. Libertad",
        numero: "1234",
        complemento: "Depto. 501",
        esPrincipal: true,
        contactoTelefono: "+56 9 9876 5432",
        activa: true,
      },
    ],
  },
  {
    id: "cont-3",
    tipoPersona: "empresa",
    rut: "88.888.888-8",
    razonSocial: "Inmobiliaria Del Mar Limitada",
    giro: "Desarrollo Inmobiliario",
    email: "info@delmar.cl",
    telefono: "+56 32 268 5000",
    estado: "Inactivo",
    fechaCreacion: "2023-05-20T14:00:00Z",
    fechaActualizacion: "2024-08-01T09:00:00Z",
    direcciones: [
      {
        id: "dir-4",
        nombre: "Oficina Central",
        regionId: "5",
        regionNombre: "Región de Valparaíso",
        ciudadId: "51",
        ciudadNombre: "Valparaíso",
        comuna: "Reñaca",
        calle: "Av. Borgoño",
        numero: "15400",
        esPrincipal: true,
        activa: false,
      },
    ],
    notas: "Contrato suspendido temporalmente",
  },
];

// ============================================
// MOCK DATA - PROVEEDORES
// ============================================

const MOCK_PROVEEDORES: Proveedor[] = [
  {
    id: "prov-default",
    tipoPersona: "empresa",
    rut: "77.777.777-7",
    razonSocial: "Empresa del cliente AFLOW",
    giro: "Servicios Tecnológicos",
    email: "servicios@aflow.cl",
    telefono: "+56 2 2987 6543",
    estado: "Activo",
    esProveedorDefault: true,
    fechaCreacion: "2023-01-01T00:00:00Z",
    fechaActualizacion: "2024-12-15T10:00:00Z",
    productos: [
      {
        id: "prod-1",
        proveedorId: "prov-default",
        nombre: "Consultoría Senior",
        descripcion: "Hora de consultoría especializada nivel senior",
        valorInterno: 75000,
        unidadMedida: "HR",
        estado: "Activo",
        codigo: "CS-001",
        categoria: "Servicios Profesionales",
        fechaCreacion: "2023-01-01T00:00:00Z",
        fechaActualizacion: "2024-06-15T10:00:00Z",
      },
      {
        id: "prod-2",
        proveedorId: "prov-default",
        nombre: "Desarrollo Frontend",
        descripcion: "Hora de desarrollo frontend React/Next.js",
        valorInterno: 55000,
        unidadMedida: "HR",
        estado: "Activo",
        codigo: "DF-001",
        categoria: "Desarrollo",
        fechaCreacion: "2023-01-01T00:00:00Z",
        fechaActualizacion: "2024-06-15T10:00:00Z",
      },
    ],
    direcciones: [
      {
        id: "dir-5",
        nombre: "Oficina Principal AFLOW",
        regionId: "13",
        regionNombre: "Región Metropolitana",
        ciudadId: "131",
        ciudadNombre: "Santiago",
        comuna: "Providencia",
        calle: "Av. Providencia",
        numero: "2653",
        complemento: "Of. 808",
        esPrincipal: true,
        activa: true,
      },
    ],
    notas: "Proveedor interno - NO ELIMINAR",
  },
  {
    id: "prov-2",
    tipoPersona: "empresa",
    rut: "79.123.456-7",
    razonSocial: "Ferretería Industrial Ltda",
    giro: "Comercialización de materiales",
    email: "ventas@ferreteriaind.cl",
    telefono: "+56 2 2555 6789",
    estado: "Activo",
    esProveedorDefault: false,
    fechaCreacion: "2023-06-10T09:00:00Z",
    fechaActualizacion: "2024-11-30T14:30:00Z",
    productos: [
      {
        id: "prod-3",
        proveedorId: "prov-2",
        nombre: "Cemento Portland 42.5kg",
        descripcion: "Saco de cemento grado estructural",
        valorInterno: 8500,
        unidadMedida: "UN",
        estado: "Activo",
        codigo: "CEM-425",
        categoria: "Materiales de Construcción",
        fechaCreacion: "2023-06-10T09:00:00Z",
        fechaActualizacion: "2024-10-01T10:00:00Z",
      },
      {
        id: "prod-4",
        proveedorId: "prov-2",
        nombre: "Fierro Construcción 8mm",
        descripcion: "Varilla de acero estriado 8mm x 6m",
        valorInterno: 4200,
        unidadMedida: "UN",
        estado: "Activo",
        codigo: "FIE-08",
        categoria: "Materiales de Construcción",
        fechaCreacion: "2023-06-10T09:00:00Z",
        fechaActualizacion: "2024-10-01T10:00:00Z",
      },
    ],
    direcciones: [
      {
        id: "dir-6",
        nombre: "Bodega Central",
        regionId: "13",
        regionNombre: "Región Metropolitana",
        ciudadId: "131",
        ciudadNombre: "Santiago",
        comuna: "Quilicura",
        calle: "Los Aromos",
        numero: "1500",
        esPrincipal: true,
        activa: true,
      },
    ],
  },
  {
    id: "prov-3",
    tipoPersona: "persona-natural",
    rut: "16.789.012-3",
    nombres: "Ana María",
    apellidos: "Soto Fernández",
    email: "ana.soto.arquitecta@gmail.com",
    telefono: "+56 9 8123 4567",
    estado: "Activo",
    esProveedorDefault: false,
    fechaCreacion: "2024-02-15T11:00:00Z",
    fechaActualizacion: "2024-12-01T09:30:00Z",
    productos: [
      {
        id: "prod-5",
        proveedorId: "prov-3",
        nombre: "Diseño Arquitectónico",
        descripcion: "Hora de diseño y planificación arquitectónica",
        valorInterno: 65000,
        unidadMedida: "HR",
        estado: "Activo",
        codigo: "ARQ-001",
        categoria: "Servicios Profesionales",
        fechaCreacion: "2024-02-15T11:00:00Z",
        fechaActualizacion: "2024-12-01T09:30:00Z",
      },
    ],
    direcciones: [
      {
        id: "dir-7",
        nombre: "Oficina Particular",
        regionId: "13",
        regionNombre: "Región Metropolitana",
        ciudadId: "131",
        ciudadNombre: "Santiago",
        comuna: "Ñuñoa",
        calle: "Irarrázaval",
        numero: "2871",
        complemento: "Of. 302",
        esPrincipal: true,
        activa: true,
      },
    ],
  },
];

// ============================================
// MOCK DATA - SERVICIOS
// ============================================

const MOCK_SERVICIOS: Servicio[] = [
  {
    id: "serv-1",
    nombre: "Instalación Eléctrica Básica",
    descripcion: "Instalación completa de sistema eléctrico residencial básico",
    valorBase: 850000,
    estado: "Activo",
    categoria: "Electricidad",
    codigo: "ELEC-001",
    unidadMedida: "UN",
    fechaCreacion: "2023-03-10T10:00:00Z",
    fechaActualizacion: "2024-09-15T14:00:00Z",
  },
  {
    id: "serv-2",
    nombre: "Gasfitería Residencial",
    descripcion: "Instalación de red de agua potable y alcantarillado",
    valorBase: 650000,
    estado: "Activo",
    categoria: "Gasfitería",
    codigo: "GAS-001",
    unidadMedida: "UN",
    fechaCreacion: "2023-03-10T10:00:00Z",
    fechaActualizacion: "2024-09-15T14:00:00Z",
  },
  {
    id: "serv-3",
    nombre: "Pintura Interior",
    descripcion: "Pintura látex para interiores, incluye mano de obra",
    valorBase: 12000,
    estado: "Activo",
    categoria: "Terminaciones",
    codigo: "PINT-001",
    unidadMedida: "M2",
    fechaCreacion: "2023-03-10T10:00:00Z",
    fechaActualizacion: "2024-09-15T14:00:00Z",
  },
  {
    id: "serv-4",
    nombre: "Instalación Piso Flotante",
    descripcion: "Instalación de piso flotante AC4, incluye material y mano de obra",
    valorBase: 18000,
    estado: "Activo",
    categoria: "Pisos",
    codigo: "PISO-001",
    unidadMedida: "M2",
    fechaCreacion: "2023-04-05T09:00:00Z",
    fechaActualizacion: "2024-10-20T11:00:00Z",
  },
  {
    id: "serv-5",
    nombre: "Diseño Arquitectónico Premium",
    descripcion: "Servicio integral de diseño arquitectónico con planos y especificaciones",
    valorBase: 2500000,
    estado: "Activo",
    categoria: "Diseño",
    codigo: "ARQ-PRE",
    unidadMedida: "UN",
    fechaCreacion: "2023-05-20T13:00:00Z",
    fechaActualizacion: "2024-11-10T16:00:00Z",
  },
  {
    id: "serv-6",
    nombre: "Impermeabilización",
    descripcion: "Tratamiento impermeabilizante para terrazas y techos",
    valorBase: 15000,
    estado: "Inactivo",
    categoria: "Impermeabilización",
    codigo: "IMP-001",
    unidadMedida: "M2",
    fechaCreacion: "2023-02-15T08:00:00Z",
    fechaActualizacion: "2024-07-01T10:00:00Z",
  },
];

// ============================================
// MOCK DATA - PACKS DE SERVICIOS
// ============================================

const MOCK_PACKS: PackServicio[] = [
  {
    id: "pack-1",
    nombre: "Pack Remodelación Básica",
    descripcion: "Incluye pintura, pisos y gasfitería para departamento hasta 60m2",
    items: [
      {
        tipo: "servicio",
        id: "serv-3", // Pintura Interior
        cantidad: 60,
        valorUnitario: 12000,
        valorTotal: 720000,
      },
      {
        tipo: "servicio",
        id: "serv-4", // Piso Flotante
        cantidad: 40,
        valorUnitario: 18000,
        valorTotal: 720000,
      },
      {
        tipo: "servicio",
        id: "serv-2", // Gasfitería
        cantidad: 1,
        valorUnitario: 650000,
        valorTotal: 650000,
      },
    ],
    valorTotal: 2090000,
    estado: "Activo",
    fechaCreacion: "2023-08-10T10:00:00Z",
    fechaActualizacion: "2024-11-20T15:00:00Z",
  },
  {
    id: "pack-2",
    nombre: "Pack Construcción Completa",
    descripcion: "Servicio integral: diseño + electricidad + gasfitería para obra nueva",
    items: [
      {
        tipo: "servicio",
        id: "serv-5", // Diseño Arquitectónico
        cantidad: 1,
        valorUnitario: 2500000,
        valorTotal: 2500000,
      },
      {
        tipo: "servicio",
        id: "serv-1", // Instalación Eléctrica
        cantidad: 1,
        valorUnitario: 850000,
        valorTotal: 850000,
      },
      {
        tipo: "servicio",
        id: "serv-2", // Gasfitería
        cantidad: 1,
        valorUnitario: 650000,
        valorTotal: 650000,
      },
      {
        tipo: "producto",
        id: "prod-1", // Consultoría Senior
        cantidad: 40,
        valorUnitario: 75000,
        valorTotal: 3000000,
      },
    ],
    valorTotal: 7000000,
    estado: "Activo",
    fechaCreacion: "2023-09-15T12:00:00Z",
    fechaActualizacion: "2024-12-01T09:00:00Z",
  },
];

// ============================================
// HELPERS - SIMULACIÓN DE LATENCIA
// ============================================

const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ============================================
// SERVICIOS - CONTRATANTES
// ============================================

export async function fetchContratantes(): Promise<Contratante[]> {
  await simulateDelay(1000);
  return [...MOCK_CONTRATANTES];
}

export async function fetchContratanteById(id: string): Promise<Contratante | null> {
  await simulateDelay(600);
  const contratante = MOCK_CONTRATANTES.find((c) => c.id === id);
  return contratante ? { ...contratante } : null;
}

export async function createContratante(input: CreateContratanteInput): Promise<Contratante> {
  await simulateDelay(800);
  
  const newContratante: Contratante = input.tipoPersona === "persona-natural"
    ? {
        id: `cont-${Date.now()}`,
        tipoPersona: "persona-natural",
        rut: input.rut,
        nombres: input.nombres!,
        apellidos: input.apellidos!,
        email: input.email,
        telefono: input.telefono,
        estado: input.estado,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        direcciones: [],
        notas: input.notas,
      }
    : {
        id: `cont-${Date.now()}`,
        tipoPersona: "empresa",
        rut: input.rut,
        razonSocial: input.razonSocial!,
        giro: input.giro!,
        email: input.email,
        telefono: input.telefono,
        estado: input.estado,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        direcciones: [],
        notas: input.notas,
      };

  MOCK_CONTRATANTES.unshift(newContratante);
  return newContratante;
}

export async function updateContratante(input: UpdateContratanteInput): Promise<Contratante> {
  await simulateDelay(700);
  
  const index = MOCK_CONTRATANTES.findIndex((c) => c.id === input.id);
  if (index === -1) {
    throw new Error("Contratante no encontrado");
  }

  const updated = {
    ...MOCK_CONTRATANTES[index],
    ...input,
    fechaActualizacion: new Date().toISOString(),
  } as Contratante;

  MOCK_CONTRATANTES[index] = updated;
  return updated;
}

export async function deleteContratante(id: string): Promise<void> {
  await simulateDelay(500);
  
  const index = MOCK_CONTRATANTES.findIndex((c) => c.id === id);
  if (index !== -1) {
    // Soft delete: cambiar estado a Inactivo
    MOCK_CONTRATANTES[index].estado = "Inactivo";
  }
}

// ============================================
// SERVICIOS - DIRECCIONES
// ============================================

export async function createDireccion(input: CreateDireccionInput): Promise<Direccion> {
  await simulateDelay(600);
  
  const contratante = MOCK_CONTRATANTES.find((c) => c.id === input.contratanteId);
  if (!contratante) {
    throw new Error("Contratante no encontrado");
  }

  // Si es principal, desmarcar otras direcciones
  if (input.esPrincipal) {
    contratante.direcciones.forEach((d) => (d.esPrincipal = false));
  }

  const newDireccion: Direccion = {
    id: `dir-${Date.now()}`,
    nombre: input.nombre,
    regionId: input.regionId,
    ciudadId: input.ciudadId,
    comuna: input.comuna,
    calle: input.calle,
    numero: input.numero,
    complemento: input.complemento,
    esPrincipal: input.esPrincipal,
    contactoNombre: input.contactoNombre,
    contactoTelefono: input.contactoTelefono,
    contactoEmail: input.contactoEmail,
    activa: true,
  };

  contratante.direcciones.push(newDireccion);
  return newDireccion;
}

export async function updateDireccion(
  contratanteId: string,
  direccionId: string,
  updates: Partial<Direccion>
): Promise<Direccion> {
  await simulateDelay(600);
  
  const contratante = MOCK_CONTRATANTES.find((c) => c.id === contratanteId);
  if (!contratante) {
    throw new Error("Contratante no encontrado");
  }

  const direccionIndex = contratante.direcciones.findIndex((d) => d.id === direccionId);
  if (direccionIndex === -1) {
    throw new Error("Dirección no encontrada");
  }

  // Si se marca como principal, desmarcar otras
  if (updates.esPrincipal) {
    contratante.direcciones.forEach((d) => (d.esPrincipal = false));
  }

  const updated = {
    ...contratante.direcciones[direccionIndex],
    ...updates,
  };

  contratante.direcciones[direccionIndex] = updated;
  return updated;
}

export async function deleteDireccion(contratanteId: string, direccionId: string): Promise<void> {
  await simulateDelay(500);
  
  const contratante = MOCK_CONTRATANTES.find((c) => c.id === contratanteId);
  if (!contratante) {
    throw new Error("Contratante no encontrado");
  }

  const index = contratante.direcciones.findIndex((d) => d.id === direccionId);
  if (index !== -1) {
    contratante.direcciones[index].activa = false;
  }
}

// ============================================
// SERVICIOS - PROVEEDORES
// ============================================

export async function fetchProveedores(): Promise<Proveedor[]> {
  await simulateDelay(1000);
  return [...MOCK_PROVEEDORES];
}

export async function fetchProveedorById(id: string): Promise<Proveedor | null> {
  await simulateDelay(600);
  const proveedor = MOCK_PROVEEDORES.find((p) => p.id === id);
  return proveedor ? { ...proveedor } : null;
}

export async function createProveedor(input: CreateProveedorInput): Promise<Proveedor> {
  await simulateDelay(800);
  
  const newProveedor: Proveedor = input.tipoPersona === "persona-natural"
    ? {
        id: `prov-${Date.now()}`,
        tipoPersona: "persona-natural",
        rut: input.rut,
        nombres: input.nombres!,
        apellidos: input.apellidos!,
        email: input.email,
        telefono: input.telefono,
        estado: input.estado,
        esProveedorDefault: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        productos: [],
        direcciones: [],
        notas: input.notas,
      }
    : {
        id: `prov-${Date.now()}`,
        tipoPersona: "empresa",
        rut: input.rut,
        razonSocial: input.razonSocial!,
        giro: input.giro!,
        email: input.email,
        telefono: input.telefono,
        estado: input.estado,
        esProveedorDefault: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        productos: [],
        direcciones: [],
        notas: input.notas,
      };

  MOCK_PROVEEDORES.push(newProveedor);
  return newProveedor;
}

export async function updateProveedor(input: UpdateProveedorInput): Promise<Proveedor> {
  await simulateDelay(700);
  
  const index = MOCK_PROVEEDORES.findIndex((p) => p.id === input.id);
  if (index === -1) {
    throw new Error("Proveedor no encontrado");
  }

  // Protección: no permitir cambio de esProveedorDefault
  const proveedor = MOCK_PROVEEDORES[index];
  if (proveedor.esProveedorDefault && input.rut && input.rut !== proveedor.rut) {
    throw new Error("No se puede modificar el RUT del proveedor default");
  }

  const updated = {
    ...proveedor,
    ...input,
    esProveedorDefault: proveedor.esProveedorDefault, // Mantener flag
    fechaActualizacion: new Date().toISOString(),
  } as Proveedor;

  MOCK_PROVEEDORES[index] = updated;
  return updated;
}

export async function deleteProveedor(id: string): Promise<void> {
  await simulateDelay(500);
  
  const proveedor = MOCK_PROVEEDORES.find((p) => p.id === id);
  if (proveedor?.esProveedorDefault) {
    throw new Error("No se puede eliminar el proveedor default");
  }

  const index = MOCK_PROVEEDORES.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PROVEEDORES[index].estado = "Inactivo";
  }
}

// ============================================
// SERVICIOS - PRODUCTOS
// ============================================

export async function createProducto(input: CreateProductoInput): Promise<Producto> {
  await simulateDelay(600);
  
  const proveedor = MOCK_PROVEEDORES.find((p) => p.id === input.proveedorId);
  if (!proveedor) {
    throw new Error("Proveedor no encontrado");
  }

  const newProducto: Producto = {
    id: `prod-${Date.now()}`,
    proveedorId: input.proveedorId,
    nombre: input.nombre,
    descripcion: input.descripcion,
    valorInterno: input.valorInterno,
    unidadMedida: input.unidadMedida,
    estado: input.estado,
    codigo: input.codigo,
    categoria: input.categoria,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  proveedor.productos.push(newProducto);
  return newProducto;
}

export async function updateProducto(input: UpdateProductoInput): Promise<Producto> {
  await simulateDelay(600);
  
  for (const proveedor of MOCK_PROVEEDORES) {
    const index = proveedor.productos.findIndex((p) => p.id === input.id);
    if (index !== -1) {
      const updated = {
        ...proveedor.productos[index],
        ...input,
        fechaActualizacion: new Date().toISOString(),
      };
      proveedor.productos[index] = updated;
      return updated;
    }
  }

  throw new Error("Producto no encontrado");
}

export async function deleteProducto(productoId: string): Promise<void> {
  await simulateDelay(500);
  
  for (const proveedor of MOCK_PROVEEDORES) {
    const producto = proveedor.productos.find((p) => p.id === productoId);
    if (producto) {
      producto.estado = "Inactivo";
      return;
    }
  }
}

// ============================================
// SERVICIOS - SERVICIOS
// ============================================

export async function fetchServicios(): Promise<Servicio[]> {
  await simulateDelay(900);
  return [...MOCK_SERVICIOS];
}

export async function fetchServicioById(id: string): Promise<Servicio | null> {
  await simulateDelay(600);
  const servicio = MOCK_SERVICIOS.find((s) => s.id === id);
  return servicio ? { ...servicio } : null;
}

export async function createServicio(input: CreateServicioInput): Promise<Servicio> {
  await simulateDelay(700);
  
  const newServicio: Servicio = {
    id: `serv-${Date.now()}`,
    nombre: input.nombre,
    descripcion: input.descripcion,
    valorBase: input.valorBase,
    estado: input.estado,
    categoria: input.categoria,
    codigo: input.codigo,
    unidadMedida: input.unidadMedida,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  MOCK_SERVICIOS.unshift(newServicio);
  return newServicio;
}

export async function updateServicio(input: UpdateServicioInput): Promise<Servicio> {
  await simulateDelay(700);
  
  const index = MOCK_SERVICIOS.findIndex((s) => s.id === input.id);
  if (index === -1) {
    throw new Error("Servicio no encontrado");
  }

  const updated = {
    ...MOCK_SERVICIOS[index],
    ...input,
    fechaActualizacion: new Date().toISOString(),
  };

  MOCK_SERVICIOS[index] = updated;
  return updated;
}

export async function deleteServicio(id: string): Promise<void> {
  await simulateDelay(500);
  
  const index = MOCK_SERVICIOS.findIndex((s) => s.id === id);
  if (index !== -1) {
    MOCK_SERVICIOS[index].estado = "Inactivo";
  }
}

// ============================================
// SERVICIOS - PACKS DE SERVICIOS
// ============================================

export async function fetchPacks(): Promise<PackServicio[]> {
  await simulateDelay(900);
  return [...MOCK_PACKS];
}

export async function fetchPackById(id: string): Promise<PackServicio | null> {
  await simulateDelay(600);
  const pack = MOCK_PACKS.find((p) => p.id === id);
  return pack ? { ...pack } : null;
}

export async function createPack(input: CreatePackServicioInput): Promise<PackServicio> {
  await simulateDelay(800);
  
  // Calcular valor total
  const itemsWithTotal = input.items.map((item) => ({
    ...item,
    valorTotal: item.cantidad * item.valorUnitario,
  }));

  const valorTotal = itemsWithTotal.reduce((sum, item) => sum + item.valorTotal, 0);

  const newPack: PackServicio = {
    id: `pack-${Date.now()}`,
    nombre: input.nombre,
    descripcion: input.descripcion,
    items: itemsWithTotal,
    valorTotal,
    estado: input.estado,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  MOCK_PACKS.unshift(newPack);
  return newPack;
}

export async function updatePack(input: UpdatePackServicioInput): Promise<PackServicio> {
  await simulateDelay(700);
  
  const index = MOCK_PACKS.findIndex((p) => p.id === input.id);
  if (index === -1) {
    throw new Error("Pack no encontrado");
  }

  // Recalcular totales si se actualizan items
  let itemsWithTotal = MOCK_PACKS[index].items;
  let valorTotal = MOCK_PACKS[index].valorTotal;

  if (input.items) {
    itemsWithTotal = input.items.map((item) => ({
      ...item,
      valorTotal: item.cantidad * item.valorUnitario,
    }));
    valorTotal = itemsWithTotal.reduce((sum, item) => sum + item.valorTotal, 0);
  }

  const updated: PackServicio = {
    ...MOCK_PACKS[index],
    ...input,
    items: itemsWithTotal,
    valorTotal,
    fechaActualizacion: new Date().toISOString(),
  };

  MOCK_PACKS[index] = updated;
  return updated;
}

export async function deletePack(id: string): Promise<void> {
  await simulateDelay(500);
  
  const index = MOCK_PACKS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PACKS[index].estado = "Inactivo";
  }
}

// ============================================
// HELPERS - BÚSQUEDA Y FILTRADO
// ============================================

export function filterContratantes(
  contratantes: Contratante[],
  busqueda: string,
  tipoPersona?: string,
  estado?: string
): Contratante[] {
  return contratantes.filter((c) => {
    const searchLower = busqueda.toLowerCase();
    const matchesBusqueda =
      !busqueda ||
      c.rut.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      (c.tipoPersona === "persona-natural" &&
        (`${c.nombres} ${c.apellidos}`.toLowerCase().includes(searchLower))) ||
      (c.tipoPersona === "empresa" && c.razonSocial.toLowerCase().includes(searchLower));

    const matchesTipo = !tipoPersona || c.tipoPersona === tipoPersona;
    const matchesEstado = !estado || c.estado === estado;

    return matchesBusqueda && matchesTipo && matchesEstado;
  });
}

export function filterProveedores(
  proveedores: Proveedor[],
  busqueda: string,
  tipoPersona?: string,
  estado?: string
): Proveedor[] {
  return proveedores.filter((p) => {
    const searchLower = busqueda.toLowerCase();
    const matchesBusqueda =
      !busqueda ||
      p.rut.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      (p.tipoPersona === "persona-natural" &&
        (`${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchLower))) ||
      (p.tipoPersona === "empresa" && p.razonSocial.toLowerCase().includes(searchLower));

    const matchesTipo = !tipoPersona || p.tipoPersona === tipoPersona;
    const matchesEstado = !estado || p.estado === estado;

    return matchesBusqueda && matchesTipo && matchesEstado;
  });
}
