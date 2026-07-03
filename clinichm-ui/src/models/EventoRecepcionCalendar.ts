import { Event as RBCEvent  } from "react-big-calendar";

export  interface EventoRecepcionCalendar extends RBCEvent {
    id: number;
    medico: string;
    medicoId: number;
    sucursal: string;
    sucursalId:number;
    tratamiento: string;
    tratamientoId:number;
    paciente:string;
    pacienteId:number;
    pacienteDNI:string;
    pacienteCelular:string;
    pacienteMail:string;
    horaIngreso: string;
    horaAnestesia?: string;
    motivoConsulta:string;
    esConsulta: boolean;
    esRetoque: boolean;
    estado: string,
    piso: string;
    pisoNumero:number,
    start: Date;
    end: Date;
}