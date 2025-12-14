// Chilean regional data: Regiones, Ciudades, Comunas
export interface Region {
  id: number;
  nombre: string;
  ciudades: Ciudad[];
}

export interface Ciudad {
  id: number;
  nombre: string;
  comunas: string[];
}

export const regionesChile: Region[] = [
  {
    id: 1,
    nombre: 'Región de Arica y Parinacota',
    ciudades: [
      {
        id: 101,
        nombre: 'Arica',
        comunas: ['Arica', 'Camarones']
      },
      {
        id: 102,
        nombre: 'Parinacota',
        comunas: ['Putre', 'General Lagos']
      }
    ]
  },
  {
    id: 2,
    nombre: 'Región de Tarapacá',
    ciudades: [
      {
        id: 201,
        nombre: 'Iquique',
        comunas: ['Iquique', 'Alto Hospicio']
      },
      {
        id: 202,
        nombre: 'Tamarugal',
        comunas: ['Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica']
      }
    ]
  },
  {
    id: 3,
    nombre: 'Región de Antofagasta',
    ciudades: [
      {
        id: 301,
        nombre: 'Antofagasta',
        comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal']
      },
      {
        id: 302,
        nombre: 'El Loa',
        comunas: ['Calama', 'Ollagüe', 'San Pedro de Atacama']
      },
      {
        id: 303,
        nombre: 'Tocopilla',
        comunas: ['Tocopilla', 'María Elena']
      }
    ]
  },
  {
    id: 4,
    nombre: 'Región de Atacama',
    ciudades: [
      {
        id: 401,
        nombre: 'Copiapó',
        comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla']
      },
      {
        id: 402,
        nombre: 'Chañaral',
        comunas: ['Chañaral', 'Diego de Almagro']
      },
      {
        id: 403,
        nombre: 'Huasco',
        comunas: ['Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco']
      }
    ]
  },
  {
    id: 5,
    nombre: 'Región de Coquimbo',
    ciudades: [
      {
        id: 501,
        nombre: 'Elqui',
        comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña']
      },
      {
        id: 502,
        nombre: 'Choapa',
        comunas: ['Illapel', 'Canela', 'Los Vilos', 'Salamanca']
      },
      {
        id: 503,
        nombre: 'Limarí',
        comunas: ['Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado']
      }
    ]
  },
  {
    id: 6,
    nombre: 'Región de Valparaíso',
    ciudades: [
      {
        id: 601,
        nombre: 'Valparaíso',
        comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar']
      },
      {
        id: 602,
        nombre: 'Isla de Pascua',
        comunas: ['Isla de Pascua']
      },
      {
        id: 603,
        nombre: 'Los Andes',
        comunas: ['Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban']
      },
      {
        id: 604,
        nombre: 'Petorca',
        comunas: ['La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar']
      },
      {
        id: 605,
        nombre: 'Quillota',
        comunas: ['Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales']
      },
      {
        id: 606,
        nombre: 'San Antonio',
        comunas: ['San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo']
      },
      {
        id: 607,
        nombre: 'San Felipe de Aconcagua',
        comunas: ['San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María']
      },
      {
        id: 608,
        nombre: 'Marga Marga',
        comunas: ['Quilpué', 'Limache', 'Olmué', 'Villa Alemana']
      }
    ]
  },
  {
    id: 7,
    nombre: 'Región Metropolitana de Santiago',
    ciudades: [
      {
        id: 701,
        nombre: 'Santiago',
        comunas: [
          'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
          'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
          'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
          'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
          'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal',
          'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón',
          'Santiago', 'Vitacura'
        ]
      },
      {
        id: 702,
        nombre: 'Cordillera',
        comunas: ['Puente Alto', 'Pirque', 'San José de Maipo']
      },
      {
        id: 703,
        nombre: 'Chacabuco',
        comunas: ['Colina', 'Lampa', 'Tiltil']
      },
      {
        id: 704,
        nombre: 'Maipo',
        comunas: ['San Bernardo', 'Buin', 'Calera de Tango', 'Paine']
      },
      {
        id: 705,
        nombre: 'Melipilla',
        comunas: ['Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro']
      },
      {
        id: 706,
        nombre: 'Talagante',
        comunas: ['Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
      }
    ]
  },
  {
    id: 8,
    nombre: 'Región del Libertador General Bernardo O\'Higgins',
    ciudades: [
      {
        id: 801,
        nombre: 'Cachapoal',
        comunas: [
          'Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue',
          'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal',
          'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo',
          'Requínoa', 'San Vicente'
        ]
      },
      {
        id: 802,
        nombre: 'Cardenal Caro',
        comunas: ['Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones']
      },
      {
        id: 803,
        nombre: 'Colchagua',
        comunas: [
          'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua',
          'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'
        ]
      }
    ]
  },
  {
    id: 9,
    nombre: 'Región del Maule',
    ciudades: [
      {
        id: 901,
        nombre: 'Talca',
        comunas: [
          'Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule',
          'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael'
        ]
      },
      {
        id: 902,
        nombre: 'Cauquenes',
        comunas: ['Cauquenes', 'Chanco', 'Pelluhue']
      },
      {
        id: 903,
        nombre: 'Curicó',
        comunas: [
          'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco',
          'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén'
        ]
      },
      {
        id: 904,
        nombre: 'Linares',
        comunas: ['Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas']
      }
    ]
  },
  {
    id: 10,
    nombre: 'Región de Ñuble',
    ciudades: [
      {
        id: 1001,
        nombre: 'Diguillín',
        comunas: ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay']
      },
      {
        id: 1002,
        nombre: 'Itata',
        comunas: ['Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ranquil', 'Treguaco']
      },
      {
        id: 1003,
        nombre: 'Punilla',
        comunas: ['San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás']
      }
    ]
  },
  {
    id: 11,
    nombre: 'Región del Biobío',
    ciudades: [
      {
        id: 1101,
        nombre: 'Concepción',
        comunas: [
          'Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui',
          'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé'
        ]
      },
      {
        id: 1102,
        nombre: 'Arauco',
        comunas: ['Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa']
      },
      {
        id: 1103,
        nombre: 'Biobío',
        comunas: [
          'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén',
          'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo',
          'Santa Bárbara', 'Tucapel', 'Yumbel'
        ]
      }
    ]
  },
  {
    id: 12,
    nombre: 'Región de La Araucanía',
    ciudades: [
      {
        id: 1201,
        nombre: 'Cautín',
        comunas: [
          'Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire',
          'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco',
          'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón',
          'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica'
        ]
      },
      {
        id: 1202,
        nombre: 'Malleco',
        comunas: [
          'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay',
          'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'
        ]
      }
    ]
  },
  {
    id: 13,
    nombre: 'Región de Los Ríos',
    ciudades: [
      {
        id: 1301,
        nombre: 'Valdivia',
        comunas: [
          'Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil',
          'Mariquina', 'Paillaco', 'Panguipulli'
        ]
      },
      {
        id: 1302,
        nombre: 'Ranco',
        comunas: ['La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno']
      }
    ]
  },
  {
    id: 14,
    nombre: 'Región de Los Lagos',
    ciudades: [
      {
        id: 1401,
        nombre: 'Llanquihue',
        comunas: [
          'Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar',
          'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas'
        ]
      },
      {
        id: 1402,
        nombre: 'Chiloé',
        comunas: [
          'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue',
          'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao'
        ]
      },
      {
        id: 1403,
        nombre: 'Osorno',
        comunas: [
          'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo'
        ]
      },
      {
        id: 1404,
        nombre: 'Palena',
        comunas: ['Chaitén', 'Futaleufú', 'Hualaihué', 'Palena']
      }
    ]
  },
  {
    id: 15,
    nombre: 'Región Aysén del General Carlos Ibáñez del Campo',
    ciudades: [
      {
        id: 1501,
        nombre: 'Coyhaique',
        comunas: ['Coyhaique', 'Lago Verde']
      },
      {
        id: 1502,
        nombre: 'Aysén',
        comunas: ['Aysén', 'Cisnes', 'Guaitecas']
      },
      {
        id: 1503,
        nombre: 'Capitán Prat',
        comunas: ['Cochrane', 'O\'Higgins', 'Tortel']
      },
      {
        id: 1504,
        nombre: 'General Carrera',
        comunas: ['Chile Chico', 'Río Ibáñez']
      }
    ]
  },
  {
    id: 16,
    nombre: 'Región de Magallanes y de la Antártica Chilena',
    ciudades: [
      {
        id: 1601,
        nombre: 'Magallanes',
        comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio']
      },
      {
        id: 1602,
        nombre: 'Antártica Chilena',
        comunas: ['Cabo de Hornos', 'Antártica']
      },
      {
        id: 1603,
        nombre: 'Tierra del Fuego',
        comunas: ['Porvenir', 'Primavera', 'Timaukel']
      },
      {
        id: 1604,
        nombre: 'Última Esperanza',
        comunas: ['Natales', 'Torres del Paine']
      }
    ]
  }
];

// Helper functions
export function getCiudadesByRegionId(regionId: number): Ciudad[] {
  const region = regionesChile.find(r => r.id === regionId);
  return region?.ciudades || [];
}

export function getComunasByCiudadId(regionId: number, ciudadId: number): string[] {
  const region = regionesChile.find(r => r.id === regionId);
  const ciudad = region?.ciudades.find(c => c.id === ciudadId);
  return ciudad?.comunas || [];
}
