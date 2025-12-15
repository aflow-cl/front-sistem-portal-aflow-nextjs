import type {
  Cliente,
  CreateClienteInput,
  Perfil,
  CreatePerfilInput,
  Servicio,
  CreateServicioInput,
  OpcionMenu,
  DashboardStats,
  ActividadReciente,
  Sucursal,
  UsuarioCliente,
  ServicioContratado,
} from "../types/ajustes";

// ============================================
// DATOS MOCK - CLIENTES
// ============================================

const MOCK_CLIENTES: Cliente[] = [
  {
    id: "1",
    rut: "76.123.456-0",
    razonSocial: "Constructora Los Andes S.A.",
    nombreFantasia: "Los Andes",
    giro: "Construcción y obras civiles",
    direccion: "Av. Apoquindo 4501, Piso 12",
    region: "Metropolitana",
    comuna: "Las Condes",
    telefono: "+56 2 2345 6789",
    email: "contacto@losandes.cl",
    sitioWeb: "www.losandes.cl",
    contactoPrincipal: "Carlos Muñoz",
    emailContacto: "cmunoz@losandes.cl",
    activo: true,
    sucursales: [
      {
        id: "s1",
        nombre: "Casa Matriz",
        direccion: "Av. Apoquindo 4501",
        region: "Metropolitana",
        comuna: "Las Condes",
        telefono: "+56 2 2345 6789",
        email: "matriz@losandes.cl",
        activa: true,
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "s2",
        nombre: "Sucursal Valparaíso",
        direccion: "Av. Brasil 2550",
        region: "Valparaíso",
        comuna: "Valparaíso",
        telefono: "+56 32 234 5678",
        email: "valparaiso@losandes.cl",
        activa: true,
        createdAt: "2024-03-20T10:00:00Z",
      },
    ],
    usuarios: [
      {
        id: "u1",
        nombre: "Carlos",
        apellido: "Muñoz",
        email: "cmunoz@losandes.cl",
        telefono: "+56 9 8765 4321",
        perfilId: "p1",
        perfilNombre: "Administrador Cliente",
        sucursalId: "s1",
        sucursalNombre: "Casa Matriz",
        activo: true,
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "u2",
        nombre: "María",
        apellido: "González",
        email: "mgonzalez@losandes.cl",
        telefono: "+56 9 7654 3210",
        perfilId: "p3",
        perfilNombre: "Operador",
        sucursalId: "s2",
        sucursalNombre: "Sucursal Valparaíso",
        activo: true,
        createdAt: "2024-03-20T10:00:00Z",
      },
    ],
    serviciosContratados: [
      {
        id: "sc1",
        servicioId: "serv1",
        servicioNombre: "Portal de Presupuestos",
        fechaInicio: "2024-01-15",
        estado: "Activo",
        tarifaMensual: 150000,
      },
      {
        id: "sc2",
        servicioId: "serv2",
        servicioNombre: "Gestión de Proyectos",
        fechaInicio: "2024-02-01",
        estado: "Activo",
        tarifaMensual: 200000,
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-11-20T15:30:00Z",
  },
  {
    id: "2",
    rut: "77.234.567-1",
    razonSocial: "Minera del Norte SpA",
    nombreFantasia: "Minera Norte",
    giro: "Extracción y procesamiento de minerales",
    direccion: "Av. Grecia 8800",
    region: "Antofagasta",
    comuna: "Antofagasta",
    telefono: "+56 55 234 5678",
    email: "info@mineranorte.cl",
    sitioWeb: "www.mineranorte.cl",
    contactoPrincipal: "Roberto Silva",
    emailContacto: "rsilva@mineranorte.cl",
    activo: true,
    sucursales: [
      {
        id: "s3",
        nombre: "Oficina Central",
        direccion: "Av. Grecia 8800",
        region: "Antofagasta",
        comuna: "Antofagasta",
        telefono: "+56 55 234 5678",
        email: "central@mineranorte.cl",
        activa: true,
        createdAt: "2024-02-10T10:00:00Z",
      },
    ],
    usuarios: [
      {
        id: "u3",
        nombre: "Roberto",
        apellido: "Silva",
        email: "rsilva@mineranorte.cl",
        telefono: "+56 9 6543 2109",
        perfilId: "p1",
        perfilNombre: "Administrador Cliente",
        sucursalId: "s3",
        sucursalNombre: "Oficina Central",
        activo: true,
        createdAt: "2024-02-10T10:00:00Z",
      },
    ],
    serviciosContratados: [
      {
        id: "sc3",
        servicioId: "serv1",
        servicioNombre: "Portal de Presupuestos",
        fechaInicio: "2024-02-10",
        estado: "Activo",
        tarifaMensual: 150000,
      },
    ],
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-10-15T12:00:00Z",
  },
  {
    id: "3",
    rut: "78.345.678-2",
    razonSocial: "Transportes Rapidos Ltda.",
    nombreFantasia: "Express Cargo",
    giro: "Transporte de carga terrestre",
    direccion: "Ruta 68 Km 15",
    region: "Metropolitana",
    comuna: "Pudahuel",
    telefono: "+56 2 3456 7890",
    email: "contacto@expresscargo.cl",
    contactoPrincipal: "Ana Torres",
    emailContacto: "atorres@expresscargo.cl",
    activo: false,
    sucursales: [],
    usuarios: [],
    serviciosContratados: [],
    createdAt: "2023-11-05T10:00:00Z",
    updatedAt: "2024-08-20T09:15:00Z",
  },
];

// ============================================
// DATOS MOCK - PERFILES
// ============================================

const MOCK_PERFILES: Perfil[] = [
  {
    id: "p1",
    nombre: "Administrador Cliente",
    descripcion: "Acceso completo a todas las funcionalidades del cliente",
    nivel: "Administrador",
    color: "#DC2626",
    permisos: [
      { id: "pm1", modulo: "Presupuestos", accion: "Crear", habilitado: true },
      { id: "pm2", modulo: "Presupuestos", accion: "Leer", habilitado: true },
      { id: "pm3", modulo: "Presupuestos", accion: "Editar", habilitado: true },
      { id: "pm4", modulo: "Presupuestos", accion: "Eliminar", habilitado: true },
      { id: "pm5", modulo: "Presupuestos", accion: "Exportar", habilitado: true },
      { id: "pm6", modulo: "Proyectos", accion: "Crear", habilitado: true },
      { id: "pm7", modulo: "Proyectos", accion: "Leer", habilitado: true },
      { id: "pm8", modulo: "Proyectos", accion: "Editar", habilitado: true },
    ],
    usuariosAsignados: 12,
    activo: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-11-15T14:20:00Z",
  },
  {
    id: "p2",
    nombre: "Supervisor",
    descripcion: "Supervisión y aprobación de operaciones",
    nivel: "Supervisor",
    color: "#F59E0B",
    permisos: [
      { id: "pm9", modulo: "Presupuestos", accion: "Crear", habilitado: true },
      { id: "pm10", modulo: "Presupuestos", accion: "Leer", habilitado: true },
      { id: "pm11", modulo: "Presupuestos", accion: "Editar", habilitado: true },
      { id: "pm12", modulo: "Presupuestos", accion: "Eliminar", habilitado: false },
      { id: "pm13", modulo: "Presupuestos", accion: "Exportar", habilitado: true },
    ],
    usuariosAsignados: 8,
    activo: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-09-10T11:30:00Z",
  },
  {
    id: "p3",
    nombre: "Operador",
    descripcion: "Operación básica del sistema",
    nivel: "Operador",
    color: "#3B82F6",
    permisos: [
      { id: "pm14", modulo: "Presupuestos", accion: "Crear", habilitado: true },
      { id: "pm15", modulo: "Presupuestos", accion: "Leer", habilitado: true },
      { id: "pm16", modulo: "Presupuestos", accion: "Editar", habilitado: false },
      { id: "pm17", modulo: "Presupuestos", accion: "Eliminar", habilitado: false },
      { id: "pm18", modulo: "Presupuestos", accion: "Exportar", habilitado: false },
    ],
    usuariosAsignados: 25,
    activo: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-10-05T09:00:00Z",
  },
  {
    id: "p4",
    nombre: "Consulta",
    descripcion: "Solo lectura de información",
    nivel: "Consulta",
    color: "#10B981",
    permisos: [
      { id: "pm19", modulo: "Presupuestos", accion: "Leer", habilitado: true },
      { id: "pm20", modulo: "Proyectos", accion: "Leer", habilitado: true },
    ],
    usuariosAsignados: 15,
    activo: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-08-12T16:45:00Z",
  },
];

// ============================================
// DATOS MOCK - SERVICIOS
// ============================================

const MOCK_SERVICIOS: Servicio[] = [
  {
    id: "serv1",
    nombre: "Portal de Presupuestos",
    codigo: "AFLOW-PRE",
    descripcion:
      "Sistema completo de gestión de presupuestos con cotizaciones, aprobaciones y seguimiento",
    categoria: "Software",
    tarifas: [
      {
        plan: "Basic",
        precioMensual: 150000,
        precioAnual: 1620000,
        descripcion: "Hasta 50 presupuestos mensuales",
        caracteristicas: [
          "50 presupuestos/mes",
          "2 usuarios",
          "Reportes básicos",
          "Soporte email",
        ],
      },
      {
        plan: "Professional",
        precioMensual: 250000,
        precioAnual: 2700000,
        descripcion: "Hasta 200 presupuestos mensuales",
        caracteristicas: [
          "200 presupuestos/mes",
          "10 usuarios",
          "Reportes avanzados",
          "API integración",
          "Soporte prioritario",
        ],
      },
      {
        plan: "Enterprise",
        precioMensual: 450000,
        precioAnual: 4860000,
        descripcion: "Presupuestos ilimitados",
        caracteristicas: [
          "Presupuestos ilimitados",
          "Usuarios ilimitados",
          "Analytics completo",
          "White label",
          "Soporte 24/7",
        ],
      },
    ],
    activo: true,
    clientesActivos: 45,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2024-11-10T14:00:00Z",
  },
  {
    id: "serv2",
    nombre: "Gestión de Proyectos",
    codigo: "AFLOW-PRJ",
    descripcion:
      "Herramienta de gestión integral de proyectos con Gantt, tareas y recursos",
    categoria: "Software",
    tarifas: [
      {
        plan: "Basic",
        precioMensual: 200000,
        precioAnual: 2160000,
        descripcion: "Hasta 20 proyectos activos",
        caracteristicas: [
          "20 proyectos activos",
          "5 usuarios",
          "Diagrama Gantt básico",
          "Soporte email",
        ],
      },
      {
        plan: "Professional",
        precioMensual: 350000,
        precioAnual: 3780000,
        descripcion: "Hasta 100 proyectos activos",
        caracteristicas: [
          "100 proyectos activos",
          "20 usuarios",
          "Gantt avanzado",
          "Gestión de recursos",
          "Reportes personalizados",
        ],
      },
      {
        plan: "Enterprise",
        precioMensual: 600000,
        precioAnual: 6480000,
        descripcion: "Proyectos ilimitados",
        caracteristicas: [
          "Proyectos ilimitados",
          "Usuarios ilimitados",
          "Dashboard ejecutivo",
          "Integración ERP",
          "Soporte dedicado",
        ],
      },
    ],
    activo: true,
    clientesActivos: 32,
    createdAt: "2023-08-15T10:00:00Z",
    updatedAt: "2024-10-22T11:30:00Z",
  },
  {
    id: "serv3",
    nombre: "Soporte Premium",
    codigo: "AFLOW-SUP",
    descripcion: "Soporte técnico prioritario 24/7 con respuesta garantizada",
    categoria: "Soporte",
    tarifas: [
      {
        plan: "Professional",
        precioMensual: 100000,
        precioAnual: 1080000,
        descripcion: "Soporte horario laboral",
        caracteristicas: [
          "Lun-Vie 9-18hrs",
          "Respuesta <4hrs",
          "Email y teléfono",
          "Tickets ilimitados",
        ],
      },
      {
        plan: "Enterprise",
        precioMensual: 250000,
        precioAnual: 2700000,
        descripcion: "Soporte 24/7",
        caracteristicas: [
          "24/7/365",
          "Respuesta <1hr",
          "Account Manager",
          "Capacitaciones trimestrales",
          "Consultoría incluida",
        ],
      },
    ],
    activo: true,
    clientesActivos: 28,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-09-15T16:00:00Z",
  },
  {
    id: "serv4",
    nombre: "Consultoría Implementación",
    codigo: "AFLOW-CON",
    descripcion: "Servicio de consultoría para implementación y personalización",
    categoria: "Consultoría",
    tarifas: [
      {
        plan: "Basic",
        precioMensual: 500000,
        precioAnual: 5400000,
        descripcion: "20 horas mensuales",
        caracteristicas: [
          "20 hrs/mes",
          "Consultor senior",
          "Implementación básica",
          "Documentación",
        ],
      },
      {
        plan: "Professional",
        precioMensual: 900000,
        precioAnual: 9720000,
        descripcion: "40 horas mensuales",
        caracteristicas: [
          "40 hrs/mes",
          "Equipo consultores",
          "Personalización avanzada",
          "Capacitación equipo",
          "Documentación técnica",
        ],
      },
    ],
    activo: true,
    clientesActivos: 12,
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2024-11-05T13:20:00Z",
  },
];

// ============================================
// DATOS MOCK - OPCIONES DE MENÚ
// ============================================

const MOCK_OPCIONES_MENU: OpcionMenu[] = [
  {
    id: "m1",
    nombre: "Dashboard",
    ruta: "/portal",
    icono: "Home",
    orden: 1,
    visible: true,
    perfilesAsignados: ["p1", "p2", "p3", "p4"],
    esSubmenu: false,
    descripcion: "Panel principal del portal",
    activo: true,
  },
  {
    id: "m2",
    nombre: "Presupuestos",
    ruta: "/portal/presupuesto",
    icono: "Calculator",
    orden: 2,
    visible: true,
    perfilesAsignados: ["p1", "p2", "p3"],
    esSubmenu: false,
    descripcion: "Módulo de gestión de presupuestos",
    activo: true,
  },
  {
    id: "m3",
    nombre: "Consultar",
    ruta: "/portal/presupuesto/consultar",
    icono: "FileText",
    orden: 3,
    visible: true,
    perfilesAsignados: ["p1", "p2", "p3", "p4"],
    moduloPadre: "m2",
    esSubmenu: true,
    descripcion: "Consulta de presupuestos",
    activo: true,
  },
  {
    id: "m4",
    nombre: "Crear",
    ruta: "/portal/presupuesto/crear",
    icono: "PlusCircle",
    orden: 4,
    visible: true,
    perfilesAsignados: ["p1", "p2", "p3"],
    moduloPadre: "m2",
    esSubmenu: true,
    descripcion: "Crear nuevo presupuesto",
    activo: true,
  },
  {
    id: "m5",
    nombre: "Proyectos",
    ruta: "/portal/proyectos",
    icono: "Briefcase",
    orden: 5,
    visible: true,
    perfilesAsignados: ["p1", "p2"],
    esSubmenu: false,
    descripcion: "Gestión de proyectos",
    activo: true,
  },
  {
    id: "m6",
    nombre: "Ajustes",
    ruta: "/portal/ajustes-aflow",
    icono: "Settings",
    orden: 6,
    visible: true,
    perfilesAsignados: ["p1"],
    esSubmenu: false,
    descripcion: "Configuración del sistema",
    activo: true,
  },
];

// ============================================
// DATOS MOCK - DASHBOARD
// ============================================

const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalClientes: 47,
  clientesActivos: 42,
  totalUsuarios: 156,
  usuariosActivos: 138,
  totalServicios: 8,
  serviciosActivos: 7,
  totalPerfiles: 4,
  ingresosRecurrentes: 18500000,
};

const MOCK_ACTIVIDAD_RECIENTE: ActividadReciente[] = [
  {
    id: "a1",
    tipo: "cliente",
    accion: "Creado",
    descripcion: "Nuevo cliente: Transportes del Sur Ltda.",
    usuario: "Admin Sistema",
    fecha: "2024-12-14T15:30:00Z",
  },
  {
    id: "a2",
    tipo: "usuario",
    accion: "Editado",
    descripcion: "Actualizado perfil de María González",
    usuario: "Carlos Muñoz",
    fecha: "2024-12-14T14:15:00Z",
  },
  {
    id: "a3",
    tipo: "servicio",
    accion: "Activado",
    descripcion: "Servicio Consultoría Implementación activado",
    usuario: "Admin Sistema",
    fecha: "2024-12-14T10:00:00Z",
  },
  {
    id: "a4",
    tipo: "perfil",
    accion: "Editado",
    descripcion: "Permisos actualizados para perfil Supervisor",
    usuario: "Admin Sistema",
    fecha: "2024-12-13T16:45:00Z",
  },
  {
    id: "a5",
    tipo: "cliente",
    accion: "Desactivado",
    descripcion: "Cliente Express Cargo desactivado",
    usuario: "Admin Sistema",
    fecha: "2024-12-13T11:20:00Z",
  },
];

// ============================================
// FUNCIONES API - CLIENTES
// ============================================

export async function fetchClientes(): Promise<Cliente[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_CLIENTES]);
    }, 800);
  });
}

export async function fetchClienteById(id: string): Promise<Cliente | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cliente = MOCK_CLIENTES.find((c) => c.id === id);
      resolve(cliente || null);
    }, 600);
  });
}

export async function createCliente(
  input: CreateClienteInput
): Promise<Cliente> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCliente: Cliente = {
        id: `${MOCK_CLIENTES.length + 1}`,
        ...input,
        activo: true,
        sucursales: [],
        usuarios: [],
        serviciosContratados: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_CLIENTES.push(newCliente);
      resolve(newCliente);
    }, 1000);
  });
}

export async function updateCliente(
  id: string,
  input: Partial<CreateClienteInput>
): Promise<Cliente> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cliente = MOCK_CLIENTES.find((c) => c.id === id);
      if (!cliente) {
        reject(new Error("Cliente no encontrado"));
        return;
      }
      Object.assign(cliente, input, { updatedAt: new Date().toISOString() });
      resolve(cliente);
    }, 800);
  });
}

export async function deleteCliente(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_CLIENTES.findIndex((c) => c.id === id);
      if (index > -1) {
        MOCK_CLIENTES.splice(index, 1);
      }
      resolve();
    }, 600);
  });
}

export async function toggleClienteStatus(id: string): Promise<Cliente> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cliente = MOCK_CLIENTES.find((c) => c.id === id);
      if (!cliente) {
        reject(new Error("Cliente no encontrado"));
        return;
      }
      cliente.activo = !cliente.activo;
      cliente.updatedAt = new Date().toISOString();
      resolve(cliente);
    }, 600);
  });
}

// ============================================
// FUNCIONES API - PERFILES
// ============================================

export async function fetchPerfiles(): Promise<Perfil[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_PERFILES]);
    }, 700);
  });
}

export async function createPerfil(input: CreatePerfilInput): Promise<Perfil> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPerfil: Perfil = {
        id: `p${MOCK_PERFILES.length + 1}`,
        ...input,
        color: "#6366F1",
        usuariosAsignados: 0,
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_PERFILES.push(newPerfil);
      resolve(newPerfil);
    }, 900);
  });
}

export async function updatePerfil(
  id: string,
  input: Partial<CreatePerfilInput>
): Promise<Perfil> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const perfil = MOCK_PERFILES.find((p) => p.id === id);
      if (!perfil) {
        reject(new Error("Perfil no encontrado"));
        return;
      }
      Object.assign(perfil, input, { updatedAt: new Date().toISOString() });
      resolve(perfil);
    }, 800);
  });
}

export async function deletePerfil(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_PERFILES.findIndex((p) => p.id === id);
      if (index > -1) {
        MOCK_PERFILES.splice(index, 1);
      }
      resolve();
    }, 600);
  });
}

// ============================================
// FUNCIONES API - SERVICIOS
// ============================================

export async function fetchServicios(): Promise<Servicio[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_SERVICIOS]);
    }, 700);
  });
}

export async function createServicio(
  input: CreateServicioInput
): Promise<Servicio> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newServicio: Servicio = {
        id: `serv${MOCK_SERVICIOS.length + 1}`,
        ...input,
        activo: true,
        clientesActivos: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_SERVICIOS.push(newServicio);
      resolve(newServicio);
    }, 900);
  });
}

export async function updateServicio(
  id: string,
  input: Partial<CreateServicioInput>
): Promise<Servicio> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const servicio = MOCK_SERVICIOS.find((s) => s.id === id);
      if (!servicio) {
        reject(new Error("Servicio no encontrado"));
        return;
      }
      Object.assign(servicio, input, { updatedAt: new Date().toISOString() });
      resolve(servicio);
    }, 800);
  });
}

export async function toggleServicioStatus(id: string): Promise<Servicio> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const servicio = MOCK_SERVICIOS.find((s) => s.id === id);
      if (!servicio) {
        reject(new Error("Servicio no encontrado"));
        return;
      }
      servicio.activo = !servicio.activo;
      servicio.updatedAt = new Date().toISOString();
      resolve(servicio);
    }, 600);
  });
}

// ============================================
// FUNCIONES API - OPCIONES DE MENÚ
// ============================================

export async function fetchOpcionesMenu(): Promise<OpcionMenu[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_OPCIONES_MENU]);
    }, 600);
  });
}

export async function updateOpcionMenu(
  id: string,
  input: Partial<OpcionMenu>
): Promise<OpcionMenu> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const opcion = MOCK_OPCIONES_MENU.find((o) => o.id === id);
      if (!opcion) {
        reject(new Error("Opción de menú no encontrada"));
        return;
      }
      Object.assign(opcion, input);
      resolve(opcion);
    }, 600);
  });
}

// ============================================
// FUNCIONES API - DASHBOARD
// ============================================

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...MOCK_DASHBOARD_STATS });
    }, 800);
  });
}

export async function fetchActividadReciente(): Promise<ActividadReciente[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ACTIVIDAD_RECIENTE]);
    }, 700);
  });
}
