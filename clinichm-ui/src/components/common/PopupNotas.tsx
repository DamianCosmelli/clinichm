import React from 'react';
import iconoCerrar from '../../assets/iconoCerrar.svg';

interface PopupNotasProps {
  notas: string;
  onClose: () => void;
}

const PopupNotas: React.FC<PopupNotasProps> = ({
  notas,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 backdrop-brightness-30 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
      <div className="bg-white max-h-full overflow-y-auto rounded-xl shadow-lg p-2">
        <div className="card-eliminar relative">
          <div className="absolute top-3 right-2 flex gap-2 items-center">
            <img
              src={iconoCerrar}
              alt="Cerrar"
              className="iconSize cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="tipografiaCardsConfirmacion text-start">
              Notas
            </div>
            <div className="w-full flex flex-col gap-4 mt-2">
              <div
                className="border rounded-lg p-2 italic text-gray-600">
                  {notas}
                </div>
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
};

export default PopupNotas;
