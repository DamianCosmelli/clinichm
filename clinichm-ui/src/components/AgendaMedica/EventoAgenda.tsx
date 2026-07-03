import { EventoAgendaCalendar } from "../../models/EventoAgendaCalendar";

import { EventProps } from "react-big-calendar";


interface DetalleMiniCardProps extends EventoAgendaCalendar {
  view?: string; // 'month', 'week', 'day', 'agenda'
}

interface EventoAgendaProps extends EventProps<EventoAgendaCalendar> {
  view?: string;
}

const DetalleMiniCard = (props: DetalleMiniCardProps) => {
  const { view, ...event } = props;
  const horario =`De ${event.start.getHours().toString().padStart(2, "0")} a ${event.fechaFin.substring(11, 13)} hs`;
 
  return (
    <div className="flex flex-col justify-center h-full w-full px-1.5 py-1" title={horario}>
    <span className="text-black font-bold font-poppins text-[12px] leading-[16.8px]">{event.medico}</span>
    {view === 'month' && (
    <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">{horario}</span>
    )}
      <div className="hidden">{event.id}</div>
          <div className="hidden">{event.sucursal}</div>
          <div className="hidden">{event.medico}</div>
          <div className="hidden">{event.fechaInicio}</div>
          <div className="hidden">{event.fechaFin}</div>               
  </div>
  );
}

const EventoAgenda: React.FC<EventoAgendaProps> = ({ event, view }) => {

        return (
          <div className="flex h-full w-full bg-[#D0E5EE] rounded-r overflow-hidden border-white border-1">
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      
  };

export default EventoAgenda;
