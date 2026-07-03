import React from 'react';
import iconoCerrar from '../../assets/iconoCerrar.svg';
import BotonConIcono from '../common/BotonConIcono';

interface PopupReporteCentralProps {
  fecha: string;
  setFecha: (fecha: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const PopupReporteCentral: React.FC<PopupReporteCentralProps> = ({
  fecha,
  setFecha,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 backdrop-brightness-30 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
      <div className="bg-white max-h-full overflow-y-auto rounded-xl shadow-lg p-4">
        <div className="card-eliminar relative">
          <div className="absolute top-6 right-2 flex gap-2 items-center">
            <img
              src={iconoCerrar}
              alt="Cerrar"
              className="iconSize cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mt-8">
            <div className="tipografiaCardsConfirmacion text-center">
              Selecciona la fecha del reporte
            </div>
            <div className="w-full flex flex-col gap-4 mt-4">
              <input
                type="date"
                className="border rounded-lg p-2"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-8">
            <BotonConIcono
              label="Generar reporte"
              onClick={onConfirm}
              className="boton-con-icono-rel card-eliminar-btn-cancelar" //card-eliminar-btn-eliminar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupReporteCentral;
