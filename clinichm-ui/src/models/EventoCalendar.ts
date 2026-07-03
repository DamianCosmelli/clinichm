import { Event as RBCEvent  } from "react-big-calendar";

export interface TurnoDuplicado {
    id: number;
    fecha: string; // ISO string, ejemplo: "2025-05-19T12:27:56.056Z"
  }

export  interface EventoCalendar extends RBCEvent {
    id: number;
    paciente: string;
    paciciente_telefono: string;
    paciente_email: string;
    medico: string;
    tratamiento: string;
    sucursal: string;
    estado: string;
    start: Date;
    end: Date;
    otrosTurnos?: TurnoDuplicado[];
    asistio?: boolean;
}