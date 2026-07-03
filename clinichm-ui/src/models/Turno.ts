export interface Turno {
  id?: number;
  fechaHora: string;
  medicoId: number;
  medicoNombre?: string; 
  sucursalId: number;
  sucursalNombre?: string; 
  pacienteId: number;
  pacienteNombre?: string; 
  pacienteCelular?: string; 
  pacienteEmail?: string; 
  tratamientoId: number;
  tratamientoNombre?: string; 
  usuarioRegistroId: number;
  confirmado?: boolean;
  fechaHoraConfirmacion?: string;
  reprogramado?: boolean;
  nuevoTurnoId?: number;
  asistio?: boolean;
  cancelado?: boolean;
  noEncontrado?: boolean;
  turnosDuplicados?: Array<{
    id: number;
    fecha: string;
    tratamientoId: number;
    medicoId: number;
  }>;
}