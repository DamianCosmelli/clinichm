import React, { useContext, useEffect } from 'react';
import iconoCerrar from '../../assets/iconoCerrar.svg';
import BotonConIcono from '../common/BotonConIcono';
import { AuthContext } from '../../utils/authContext';
import { ROLES } from '../../utils/roles';

interface PopupCierreCajaProps {
  sucursales: { id: number; nombre: string }[];
  sucursalSeleccionada: number | null;
  setSucursalSeleccionada: (id: number) => void;
  fecha: string;
  setFecha: (fecha: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const PopupCierreCaja: React.FC<PopupCierreCajaProps> = ({
  sucursales,
  sucursalSeleccionada,
  setSucursalSeleccionada,
  fecha,
  setFecha,
  onClose,
  onConfirm,
}) => {
  const { user } = useContext(AuthContext);

// Efecto para establecer la sucursal del usuario al cargar si no es admin
  useEffect(() => {
    if (user?.role !== ROLES.ADMIN && user?.usuarioData.sucursalID && !sucursalSeleccionada) {
      setSucursalSeleccionada(user?.usuarioData.sucursalID);
    }
  }, [user, sucursalSeleccionada, setSucursalSeleccionada]);

  const handleSucursalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSucursalSeleccionada(Number(e.target.value));
  };

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
              ¿Querés cerrar la caja?
            </div>
            <div className="w-full flex flex-col gap-4 mt-4">
              <label className="text-sm font-medium">Seleccionar Sucursal:</label>
              <select
                className={`border rounded-lg p-2 ${user?.role !== ROLES.ADMIN ? 'bg-gray-200' : ''}`}
                value={sucursalSeleccionada || ''}
                onChange={handleSucursalChange}
                disabled={user?.role !== ROLES.ADMIN}
              >
                <option value="" disabled>
                  Seleccionar una sucursal
                </option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
              <label className="text-sm font-medium">Seleccionar Fecha:</label>
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
              label="Ejecutar cierre"
              onClick={onConfirm}
              className="boton-con-icono-rel card-eliminar-btn-cancelar" //card-eliminar-btn-eliminar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCierreCaja;
