import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg'; // Importar el ícono de éxito
import FormularioNuevaAgenda from '../components/AgendaMedica/FormularioNuevaAgenda';

const NuevaAgenda: React.FC = () => {
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/agenda" className="text-navegacion">Agenda</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Nueva Agenda</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Nueva Agenda</span> {/* Ajuste del margen superior */}
          {/* Mostrar mensaje de éxito */}
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Agenda registrada
              </span>
            </div>
          )}
        </div>
      </div>

      <FormularioNuevaAgenda setMensajeExito={setMensajeExito} />
    </div>
  );
};

export default NuevaAgenda;
