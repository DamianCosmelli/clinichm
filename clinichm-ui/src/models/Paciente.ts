export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  celular: string;
  dni: string;
  email?: string;
  direccion?: string;
  codigoPostal?: string;
  medioPublicidad?: string; // Medio de publicidad
  fechaNac?: string | null; // Fecha de nacimiento en formato ISO
  soloConsulto?: boolean; // Indica si el paciente solo consultó
  horaIngreso?: string; // Fecha y hora de la última visita en formato ISO
}