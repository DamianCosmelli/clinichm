import { ENDPOINTS } from '../api/endpoints';
import { apiService } from '../api/apiService';

export const ListaEstadosTurno = async () => {
  try {
    const response = await apiService(ENDPOINTS.ESTADO_TURNOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los estados de los turnos');
    }

    const data = await response.json();
   
    return data.map((estados: { id: number; estado: string; }) => ({
      id: estados.id,
      estado: estados.estado
    }));
  } catch (error) {
    console.error('Error al obtener los estados de turno:', error);
    throw error;
  }
};
