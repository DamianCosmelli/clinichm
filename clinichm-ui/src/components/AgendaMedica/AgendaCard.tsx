import { EventoAgendaCalendar } from "../../models/EventoAgendaCalendar";
//import IconoComentario from '../../assets/IconoComentario.svg';
//import iconoEliminar from '../../assets/iconoEliminar.svg';
import iconoEditar from "../../assets/iconoEditar.svg";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import { useNavigate } from "react-router-dom";

interface AgendaCardProps {
  agenda: EventoAgendaCalendar; // Usar el modelo EventoCalendar
  onClose: () => void;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ agenda, onClose }) => {
  const navigate = useNavigate();

  const handleEditar = () => {
    navigate(`/editar-agenda`, {
      state: {
        id: agenda.id,
      },
    });
  };
  return (
    <div className="card-agenda relative">
      <div className="absolute top-6 right-2 flex gap-2 items-center">
        {/*<img
          src={iconoEliminar}
          alt="Eliminar"
          className="iconSize cursor-pointer"
        />*/
        /** SE comenta por no contar aun con la funcion de eliminar y Editar */}
        <img
          src={iconoEditar}
          alt="Editar"
          className="iconSize cursor-pointer"
          onClick={handleEditar}
        />
        <img
          src={iconoCerrar}
          alt="Cerrar"
          className="iconSize cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="w-full flex flex-col gap-2 mt-8">
        <div className="tipografiaCardsConfirmacion">{`${agenda.medico}`}</div>
        <div
          className="tipografiaCardsConfirmacionSmall"
          style={{ fontSize: "16px" }}
        >
          {agenda.sucursal}
        </div>
      </div>
      <div className="w-full flex items-center justify-between tipografiaCardsConfirmacionSmall">
        <div className="flex items-center gap-2">
          <span>
            {new Date(agenda.start).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </span>
          <span>
            {new Date(agenda.start).toLocaleTimeString().substring(0, 0)}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          <span className="tipografiaCardsConfirmacionSmall">Horario:</span>
          <span
            className="tipografiaCardsConfirmacion"
            style={{ fontSize: "14px" }}
          >
            {`${agenda.fechaInicio.substring(
              11,
              16
            )} a ${agenda.fechaFin.substring(11, 16)} hs`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgendaCard;
