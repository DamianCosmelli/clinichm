import { ENDPOINTS } from '../api/endpoints';
import { RecepcionPacientes } from '../models/RecepcionPacientes';
import { apiService } from '../api/apiService';
import { RecepcionCalendar } from '../models/RecepcionCalendar';

export const ListaRecepcionPacientes = async (): Promise<RecepcionPacientes[]> => {
  try {
    const response = await apiService(ENDPOINTS.RECEPCION_PACIENTES, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la lista de recepciones de pacientes');
    }

    const recepciones: RecepcionPacientes[] = await response.json();
    return recepciones.map((recepcion: RecepcionPacientes) => ({
      id: recepcion.id,
      pacienteId: recepcion.pacienteId,
      tratamientoId: recepcion.tratamientoId,
      medicoId: recepcion.medicoId,
      horaIngreso: recepcion.horaIngreso,
      horaAnestesia: recepcion.horaAnestesia,
      estadoRecepcion: recepcion.estadoRecepcion,
      esConsulta: recepcion.esConsulta,
      piso: recepcion.piso,
      sucursalId: recepcion.sucursalId,
      esRetoque: recepcion.esRetoque,
      motivoConsulta: recepcion.motivoConsulta,
      medicoNombre: recepcion.medicoNombre, // Agregar propiedad
      tratamientoNombre: recepcion.tratamientoNombre, // Agregar propiedad
    }));
  } catch (error) {
    console.error('Error al obtener la lista de recepciones de pacientes:', error);
    throw error;
  }
};

export const crearRecepcionPaciente = async (recepcion: Partial<RecepcionPacientes>): Promise<void> => {
  try {
   

    if (!recepcion.pacienteId || !recepcion.tratamientoId || !recepcion.medicoId || !recepcion.horaIngreso) {
      throw new Error("Faltan campos obligatorios en los datos de recepción.");
    }

    const response = await apiService(ENDPOINTS.RECEPCION_PACIENTES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recepcion),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la respuesta del servidor:", errorText); // Log para capturar errores del servidor
      throw new Error('Error al crear la recepción de paciente');
    }

  
  } catch (error) {
    console.error('Error al crear la recepción de paciente:', error); // Log para capturar errores
    throw error;
  }
};

export const actualizarRecepcionPaciente = async (id: number, recepcion: Partial<RecepcionPacientes>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.RECEPCION_PACIENTES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recepcion),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la recepción de paciente');
    }
  } catch (error) {
    console.error('Error al actualizar la recepción de paciente:', error);
    throw error;
  }
};

export const ListaRecepcionFecha = async (start: Date) => {
  try {
    const query = new URLSearchParams({
      fecha: start.toISOString().substring(0, 10),
    });
    const response = await apiService(`${ENDPOINTS.RECEPCION_PACIENTES}/paciente-fecha?${query}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los turnos');
    }

    const data: RecepcionCalendar[] = await response.json();
   
    return data;
    
  } catch (error) {
    console.error('Error al obtener los estados de turno:', error);
    throw error;
  }
};

export const obtenerRecepcionbyId = async (id: number) => {
  try {
    const response = await apiService(`${ENDPOINTS.RECEPCION_PACIENTES}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener la recepcion: ${errorText}`);
    }

    const data: RecepcionPacientes = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener recepcion:', error);
    throw error;
  }
};

export const obtenerRecepcionPorPacienteId = async (pacienteId: number): Promise<RecepcionPacientes[]> => {
  try {
    const response = await apiService(`${ENDPOINTS.RECEPCION_PACIENTES}/paciente/${pacienteId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener recepciones: ${errorText}`);
    }

    const data: RecepcionPacientes[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener recepciones:', error);
    throw error;
  }
};