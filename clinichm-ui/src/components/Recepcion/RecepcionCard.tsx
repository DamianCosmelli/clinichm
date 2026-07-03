import SelectEstadosRecepcion from "../common/SelectEstadosRecepcion";
import iconoTelefono from "../../assets/iconoTelefono.svg";
import iconoMail from "../../assets/iconoMail.svg";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import iconoEditar from "../../assets/iconoEditar.svg";
import { useNavigate } from "react-router-dom";
import { EventoRecepcionCalendar } from "../../models/EventoRecepcionCalendar";
import medicoIcon from "../../assets/medico-outline.svg";
import consultaIcon from "../../assets/back-hand-outline.svg";
import medicoGreenIcon from "../../assets/medico-green-outline.svg";
import consultaGreenIcon from "../../assets/back-hand-green-outline.svg";
import useIsEventExpired from "../../utils/expiredEvent"
import { useCambiarEstado } from "../../hooks/UseCambiarEstadoRecepcion";
import RecepcionEditModal from "./RecepcionEditModal";
import { useState } from "react";

interface RecepcionCardProps {
  recepcion: EventoRecepcionCalendar
  onClose: () => void;
}

const RecepcionCard: React.FC<RecepcionCardProps> = ({ recepcion, onClose }) => {
  const estaVencido = useIsEventExpired(recepcion.horaIngreso);
  const [showRecepcionEditModal, setShowRecepcionEditModal] = useState(false);

  const renderMotivo = () => {
    switch (recepcion.esConsulta) {
      case true:
        return (
          <div className="flex items-center gap-0">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#005B4B33] w-6 h-6">
              <img
                src={recepcion.estado == "En Espera" ? consultaGreenIcon :consultaIcon}
                alt="es-consulta"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#005B4B33]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                {recepcion.motivoConsulta}
              </span>
            </div>
          </div>
        );
           case false:
        return (
          <div className="flex items-center gap-0">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#005B4B33] w-6 h-6">
              <img
                src={recepcion.estado == "En Espera" ? medicoGreenIcon: medicoIcon}
                alt="no-es-consulta"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#005B4B33]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                {recepcion.motivoConsulta}
              </span>
            </div>
          </div>
        );
        
        default:
        return null;
    }
  };


  const navigate = useNavigate();
  const handleEditar = () => {
    setShowRecepcionEditModal(true)
  };

    // Cambia el estado del turno
    // y cierra el modal
  
    const { cambiarEstado } = useCambiarEstado();
    const handleEstado = async (nuevoEstado: string) => {
      const exito = await cambiarEstado(nuevoEstado, recepcion.id);
  
      if (exito) {
        onClose();
        navigate(0); // Recargar la página
      } else {
        console.error("No se pudo cambiar el estado");
      }
    };

  return (
    <div className="card-estilo relative">
      <div className="absolute top-6 right-2 flex gap-2 items-center">
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
        <div className="tipografiaCardsConfirmacion">{`${recepcion.paciente}`}</div>
        <div className="tipografiaCardsConfirmacionSmall">{recepcion.tratamiento}</div>
      </div>
      <div className="w-full flex items-center justify-between tipografiaCardsConfirmacionSmall">
        <span>
          {new Date(recepcion.horaIngreso).toLocaleDateString("es-AR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          })}{" "}
          {new Date(recepcion.horaIngreso).toLocaleTimeString().substring(0, 5)}
        </span>
      </div>
      <div className="w-full flex flex-col gap-2 mt-4">
        {renderMotivo()}
        <div className="flex items-center gap-2">
          <span className="tipografiaCardsConfirmacionSmall">Médico:</span>
          <span className="tipografiaCardsConfirmacion">{recepcion.medico}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tipografiaCardsConfirmacionSmall">Sede:</span>
          <span className="tipografiaCardsConfirmacion">{recepcion.sucursal}</span>
          <span className="tipografiaCardsConfirmacionSmall">Piso:</span>
          <span className="tipografiaCardsConfirmacion">{recepcion.piso.split(" ")[1]}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={iconoTelefono} alt="Teléfono" className="iconSize" />
          <span className="tipografiaCardsConfirmacionSmall">{recepcion.pacienteCelular}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={iconoMail} alt="Email" className="iconSize" />
          <span className="tipografiaCardsConfirmacionSmall">{recepcion.pacienteMail}</span>
        </div>
      </div>
      <div className="w-full flex mt-4">
        <SelectEstadosRecepcion
          name="estadoRecepcion"
          className="w-full border rounded p-2"
          placeholder="Cambiar estado"
          value={recepcion.estado}
          onChange={(event) => handleEstado(event.target.value)}
        />
      </div>
      {recepcion.estado == "En Espera" && estaVencido && recepcion.medicoId == 1 ?
      (<div className="w-full flex items-center justify-start mt-4 border-2 border-[#1F580A] rounded">
  <div className="flex justify-center items-center bg-[#1F580A] text-[#1F580A] pt-8">
    |
  </div>
  <div className="flex flex-col justify-center items-center gap-1 p-1 w-full">
    <span className="tipografiaCardsConfirmacionSmall text-center">Tiempo de espera</span>
    <span className="text-[#1F580A] text-sm font-semibold font-['Poppins'] leading-tight">+30 minutos</span>
  </div>
</div>):""
      }
      {/** Muestra modal de Edicion */}
      {showRecepcionEditModal &&
        <RecepcionEditModal recepcionData={recepcion} onClose={() => setShowRecepcionEditModal(false)} /> 
      }
    </div> 
  );
};

export default RecepcionCard;
