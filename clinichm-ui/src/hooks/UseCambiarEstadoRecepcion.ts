import { useState } from 'react';
import { RecepcionPacientes } from '../models/RecepcionPacientes';
import { actualizarRecepcionPaciente, obtenerRecepcionbyId } from '../services/recepcionPacientesService';

export const useCambiarEstado = () => {
  const [cambio, setCambio] = useState<boolean | null>(null);

  const cambiarEstado = async (nuevoEstado: string, id: number): Promise<boolean> => {
    try {
      const recepcionInfo = await obtenerRecepcionbyId(id);
      let recepcionData: RecepcionPacientes | undefined;
      switch (nuevoEstado.toLowerCase()) {
        case 'en espera':
          recepcionData = { ...recepcionInfo, estadoRecepcion: "En Espera"  } as RecepcionPacientes;
          break;
        case 'ingresado':
          recepcionData = { ...recepcionInfo, estadoRecepcion: "Ingresado" } as RecepcionPacientes;
          break;
        case 'finalizado':
          recepcionData = {...recepcionInfo, estadoRecepcion: "Finalizado" } as RecepcionPacientes;
          break;
        default:
          console.error('Estado no válido:', nuevoEstado);
      }
      if (!recepcionData) {
        console.error('Estado no válido:', nuevoEstado);
        return false;
      }
      await actualizarRecepcionPaciente(id, recepcionData);
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
