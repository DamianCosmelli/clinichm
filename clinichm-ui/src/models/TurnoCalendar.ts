export interface TurnoDuplicado {
  id: number;
  fecha: string; // ISO string, ejemplo: "2025-05-19T12:27:56.056Z"
}

export interface TurnoCalendar {
  id: number;
  fechaHora: string;
  medicoId: number;
  sucursalId: number;
  pacienteId: number;
  tratamientoId: number;
  usuarioRegistroId: number;
  confirmado?: boolean;
  fechaHoraConfirmacion?: string;
  reprogramado?: boolean;
  nuevoTurnoId?: number;
  asistio: boolean;
  cancelado: boolean;
  noEncontrado: boolean;
  turnosDuplicados?: TurnoDuplicado[];
  medicoNombre: string;
  sucursalNombre: string;
  pacienteNombre: string;
  pacienteCelular: string;
  pacienteEmail: string;
  tratamientoNombre: string;
}