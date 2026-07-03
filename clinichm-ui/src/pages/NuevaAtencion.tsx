import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg';
import FormularioRecepcion from '../components/Recepcion/FormularioRecepcion.tsx'; // Agregar extensión .tsx

const NuevaAtencion: React.FC = () => {
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/recepcion" className="text-navegacion">Recepción</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Nueva Atención</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Nueva Atención</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                {mensajeExito}
              </span>
            </div>
          )}
        </div>
      </div>

      <FormularioRecepcion setMensajeExito={setMensajeExito} /> {/* Usar el nuevo componente */}
    </div>
  );
};

export default NuevaAtencion;
