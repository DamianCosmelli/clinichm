import React from 'react';
import { Paciente } from '../../models/Paciente';

interface ContenedorMetodoCaptacionProps {
  paciente: Paciente | null;
}

const ContenedorMetodoCaptacion: React.FC<ContenedorMetodoCaptacionProps> = ({ paciente }) => {
  return (
    <div className="w-[267px] h-full px-4 py-6 bg-[#FBFBFB] rounded-md outline outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-4">
      <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
        Método de captación
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="label-titulo">Nos conoció por</div>
        </div>
        <div className="label-valor">{paciente?.medioPublicidad || 'N/A'}</div>
      </div>
    </div>
  );
};

export default ContenedorMetodoCaptacion;
