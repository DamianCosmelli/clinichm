//import { useEffect, useState } from "react";
import { EventProps } from "react-big-calendar";
import { EventoRecepcionCalendar } from "../../models/EventoRecepcionCalendar";
import medicoIcon from "../../assets/medico-outline.svg";
import consultaIcon from "../../assets/back-hand-outline.svg";
import medicoGreenIcon from "../../assets/medico-green-outline.svg";
import consultaGreenIcon from "../../assets/back-hand-green-outline.svg";
import demoradoIcon from "../../assets/demora-vector.svg"
import useIsEventExpired from "../../utils/expiredEvent"

interface DetalleMiniCardProps extends EventoRecepcionCalendar {
  view?: string; // 'month', 'week', 'day', 'agenda'
}

interface EventoRecepcionProps extends EventProps<EventoRecepcionCalendar> {
  view?: string;
}

const DetalleMiniCard = (props: DetalleMiniCardProps) => {
  const { ...event } = props;
  const tratamientoHorario = `${event.tratamiento} ${event.start
    .getHours()
    .toString()
    .padStart(2, "0")}:${event.start.getMinutes().toString().padEnd(2, "0")}`;

  return (
    <div
      className="flex flex-col justify-center h-full  px-1.5"
      title={tratamientoHorario}
    >
      <div className="flex flex-row items-center justify-between">
        <span className="text-black font-bold font-poppins text-[12px] leading-[16.8px]">
          {event.paciente}
        </span>
      </div>        
      <span className="truncate max-w-[100px] text-black font-poppins text-[12px] font-medium leading-[16.8px">
         {tratamientoHorario}
        </span>

      <div className="hidden">{event.id}</div>
      <div className="hidden">{event.sucursal}</div>
      <div className="hidden">{event.medico}</div>
      <div className="hidden">{event.piso}</div>
      <div className="hidden">{event.estado}</div>
      <div className="hidden">{event.pacienteDNI}</div>
      <div className="hidden">{event.motivoConsulta}</div>
    </div>
  );
};

const EventoRecepcion: React.FC<EventoRecepcionProps> = ({ event, view }) => {
  const estaVencido = useIsEventExpired(event.horaIngreso);

  const renderMotivo = () => {
    switch (event.esConsulta) {
      case true:
        return (
          <>
            {event.estado == "En Espera" ?
            (<div className="flex justify-center items-center gap-2 bg-[#1F580A] text-[#1F580A]">
              |
            </div>):""}
            <div className="flex justify-center items-center gap-2">
              <img
                src={event.estado == "En Espera" ? consultaGreenIcon :consultaIcon}
                alt="es-consulta"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </>
        );
      case false:
        return (
          <>
            {event.estado == "En Espera" ?
            (<div className="flex justify-center items-center gap-2 bg-[#1F580A] text-[#1F580A]">
              |
            </div>):""}
            <div className="flex justify-center items-center gap-2">
              <img
                src={event.estado == "En Espera" ?  medicoGreenIcon: medicoIcon}
                alt="no-es-consulta"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
        </>
        );
              default:
        return null;
    }
  };

  return(<>
  <div className={`flex gap-0 rounded w-fit max-w-[90%] h-full
    ${
    event.estado === "En Espera" ? "border-[#1F580A] border-2" : "border-black border-1"
  }
  ${
    event.estado == "En Espera" && estaVencido && event.medicoId == 1
     ? "animate-pulse" : ""
  }
  ${
    event.estado === "Finalizado" ? "bg-gray-300" : ""
  }
  `}
  >
    {event.estado == "En Espera" && estaVencido && event.medicoId == 1 ?
    (<img
      src={demoradoIcon}
      alt="demorado"
      className="text-white absolute"
    />):""}
      {renderMotivo()}
  </div>

  </>);

};

export default EventoRecepcion;
