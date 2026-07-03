import React from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

interface DatosAccesoProps {
  userName: string;
  password: string;
  celular: string;
  mostrarPassword: boolean;
  setMostrarPassword: (value: boolean) => void;
}

const DatosAcceso: React.FC<DatosAccesoProps> = ({
  userName,
  password,
  celular,
  mostrarPassword,
  setMostrarPassword,
}) => {
  return (
    <div className="flex-1 h-72 p-4 rounded-lg border-2 border-gray-300 flex flex-col justify-start items-start gap-4 font-poppins">
      <div className="w-full text-[#111111] text-lg font-semibold leading-7">Datos de acceso</div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="text-[#111111] text-base font-semibold leading-6">Nombre de usuario</div>
        </div>
        <div className="w-full text-[#111111] text-base font-normal leading-6">{userName}</div>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="text-[#111111] text-base font-semibold leading-6">Contraseña</div>
        </div>
        <div className="w-full flex items-center relative">
          <span className="text-[#111111] text-base font-normal leading-6">
            {mostrarPassword ? password : '********'}
          </span>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarPassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeOffIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="w-full flex justify-start items-center">
          <div className="text-[#111111] text-base font-semibold leading-6">Celular</div>
        </div>
        <div className="w-full text-[#111111] text-base font-normal leading-6">{celular}</div>
      </div>
    </div>
  );
};

export default DatosAcceso;
