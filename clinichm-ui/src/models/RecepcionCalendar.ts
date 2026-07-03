export interface RecepcionCalendar {
  id: number;
  pacienteId: number;
  pacienteNombre:string;
  pacienteDNI:string;
  pacienteCelular:string;
  pacienteMail:string;
  tratamientoId: number;
  tratamientoNombre: string;
  medicoId: number;
  medicoNombre:string;
  sucursalId: number; // Nueva propiedad
  sucursal:string;
  horaIngreso: string; // ISO 8601 format
  piso: number;
  estadoRecepcion: string;
  motivoConsulta: string;
  horaAnestesia?: string; // ISO 8601 format
  esConsulta: boolean;
  esRetoque: boolean;
}
