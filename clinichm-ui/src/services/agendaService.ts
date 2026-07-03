import { ENDPOINTS } from '../api/endpoints';
import { Agenda } from '../models/Agenda';
import { apiService } from '../api/apiService';

export const guardarAgenda = async (agenda: Agenda) => {
  try {
    const response = await apiService(ENDPOINTS.AGENDA_MEDICA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agenda),
    });

    if (!response.ok) {
      throw new Error('Error al guardar agenda');
    }

    const data = await response.json();

    return data; // Retorna el turno guardado
  } catch (error) {
    console.error('Error al guardar agenda:', error);
    throw error;
  }
};

export const medicosDisponiblesAgenda = async (fecha: Date, hora: number, sede: number) => {
  try {
    const query = new URLSearchParams({
      fechaDesde: fecha.toISOString().substring(0, 10),
      fechaHasta: fecha.toISOString().substring(0, 10),
      hora: hora.toString(),
      sucursalId: sede.toString(),
    });
    const response = await apiService(`${ENDPOINTS.AGENDA_MEDICA}/medico-disponibles?${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
  
    });

    if (!response.ok) {
      throw new Error('Error al buscar medicos en  agenda');
    }

    const data = await response.json();

    return data; // Retorna listado de id de medicos disponibles
  } catch (error) {
    console.error('Error al buscar medicos en agenda:', error);
    throw error;
  }
};

export const obtenerAgendabyId = async (id: number) => {
  try {
    const response = await apiService(`${ENDPOINTS.AGENDA_MEDICA}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener la agenda: ${errorText}`);
    }

    const data: Agenda = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener agenda:', error);
    throw error;
  }
};

export const actualizarAgenda = async (id: number, agendaData: Agenda) => {
  try {
    const response = await apiService(`${ENDPOINTS.AGENDA_MEDICA}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar la agenda: ${errorText}`);
    }

    const data: Agenda = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar agenda:', error);
    throw error;
  }
};
