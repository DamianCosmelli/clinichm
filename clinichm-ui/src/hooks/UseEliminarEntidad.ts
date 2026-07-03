import { useState } from 'react';
import { deleteEntidad } from '../services/eliminarService';

export const useEliminarEntidad = () => {
  const [eliminado, setEliminado] = useState<boolean | null>(null);

  const eliminarEntidad = async (entidad: string, id: number): Promise<boolean> => {
    try {
      await deleteEntidad(entidad, id);
      setEliminado(true);
      return true;
    } catch (error) {
        console.error('Error al eliminar entidad:', error);
        setEliminado(false);
      return false;
    }
  };

  return { eliminarEntidad, eliminado };
};
