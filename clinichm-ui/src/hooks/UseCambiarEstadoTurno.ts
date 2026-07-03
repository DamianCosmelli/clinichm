import { useState } from 'react';
import { Turno } from '../models/Turno';
import { actualizarTurno, obtenerTurnobyId } from '../services/turnosService';

export const useCambiarEstado = () => {
  const [cambio, setCambio] = useState<boolean | null>(null);

  const cambiarEstado = async (nuevoEstado: string, id: number): Promise<boolean> => {
    try {
      const turnoInfo = await obtenerTurnobyId(id);
      let turnoData: Turno | undefined;
      switch (nuevoEstado.toLowerCase()) {
        case 'confirmado':
          turnoData = { ...turnoInfo,
            confirmado: true, cancelado: false , noEncontrado: false, reprogramado: false  } as Turno;
          break;
        case 'sin confirmar':
          turnoData = { ...turnoInfo, confirmado: false, cancelado: false , noEncontrado: false, reprogramado: false } as Turno;
          break;
        case 'cancelado':
          turnoData = {...turnoInfo, confirmado: false, cancelado: true , noEncontrado: false, reprogramado: false } as Turno;
          break;
        case 'numero no encontrado':
          turnoData = {  ...turnoInfo, confirmado: false, cancelado: false , noEncontrado: true, reprogramado: false } as Turno;
          break;
        case 'reprogramado':
          turnoData = { ...turnoInfo, confirmado: false, cancelado: false , noEncontrado: false, reprogramado: true } as Turno;
          break;
        default:
          console.error('Estado no válido:', nuevoEstado);
      }
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

  return { cambiarEstado, cambio };
};
