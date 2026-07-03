import { AgendaCalendar } from "../models/AgendaCalendar";
import { EventoAgendaCalendar } from "../models/EventoAgendaCalendar";


export const mapAgendaToEvento = async (agenda: AgendaCalendar): Promise<EventoAgendaCalendar> => {
    // Convertir la fecha y hora a un objeto Date
    const start = new Date(agenda.fechaInicio);
    //const end = new Date(start.getTime() + 30 * 60 * 1000); // suma 30 min a la hora de inicio
    const end = new Date(agenda.fechaFin);
       
    return {
      id: agenda.id,
      medico: agenda.medicoNombre, 
      sucursal:agenda.sucursalNombre, 
      start,
      end,
      fechaInicio: agenda.fechaInicio,
      fechaFin: agenda.fechaFin,
      

    };
  };
