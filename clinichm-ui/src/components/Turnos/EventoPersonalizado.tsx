import { EventoCalendar } from "../../models/EventoCalendar";

import { EventProps } from "react-big-calendar";

import iconoCheck from "../../assets/iconoCheck.svg";
import iconoInfo from "../../assets/iconoInfo.svg";
import iconoInterrogacion from "../../assets/SignoInterrogacion.svg";
import iconoReprogramacion from "../../assets/Group.svg";
import iconoCancelado from "../../assets/close-rounded.svg";
import iconoNoEncontrado from "../../assets/call-outline.svg";
import iconoOtrosTurnos from "../../assets/Ellipse2.svg";

interface DetalleMiniCardProps extends EventoCalendar {
  view?: string; // 'month', 'week', 'day', 'agenda'
}

interface EventoPersonalizadoProps extends EventProps<EventoCalendar> {
  view?: string;
}

const DetalleMiniCard = (props: DetalleMiniCardProps) => {
  const { view, ...event } = props;
  const tratamientoHora = `${event.tratamiento} ${event.start
    .getHours()
    .toString()
    .padStart(2, "0")}:${event.start.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div
      className="flex flex-col justify-center rounded-r bg-[#D0E5EE] px-1.5 py-1"
      title={tratamientoHora}
    >
      <div className="flex flex-row items-center justify-between">
        <span className="text-black font-bold font-poppins text-[12px] leading-[16.8px]">
          {event.paciente}
        </span>
        {event.otrosTurnos && event.otrosTurnos.length > 0 && (
        <img src={iconoOtrosTurnos} alt="otros-turnos" className="w-4 h-4 ml-2" />
        )}
      </div>

      {view === "month" && (
        <span className="truncate max-w-[100px] text-black font-poppins text-[12px] font-medium leading-[16.8px] ">
          {tratamientoHora}
        </span>
      )}
      <div className="hidden">{event.id}</div>
      <div className="hidden">{event.sucursal}</div>
      <div className="hidden">{event.medico}</div>
      <div className="hidden">{event.estado}</div>
      <div className="hidden">
        {event.otrosTurnos?.map((turno, index) => (
          <div key={index}>{JSON.stringify(turno)}</div>
        ))}
      </div>
    </div>
  );
};

const EventoPersonalizado: React.FC<EventoPersonalizadoProps> = ({
  event,
  view,
}) => {
  const renderEstado = () => {
    switch (event.estado.toLowerCase()) {
      case "confirmado":
        return (
          <div className="flex gap-0  border-white h-full" key="confirmado">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#1F580A]">
              <img
                src={iconoCheck}
                alt="Signo de check"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      case "cambio agenda":
        return (
          <div className="flex items-center gap-0" key="cambio-agenda">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#E9CE04] w-6 h-6">
              <img
                src={iconoInfo}
                alt="Signo de información"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      case "sin confirmar":
        return (
          <div className="flex gap-0 border-white" key="sin-confirmar">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#117BA8] w-6 ">
              <img
                src={iconoInterrogacion}
                alt="Signo de interrogación"
                className="text-white "
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      case "reprogramado":
        return (
          <div className="flex gap-0 border-white" key="reprogramado">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#1611A8] w-6">
              <img
                src={iconoReprogramacion}
                alt="Reprogramado"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      case "cancelado":
        return (
          <div className="flex gap-0 border-white" key="cancelado">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#480A58] w-6">
              <img
                src={iconoCancelado}
                alt="Cancelado"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      case "numero no encontrado":
        return (
          <div className="flex gap-0 border-white" key="no-encontrado">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#D31F8B] w-6">
              <img
                src={iconoNoEncontrado}
                alt="No encontrado"
                className="text-white"
              />
            </div>
            <DetalleMiniCard {...event} view={view} />
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderEstado()}</>;
};
export default EventoPersonalizado;
