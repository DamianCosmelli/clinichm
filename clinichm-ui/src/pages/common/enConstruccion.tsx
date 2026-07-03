import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnConstruccionImg from '../../assets/EnConstruccion.svg'; // Imagen de construcción

const EnConstruccion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-8 bg-[#FBFBFB] rounded-lg border border-[#7A7979] flex flex-col justify-center items-center gap-16">
      <img
        src={EnConstruccionImg}
        alt="En construcción"
        className="w-[298.07px] h-[247.57px]"
      />
      <div className="text-center">
        <div className="text-[#111111] text-2xl font-poppins font-medium leading-[33.60px] break-words">
          Estamos trabajando en esta página
        </div>
        <div className="text-[#111111] text-xl font-poppins font-normal leading-7 break-words">
          Muy pronto estará disponible.
        </div>
      </div>
      <button
        onClick={() => navigate('/turnos')}
        className="w-110 h-12 px-4 bg-[#D6A041] rounded text-[#111111] text-base font-poppins font-semibold leading-[22.40px] text-center cursor-pointer"
      >
        Ir a Turnos
      </button>
    </div>
  );
};

export default EnConstruccion;
