// Mock data for existing clients
export interface Sucursal {
  id: string;
  nombre: string;
  regionId: string;
  ciudadId: string;
  comuna: string;
  calle: string;
  numero: string;
  complemento?: string;
  esPrincipal: boolean;
}

export interface ClienteExistente {
  id: string;
  tipoPersona: 'persona-natural' | 'empresa';
  rut: string;
  // Persona Natural
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  // Empresa
  razonSocial?: string;
  giro?: string;
  // Común
  estado: 'Activo' | 'Inactivo';
  email: string;
  celular: string;
  telefono?: string;
  notas?: string;
  sucursales: Sucursal[];
}

export const clientesExistentes: ClienteExistente[] = [
  {
    id: '1',
    tipoPersona: 'empresa',
    rut: '76.123.456-0',
    razonSocial: 'Constructora Los Andes S.A.',
    giro: 'Construcción y servicios de ingeniería',
    estado: 'Activo',
    email: 'contacto@constructoralosandes.cl',
    celular: '+56 9 8765 4321',
    telefono: '+56 2 2234 5678',
    notas: 'Cliente preferencial con más de 10 años de trayectoria',
    sucursales: [
      {
        id: 's1-1',
        nombre: 'Casa Matriz - Las Condes',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Las Condes',
        calle: 'Av. Apoquindo',
        numero: '4700',
        complemento: 'Piso 12, Of. 1201',
        esPrincipal: true,
      },
      {
        id: 's1-2',
        nombre: 'Sucursal Providencia',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Providencia',
        calle: 'Av. Providencia',
        numero: '1650',
        complemento: 'Piso 3',
        esPrincipal: false,
      },
      {
        id: 's1-3',
        nombre: 'Bodega Quilicura',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Quilicura',
        calle: 'Los Aromos',
        numero: '3200',
        esPrincipal: false,
      },
    ],
  },
  {
    id: '2',
    tipoPersona: 'empresa',
    rut: '78.456.789-K',
    razonSocial: 'Inmobiliaria Central Ltda.',
    giro: 'Compraventa y arriendo de bienes raíces',
    estado: 'Activo',
    email: 'ventas@inmobiliariacentral.cl',
    celular: '+56 9 7654 3210',
    telefono: '+56 2 2345 6789',
    sucursales: [
      {
        id: 's2-1',
        nombre: 'Oficina Principal',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Providencia',
        calle: 'Av. Providencia',
        numero: '2250',
        esPrincipal: true,
      },
      {
        id: 's2-2',
        nombre: 'Sucursal Vitacura',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Vitacura',
        calle: 'Av. Vitacura',
        numero: '5950',
        complemento: 'Local 105',
        esPrincipal: false,
      },
    ],
  },
  {
    id: '3',
    tipoPersona: 'empresa',
    rut: '99.876.543-K',
    razonSocial: 'Servicios Industriales del Sur SpA',
    giro: 'Mantención industrial y servicios técnicos',
    estado: 'Activo',
    email: 'operaciones@sisdelsur.cl',
    celular: '+56 9 6543 2109',
    sucursales: [
      {
        id: 's3-1',
        nombre: 'Planta Principal Rancagua',
        regionId: '8',
        ciudadId: '801',
        comuna: 'Rancagua',
        calle: 'Camino La Compañía',
        numero: '8900',
        complemento: 'Parcela 15',
        esPrincipal: true,
      },
      {
        id: 's3-2',
        nombre: 'Oficina Comercial Santiago',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Santiago',
        calle: 'Moneda',
        numero: '970',
        complemento: 'Piso 5',
        esPrincipal: false,
      },
    ],
  },
  {
    id: '4',
    tipoPersona: 'empresa',
    rut: '85.234.567-K',
    razonSocial: 'Tecnología y Desarrollo Ltda.',
    giro: 'Desarrollo de software y consultoría TI',
    estado: 'Activo',
    email: 'info@tecnodesarrollo.cl',
    celular: '+56 9 5432 1098',
    telefono: '+56 2 2456 7890',
    sucursales: [
      {
        id: 's4-1',
        nombre: 'Casa Matriz',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Santiago',
        calle: 'Huérfanos',
        numero: '1160',
        complemento: 'Piso 8',
        esPrincipal: true,
      },
    ],
  },
  {
    id: '5',
    tipoPersona: 'empresa',
    rut: '81.345.678-4',
    razonSocial: 'Comercial del Pacífico S.A.',
    giro: 'Importación y distribución de productos',
    estado: 'Activo',
    email: 'comercial@pacifico.cl',
    celular: '+56 9 4321 0987',
    sucursales: [
      {
        id: 's5-1',
        nombre: 'Centro de Distribución',
        regionId: '5',
        ciudadId: '501',
        comuna: 'La Serena',
        calle: 'Av. Francisco de Aguirre',
        numero: '0255',
        esPrincipal: true,
      },
      {
        id: 's5-2',
        nombre: 'Sucursal Coquimbo',
        regionId: '5',
        ciudadId: '501',
        comuna: 'Coquimbo',
        calle: 'Av. Costanera',
        numero: '1800',
        esPrincipal: false,
      },
    ],
  },
  {
    id: '6',
    tipoPersona: 'persona-natural',
    rut: '16.789.456-K',
    primerNombre: 'Juan',
    segundoNombre: 'Carlos',
    apellidoPaterno: 'González',
    apellidoMaterno: 'Martínez',
    estado: 'Activo',
    email: 'juan.gonzalez@gmail.com',
    celular: '+56 9 3210 9876',
    notas: 'Cliente frecuente de proyectos de remodelación',
    sucursales: [
      {
        id: 's6-1',
        nombre: 'Domicilio Particular',
        regionId: '7',
        ciudadId: '701',
        comuna: 'Ñuñoa',
        calle: 'Av. Irarrázaval',
        numero: '4567',
        complemento: 'Depto. 302',
        esPrincipal: true,
      },
    ],
  },
];

// Search function
export function buscarClientes(query: string): ClienteExistente[] {
  if (!query || query.length < 2) {
    return clientesExistentes;
  }

  const searchTerm = query.toLowerCase();
  return clientesExistentes.filter(
    (cliente) => {
      const rutMatch = cliente.rut.includes(searchTerm);
      const emailMatch = cliente.email.toLowerCase().includes(searchTerm);
      
      // For persona natural, search by name
      if (cliente.tipoPersona === 'persona-natural') {
        const nombreCompleto = `${cliente.primerNombre || ''} ${cliente.segundoNombre || ''} ${cliente.apellidoPaterno || ''} ${cliente.apellidoMaterno || ''}`.toLowerCase();
        const nombreMatch = nombreCompleto.includes(searchTerm);
        return rutMatch || emailMatch || nombreMatch;
      }
      
      // For empresa, search by razon social
      const razonSocialMatch = cliente.razonSocial?.toLowerCase().includes(searchTerm) || false;
      return razonSocialMatch || rutMatch || emailMatch;
    }
  );
}
