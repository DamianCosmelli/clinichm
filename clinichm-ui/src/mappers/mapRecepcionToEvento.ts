import { EventoRecepcionCalendar } from "../models/EventoRecepcionCalendar";
import { RecepcionCalendar } from "../models/RecepcionCalendar";


export const mapRecepcionToEvento = async (recepcion: RecepcionCalendar): Promise<EventoRecepcionCalendar> => {
    // Convertir la fecha y hora a un objeto Date
    const start = new Date(recepcion.horaIngreso);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // suma 30 min a la hora de inicio

  const pisoRegis: string = recepcion.piso == 1
  ? "Piso 1"
  : "Piso 2" ;

     const motivo: string = recepcion.esConsulta
    ? "Consulta"
    : recepcion.esRetoque
    ? "Retoque"
    : recepcion.motivoConsulta
    ? recepcion.motivoConsulta : ""
    ;
       
    return {
      id: recepcion.id,
      medico: recepcion.medicoNombre,
      medicoId: recepcion.medicoId,
      sucursal: recepcion.sucursal,
      sucursalId:recepcion.sucursalId,
      piso: pisoRegis,
      pisoNumero:recepcion.piso,
      tratamiento: recepcion.tratamientoNombre,
      tratamientoId:recepcion.tratamientoId,
      paciente:recepcion.pacienteNombre,
      pacienteId:recepcion.pacienteId,
      pacienteDNI:recepcion.pacienteDNI,
      pacienteCelular:recepcion.pacienteCelular,
      pacienteMail:recepcion.pacienteMail,
      horaIngreso: recepcion.horaIngreso,
      horaAnestesia: recepcion.horaAnestesia,
      estado:recepcion.estadoRecepcion,
      motivoConsulta: motivo,
      esConsulta: recepcion.esConsulta,
      esRetoque:recepcion.esRetoque,
      start,
      end
    };
  };
