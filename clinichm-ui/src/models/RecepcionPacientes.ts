export interface RecepcionPacientes {
  id: number;
  pacienteId: number;
  tratamientoId: number;
  medicoId: number;
  sucursalId: number; // Nueva propiedad
  horaIngreso: string; // ISO 8601 format
  piso: string;
  estadoRecepcion: string;
  motivoConsulta: string;
  horaAnestesia?: string; // ISO 8601 format
  esConsulta: boolean;
  esRetoque: boolean;
  medicoNombre?: string; // Propiedad agregada
  tratamientoNombre?: string; // Propiedad agregada
}
