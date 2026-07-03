import React from 'react';

interface DatosLaboralesProps {
  rol: string;
  sucursal: string;
}

const DatosLaborales: React.FC<DatosLaboralesProps> = ({ rol, sucursal }) => {
  return (
    <div className="flex-1 h-72 p-4 rounded-lg border-2 border-gray-300 flex flex-col justify-start items-start gap-4 font-poppins">
      <div className="w-full text-[#111111] text-lg font-semibold leading-7">Datos laborales</div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="text-[#111111] text-base font-semibold leading-6">Rol</div>
        </div>
        <div className="w-full text-[#111111] text-base font-normal leading-6">{rol}</div>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="text-[#111111] text-base font-semibold leading-6">Sede</div>
        </div>
        <div className="w-full text-[#111111] text-base font-normal leading-6">{sucursal}</div>
      </div>
    </div>
  );
};

export default DatosLaborales;
