import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar Link y useLocation para navegación
import FormularioNuevoTurno from "../components/Turnos/FormularioNuevoTurno";
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg'; // Importar el ícono de éxito
import useCargarTurno from '../hooks/useCargarTurno';
import Loading from './common/Loading';

const EditarTurno: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Obtener el id del estado de navegación

  const turno = useCargarTurno(id); // Pasar el id al hook
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/turnos" className="text-navegacion">Turnos</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar turno</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">{turno ? "Editar turno":""}</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Turno actualizado
              </span>
            </div>
          )}
        </div>
      </div>

      {turno ? (
        <FormularioNuevoTurno
          setMensajeExito={setMensajeExito} // Pasar el setter del mensaje de éxito
          turno={turno} // Pasar los datos del turno al formulario
        />
      ) : (      
        <Loading />
      )}
    </div>
  );
};

export default EditarTurno;
