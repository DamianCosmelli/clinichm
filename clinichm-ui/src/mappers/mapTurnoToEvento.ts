import { TurnoCalendar } from "../models/TurnoCalendar";
import { EventoCalendar } from "../models/EventoCalendar";



export const mapTurnoToEvento = async (turno: TurnoCalendar): Promise<EventoCalendar> => {
    // Convertir la fecha y hora a un objeto Date
    const start = new Date(turno.fechaHora);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // suma 30 min a la hora de inicio

    // Mapea otrosTurnos si existen
    const otrosTurnos = turno.turnosDuplicados
    ? [...turno.turnosDuplicados
    ] : undefined;


    
    //TODO: Agregar nuevos estados cancelado, No encontrado Cuendo este en BACKEND
    const estado: string = turno.confirmado
    ? "Confirmado"
    : turno.reprogramado
    ? "Reprogramado"
    : turno.cancelado
    ? "Cancelado"
    : turno.noEncontrado
    ? "Numero No Encontrado"
    : "Sin Confirmar";
    
    return {
      id: turno.id,
      paciente: turno.pacienteNombre, 
      paciciente_telefono: turno.pacienteCelular, 
      paciente_email: turno.pacienteEmail, 
      medico: turno.medicoNombre, 
      tratamiento: turno.tratamientoNombre, 
      estado,
      sucursal: turno.sucursalNombre,
      start,
      end,
      otrosTurnos,
      asistio: turno.asistio,

    };
  };
