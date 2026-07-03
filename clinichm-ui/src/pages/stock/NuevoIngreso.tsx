import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import iconoChevronRight from '../../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../../assets/icon-check.svg';
import FormularioNuevoIngresoStock from '../../components/Stock/FormularioNuevoIngresoStock';

const NuevoIngreso: React.FC = () => {
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/stock" className="text-navegacion">Stock</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Nuevo ingreso</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Nuevo ingreso</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Ingreso registrado
              </span>
            </div>
          )}
        </div>
      </div>
      <FormularioNuevoIngresoStock setMensajeExito={setMensajeExito} />
    </div>
  );
};

export default NuevoIngreso;
