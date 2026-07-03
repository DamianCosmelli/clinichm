import { ENDPOINTS } from '../api/endpoints';
import { TurnoCalendar } from '../models/TurnoCalendar';
import { apiService } from '../api/apiService';

export const ListaTurnoFecha = async (start: Date, end: Date) => {
  try {
    const query = new URLSearchParams({
      fechaDesde: start.toISOString().substring(0, 10),
      fechaHasta: end.toISOString().substring(0, 10),
    });
    const response = await apiService(`${ENDPOINTS.TURNOS_FECHA}?${query}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los turnos');
    }

    const data: TurnoCalendar[] = await response.json();
   
    return data;
    
  } catch (error) {
    console.error('Error al obtener los estados de turno:', error);
    throw error;
  }
};
