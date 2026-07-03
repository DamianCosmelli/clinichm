import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoAutorizadoImg from '../../assets/401_NoAutorizado.svg';

const NoAutorizado: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full h-[450px] p-4 bg-[#FBFBFB] rounded-lg border border-[#7A7979] flex flex-col justify-center items-center gap-4">
      <img
        src={NoAutorizadoImg}
        alt="En construcción"
        className="w-[298.07px] h-[247.57px]"
      />
      <div className="text-center gap-4">
        <div className="text-[#111111] text-2xl font-poppins font-medium leading-[33.60px] break-words">
          Sin autorización
        </div>
        <div className="text-[#111111] text-xl font-poppins font-normal leading-7 break-words">
          Lo sentimos, parece que no tenés los permisos necesarios para continuar.
        </div>
         
      </div>
     <button
        onClick={() => navigate(-1)}
        className="w-110 h-12 mt-3 px-4 bg-[#D6A041] rounded text-[#111111] text-base font-poppins font-semibold leading-[22.40px] text-center cursor-pointer"
      >
        Cerrar
      </button>
    </div>
  );
};

export default NoAutorizado;