import { useState } from 'react';
import { Turno } from '../models/Turno';
import { actualizarTurno, obtenerTurnobyId } from '../services/turnosService';

export const useCambiarAsistio = () => {
  const [cambio, setCambio] = useState<boolean | null>(null);

  const cambiarAsistio = async (nuevoEstado: boolean, id: number): Promise<boolean> => {
    try {
      const turnoInfo = await obtenerTurnobyId(id);
      const turnoData: Turno = { ...turnoInfo, asistio: nuevoEstado };
          
      if (!turnoData) {
        console.error('Estado no válido:', nuevoEstado);
        return false;
      }
      await actualizarTurno(id, turnoData);
      setCambio(true);
      return true;
    } catch (error) {
        console.error('Error al eliminar entidad:', error);
        setCambio(false);
      return false;
    }
  };

  return { cambiarAsistio, cambio };
};
