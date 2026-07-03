import { useEffect, useState, useRef } from "react";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import BotonConIcono from "./BotonConIcono";
import { useEliminarEntidad } from "../../hooks/UseEliminarEntidad";
import { useNavigate } from "react-router-dom";

interface EliminarProps {
  entidad: string;
  id: number;
  confirmar?: boolean;
  redireccionar?: string;
  onClose: () => void;
}

const EliminarRegistro: React.FC<EliminarProps> = ({
  entidad,
  id,
  confirmar = false,
  redireccionar ="/",
  onClose,
}) => {
  const { eliminarEntidad, eliminado } = useEliminarEntidad();
  const navigate = useNavigate();
  const [mostrarPopper, setMostrarPopper] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEliminar = () => {
    eliminarEntidad(entidad, id);
    setMostrarPopper(true);

    timeoutRef.current = setTimeout(() => {
      setMostrarPopper(false);
      onClose();
      setTimeout(() => {
        navigate(redireccionar);
      }, 300);
    }, 2000);
  };

  const handleEliminarSinConfirmar = () => {
    eliminarEntidad(entidad, id);
    setMostrarPopper(true);

    timeoutRef.current = setTimeout(() => {
      setMostrarPopper(false);
      onClose();
    }, 2000);
  };

  useEffect(() => {
    if (!confirmar) {
      handleEliminarSinConfirmar();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmar]);

  return (
    <>
      {/* Popper en la parte inferior -- Registro Eliminado*/}
      {mostrarPopper && eliminado &&(
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            Registro eliminado
          </div>
        </div>
      )}

       {/* Popper en la parte inferior -- Registro Eliminado*/}
       {mostrarPopper && eliminado === false &&(
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            No pudo eliminarse el registro
          </div>
        </div>
      )}



      {/* Modal solo si se confirma */}
      {confirmar && (
        <div className="fixed inset-0 backdrop-brightness-30 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white max-h-full overflow-y-auto rounded-xl shadow-lg p-4">
            <div className="card-eliminar relative">
              <div className="absolute top-6 right-2 flex gap-2 items-center">
                <img
                  src={iconoCerrar}
                  alt="Cerrar"
                  className="iconSize cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mt-8">
                <div className="tipografiaCardsConfirmacion text-center">
                  ¿Querés eliminar el registro?
                </div>
                <div className="tipografiaCardsConfirmacionSmall text-center">
                  La información no se guardará.
                </div>
              </div>
              <div className="w-full flex justify-center items-center mt-8 gap-2">
                <BotonConIcono
                  label={"Eliminar"}
                  onClick={handleEliminar}
                  className="boton-con-icono-rel card-eliminar-btn-eliminar"
                />
                <BotonConIcono
                  label={"Cancelar"}
                  onClick={onClose}
                  className="boton-con-icono-rel card-eliminar-btn-cancelar"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EliminarRegistro;
