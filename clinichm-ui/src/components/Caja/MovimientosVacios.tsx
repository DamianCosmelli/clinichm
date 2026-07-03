import React from 'react';
import backgroundCarpeta from '../../assets/backgroundCarpeta.svg';
import iconoCarpeta from '../../assets/iconoCarpeta.svg';
import pisoCarpeta from '../../assets/pisoCarpeta.svg';

const MovimientosVacios: React.FC = () => {
  return (
    <div
      className="mt-4 ml-1 w-full h-[370px] p-[40px_24px_40px_24px] bg-[#FBFBFB] rounded-[12px] outline-2 outline-[#D69E41] flex flex-col justify-center items-center gap-[24px] relative"
    >
      <img
        src={backgroundCarpeta}
        alt="Background Carpeta"
        className="absolute top-[-20px] h-[210px] w-[210px] object-contain z-10"
      />
      <img
        src={iconoCarpeta}
        alt="Icono Carpeta"
        className="z-20"
      />
      <img
        src={pisoCarpeta}
        alt="Piso Carpeta"
        className="z-10 mt-[-30px]"
      />
      <div className="text-[#5E5D5D] text-[18px] font-poppins font-normal leading-[25.20px] break-words text-center mt-4">
        Cuando registres un nuevo movimiento<br />aparecerá en esta sección
      </div>
    </div>
  );
};

export default MovimientosVacios;