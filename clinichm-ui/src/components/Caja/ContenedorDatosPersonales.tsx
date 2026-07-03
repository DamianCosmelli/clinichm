import React from 'react';
import { Paciente } from '../../models/Paciente';
import { calcularEdad } from '../../utils/dateUtils';

interface ContenedorDatosPersonalesProps {
  paciente: Paciente | null;
}

const ContenedorDatosPersonales: React.FC<ContenedorDatosPersonalesProps> = ({ paciente }) => {
  return (
    <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
        Datos personales
      </div>
      <div className="w-full flex justify-start items-start gap-24">
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Edad</div>
          </div>
          <div className="label-valor">{calcularEdad(paciente?.fechaNac)}</div>
        </div>
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Dirección</div>
          </div>
          <div className="label-valor">{paciente?.direccion || 'N/A'}</div>
        </div>
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Código postal</div>
          </div>
          <div className="label-valor">{paciente?.codigoPostal || 'N/A'}</div>
        </div>
      </div>
      <div className="w-full flex justify-start items-start gap-24">
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Email</div>
          </div>
          <div className="label-valor">{paciente?.email || 'N/A'}</div>
        </div>
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Celular</div>
          </div>
          <div className="label-valor">{paciente?.celular || 'N/A'}</div>
        </div>
        <div className="w-[152px] flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-start items-center">
            <div className="label-titulo">Número de DNI</div>
          </div>
          <div className="label-valor">{paciente?.dni || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default ContenedorDatosPersonales;
