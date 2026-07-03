import { EventoCalendar } from "../../models/EventoCalendar";
import iconoTelefono from "../../assets/iconoTelefono.svg";
import iconoMail from "../../assets/iconoMail.svg";
//import IconoComentario from '../../assets/IconoComentario.svg';
//import iconoEliminar from '../../assets/iconoEliminar.svg';
import iconoEditar from "../../assets/iconoEditar.svg";
import iconoCerrar from "../../assets/iconoCerrar.svg";
//import IconoWhatsapp from '../../assets/IconoWhatsapp.svg';
import iconoCheck from "../../assets/iconoCheck.svg";
import iconoInfo from "../../assets/iconoInfo.svg";
import iconoInterrogacion from "../../assets/SignoInterrogacion.svg";
import iconoReprogramacion from "../../assets/Group.svg";
import iconoCancelado from "../../assets/close-rounded.svg";
import iconoNoEncontrado from "../../assets/call-outline.svg";
import { useNavigate } from "react-router-dom";
import EliminarRegistro from "../common/EliminarRegistro";
import { useContext, useEffect, useState } from "react";
import { ENTITIES } from "../../models/Entidades";
import { ListaEstadosTurno } from "../../services/estadoTurnosService";
import Dropdown from "../common/Dropdown";
import { useCambiarEstado } from "../../hooks/UseCambiarEstadoTurno";
import { Checkbox } from "@material-tailwind/react";
import { useCambiarAsistio } from "../../hooks/UseCambiarAsistio";
import { AuthContext } from '../../utils/authContext';
import { ROLES } from '../../utils/roles';


interface TurnoCardProps {
  turno: EventoCalendar; // Usar el modelo EventoCalendar
  onClose: () => void;
}

const TurnoCard: React.FC<TurnoCardProps> = ({ turno, onClose }) => {
  const renderEstado = () => {
    switch (turno.estado.toLowerCase()) {
      case "confirmado":
        return (
          <div className="flex items-center gap-0" key="confirmado">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#1F580A] w-6 h-6">
              <img
                src={iconoCheck}
                alt="Signo de check"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#D0E5EE]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Confirmado
              </span>
            </div>
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
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#FCEB69]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Cambio de agenda
              </span>
            </div>
          </div>
        );
      case "sin confirmar":
        return (
          <div className="flex items-center gap-0" key="sin-confirmar">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#117BA8] w-6 h-6">
              <img
                src={iconoInterrogacion}
                alt="Signo de interrogación"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#D0E5EE]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Sin confirmar
              </span>
            </div>
          </div>
        );
      case "reprogramado":
        return (
          <div className="flex items-center gap-0" key="sin-confirmar">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#1611A8] w-6 h-6">
              <img
                src={iconoReprogramacion}
                alt="reprogramacion"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#D0CFEE]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Reprogramado
              </span>
            </div>
          </div>
        );
      case "cancelado":
        return (
          <div className="flex items-center gap-0" key="sin-confirmar">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#480A58] w-6 h-6">
              <img
                src={iconoCancelado}
                alt="cancelado"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#DBCEDE]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Cancelado
              </span>
            </div>
          </div>
        );
      case "numero no encontrado":
        return (
          <div className="flex items-center gap-0" key="sin-confirmar">
            <div className="flex justify-center items-center gap-2 rounded-l bg-[#D31F8B] w-6 h-6">
              <img
                src={iconoNoEncontrado}
                alt="no encontrado"
                className="text-white"
              />
            </div>
            <div className="flex justify-center items-center h-6 px-1.5 rounded-r bg-[#F6D2E8]">
              <span className="text-black font-poppins text-[12px] font-medium leading-[16.8px]">
                Número no Encontrado
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [estados, setEstados] = useState<{ id: number; estado: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const estadosTurno = await ListaEstadosTurno(); // Usar el tipo definido
        setEstados(estadosTurno);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    cargarDatos();
  }, []);

  {
    /*const handleEliminar = () => {
    setMostrarModal(true);
  };*/
  } /** SE comenta por no contar aun con la funcion de eliminar */

  const handleEditar = () => {
    navigate(`/editarTurno`, {
      state: {
        id: turno.id,
      },
    });
  };

  const handleOtroTurno = (id: string) => {
    navigate(`/editarTurno`, {
      state: { id },
    });
  };
  
  // Cambia el estado del turno
  // y cierra el modal

  const { cambiarEstado } = useCambiarEstado();
  const handleEstado = async (nuevoEstado: string) => {
    const exito = await cambiarEstado(nuevoEstado, turno.id);

    if (exito) {
      onClose();
      navigate(0); // Recargar la página
    } else {
      console.error("No se pudo cambiar el estado");
    }
  };

  // Cambia el estado Asistio del turno
  // y cierra el modal
  const [asistio, setAsistio] = useState(turno.asistio);
  const { cambiarAsistio } = useCambiarAsistio();
  const handleAsistio = async (nuevoEstado: boolean) => {
    const exito = await cambiarAsistio(nuevoEstado, turno.id);

    if (exito) {
      setAsistio(nuevoEstado);
      setTimeout(() => onClose(), 3000);
      //onClose();
      navigate(0); // Recargar la página
    } else {
      console.error("No se pudo cambiar el estado");
    }
  };

  return (
    <>
    <div className="card-estilo relative">
      <div className="absolute top-6 right-2 flex gap-2 items-center">
        {/*<img
          src={iconoEliminar}
          alt="Eliminar"
          className="iconSize cursor-pointer"
          onClick={handleEliminar}
        />*/
        /** SE comenta por no contar aun con la funcion de eliminar
        Problemas de performace y recepcion de mensaje de error del server
        debido a lectura y eliminacion del registro de manera conjunta */}
        {user?.role == ROLES.ADMIN || user?.role == ROLES.TURNOS ? (
          <img
          src={iconoEditar}
          alt="Editar"
          className="iconSize cursor-pointer"
          onClick={handleEditar}
        />):''}    
        <img
          src={iconoCerrar}
          alt="Cerrar"
          className="iconSize cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="w-full flex flex-col gap-2 mt-8">
        <div className="tipografiaCardsConfirmacion">{`${turno.paciente}`}</div>
        <div
          className="tipografiaCardsConfirmacionSmall"
          style={{ fontSize: "16px" }}
        >
          {turno.tratamiento}
        </div>
      </div>
      <div className="w-full flex items-center justify-between tipografiaCardsConfirmacionSmall">
        <div className="flex items-center gap-2">
          <span>
            {new Date(turno.start).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </span>
          <span>
            {new Date(turno.start).toLocaleTimeString().substring(0, 5)}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          <span className="tipografiaCardsConfirmacionSmall">Médico:</span>
          <span
            className="tipografiaCardsConfirmacion"
            style={{ fontSize: "14px" }}
          >{`${turno.medico}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tipografiaCardsConfirmacionSmall">Sede:</span>
          <span
            className="tipografiaCardsConfirmacion"
            style={{ fontSize: "14px" }}
          >{`${turno.sucursal}`}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={iconoTelefono} alt="Teléfono" className="iconSize" />
            <span className="tipografiaCardsConfirmacionSmall">
              {turno.paciciente_telefono}
            </span>
          </div>
          {/*<div className="flex items-center gap-2 whitespace-nowrap">
            <img src={IconoWhatsapp} alt="Whatsapp" className="iconSize" />
            <span className="estiloEnviarMensaje">Enviar mensaje</span>
          </div>*/
          /**SE comenta por no contar aun con la funcion de WhatsApp */}
        </div>
        {turno.paciente_email && (
          <div className="flex items-center gap-2">
            <img src={iconoMail} alt="Email" className="iconSize" />
            <span className="tipografiaCardsConfirmacionSmall">
              {turno.paciente_email}
            </span>
          </div>
        )}
        {/*<div className="flex items-start gap-2 mt-2">
          <img src={IconoComentario} alt="Comentario" className="iconSize" />
          <div className="flex flex-col">
            <span className="tipografiaCardsConfirmacion">Comentario interno:</span>
            <span className="tipografiaCardsConfirmacionSmall">{comentario || "Sin comentario disponible"}</span>
          </div>
        </div>*/}
        <div className="flex items-center justify-between gap-2">
          {renderEstado()}
          <Checkbox label="Asistio"
          checked={asistio}
          onChange={() => handleAsistio(!asistio)}
          />
        </div>
        <div className="flex w-full">
          <Dropdown
            options={estados
              .filter((s) => s.estado !== turno.estado)
              .map((s) => s.estado)}
            placeholder="Cambiar estado"
            className="!w-full"
            onChange={(option) => handleEstado(option)}
            disabled={user?.role === ROLES.ADMIN || user?.role == ROLES.TURNOS 
                  ? false : true}
          />
        </div>
      </div>
      {/* Muestra el modal de eliminar **/}
      {mostrarModal && (
        <EliminarRegistro
          entidad={ENTITIES.Turnos}
          id={turno.id}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div> 
    <div>
      {/* Muestra los turnos repetidos */}
    {turno.otrosTurnos && turno.otrosTurnos.length > 0 && (
        <div className="card-turnos-rep mt-2 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            <span className="font-semibold text-gray-800 text-sm">
              Turno repetido
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {turno.otrosTurnos.map((fecha, index) => (
              <div
                key={index}
                onClick={user?.role === ROLES.ADMIN || user?.role == ROLES.TURNOS 
                  ? () => handleOtroTurno(fecha.id.toString()): undefined}
                className={`flex items-center justify-between text-[#8B6C24] text-sm font-medium
                  ${user?.role === ROLES.ADMIN || user?.role == ROLES.TURNOS 
                  ? 'cursor-pointer hover:underline' : ''} `}
              >
                <span>
                  {new Date(fecha.fecha).toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  {""}{" "}
                  {new Date(fecha.fecha).toLocaleTimeString().substring(0, 5)}</span>
                  {user?.role === ROLES.ADMIN || user?.role == ROLES.TURNOS ? 
                  (<span> {" >"} </span>):''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div></>
  );
};

export default TurnoCard;
