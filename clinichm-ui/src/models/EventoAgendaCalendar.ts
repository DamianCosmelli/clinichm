import { Event as RBCEvent  } from "react-big-calendar";

export  interface EventoAgendaCalendar extends RBCEvent {
    id: number;
    medico: string;
    sucursal: string;
    fechaInicio: string;
    fechaFin: string;
    start: Date;
    end: Date;
}