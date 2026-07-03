import { ENDPOINTS } from '../api/endpoints';
import { AgendaCalendar } from '../models/AgendaCalendar';
import { apiService } from '../api/apiService';

export const ListaAgendaFecha = async (start: Date, end: Date) => {
  try {
    const query = new URLSearchParams({
      fechaDesde: start.toISOString().substring(0, 10),
      fechaHasta: end.toISOString().substring(0, 10),
    });
    const response = await apiService(`${ENDPOINTS.AGENDA_FECHA}?${query}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la Agenda');
    }

    const data: AgendaCalendar[] = await response.json();
   
    return data;
    
  } catch (error) {
    console.error('Error al obtener la agenda:', error);
    throw error;
  }
};
