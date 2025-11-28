export interface Lead {
  id: number;
  codigoLanzamiento: string;
  nombre: string;
  asesor: string;
  estado: string;
  origen: string;
  pais: string;
  fechaFormulario: string;
  correo?: string; // Opcional para compatibilidad con datos antiguos
}

export const leadsData: Lead[] = [
  {
    id: 9675345,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Edson Mayta Escobedo',
    asesor: 'Fernando',
    estado: 'Calificado',
    origen: 'Whatsapp',
    pais: 'Perú',
    fechaFormulario: '24 de setiembre de 2025'
  },
  {
    id: 9675346,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'María González Pérez',
    asesor: 'Fernando',
    estado: 'Calificado',
    origen: 'Instagram',
    pais: 'Perú',
    fechaFormulario: '23 de setiembre de 2025'
  },
  {
    id: 9675347,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Carlos Ramírez Torres',
    asesor: 'Fernando',
    estado: 'Calificado',
    origen: 'SMS',
    pais: 'Perú',
    fechaFormulario: '24 de setiembre de 2025'
  },
  {
    id: 9675348,
    codigoLanzamiento: 'RH 25 07',
    nombre: 'Ana Martínez López',
    asesor: 'Fernando',
    estado: 'Calificado',
    origen: 'Whatsapp',
    pais: 'Perú',
    fechaFormulario: '22 de setiembre de 2025'
  },
  {
    id: 9675349,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Luis Fernández Sánchez',
    asesor: 'Fernando',
    estado: 'Calificado',
    origen: 'Whatsapp',
    pais: 'Perú',
    fechaFormulario: '24 de setiembre de 2025'
  },
  {
    id: 9675350,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Edson Mayta Escobedo',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Linkedin',
    pais: 'Perú',
    fechaFormulario: '20 de setiembre de 2025'
  },
  {
    id: 9675351,
    codigoLanzamiento: 'RH 25 07',
    nombre: 'Patricia Morales Díaz',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Whatsapp',
    pais: 'Perú',
    fechaFormulario: '21 de setiembre de 2025'
  },
  {
    id: 9675352,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Roberto Silva Vega',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Instagram',
    pais: 'Perú',
    fechaFormulario: '19 de setiembre de 2025'
  },
  {
    id: 9675353,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Carmen Herrera Ruiz',
    asesor: 'Sin asesor',
    estado: 'Cliente',
    origen: 'Telefono',
    pais: 'Perú',
    fechaFormulario: '18 de setiembre de 2025'
  },
  {
    id: 9675354,
    codigoLanzamiento: 'RH 25 07',
    nombre: 'Jorge Mendoza Castro',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'SMS',
    pais: 'Perú',
    fechaFormulario: '24 de setiembre de 2025'
  },
  {
    id: 9675355,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Sofía Vargas Ríos',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Whatsapp',
    pais: 'Perú',
    fechaFormulario: '17 de setiembre de 2025'
  },
  {
    id: 9675356,
    codigoLanzamiento: 'RH 25 07',
    nombre: 'Diego Campos Flores',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Instagram',
    pais: 'Perú',
    fechaFormulario: '16 de setiembre de 2025'
  },
  {
    id: 9675357,
    codigoLanzamiento: 'RH 25 06',
    nombre: 'Laura Jiménez Paredes',
    asesor: 'Fernando',
    estado: 'Cliente',
    origen: 'Telefono',
    pais: 'Perú',
    fechaFormulario: '15 de setiembre de 2025'
  }
];

