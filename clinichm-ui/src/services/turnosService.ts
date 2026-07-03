import { ENDPOINTS } from '../api/endpoints';
import { Turno } from '../models/Turno';
import { apiService } from '../api/apiService';


export const guardarTurno = async (turno: Turno) => {
  try {
    const response = await apiService(ENDPOINTS.TURNOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(turno),
    });

    if (!response.ok) {
      throw new Error('Error al guardar el turno');
    }

    const data = await response.json();

    return data; // Retorna el turno guardado
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    throw error;
  }
};

export const obtenerTurnosPorPacienteId = async (pacienteId: number): Promise<Turno[]> => {
  try {
    const response = await apiService(`${ENDPOINTS.TURNOS}?pacienteId=${pacienteId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener turnos: ${errorText}`);
    }
    const data: Turno[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    throw error;
  }
};

export const actualizarTurno = async (id: number, turnoData: Turno) => {
  try {
    const response = await apiService(`${ENDPOINTS.TURNOS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(turnoData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el turno: ${errorText}`);
    }

    const data: Turno = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    throw error;
  }
};
export const obtenerTurnobyId = async (id: number) => {
  try {
    const response = await apiService(`${ENDPOINTS.TURNOS}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el turno: ${errorText}`);
    }

    const data: Turno = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener turno:', error);
    throw error;
  }
};

export const obtenerTurnosAfectados = async (): Promise<Turno[]> => {
  try {
    const response = await apiService(ENDPOINTS.TURNOS_AFECTADOS, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener turnos afectados: ${errorText}`);
    }

    const data: Turno[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener turnos afectados:', error);
    throw error;
  }
};

export const actualizarConResolucion = async (turnoId: number) => {
  try {
    const response = await apiService(
      `${ENDPOINTS.TURNOS_AFECTADOS}/${turnoId}/con-resolucion`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar ConResolucion: ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error('Error al actualizar ConResolucion:', error);
    throw error;
  }
};

export const obtenerTurnosRangoFecha = async (fechaDesde: string, fechaHasta: string): Promise<Turno[]> => {
  try {
    const response = await apiService(
      `${ENDPOINTS.TURNOS}/rango-fecha?fechaDesde=${encodeURIComponent(fechaDesde)}&fechaHasta=${encodeURIComponent(fechaHasta)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener turnos por rango de fecha: ${errorText}`);
    }
    const data: Turno[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener turnos por rango de fecha:', error);
    throw error;
  }
};
