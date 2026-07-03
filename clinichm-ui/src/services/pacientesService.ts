import { ENDPOINTS } from '../api/endpoints';
import { Paciente } from '../models/Paciente';
import { apiService } from '../api/apiService';

export const crearPacienteNuevoTurno = async (pacienteData: Paciente) => {
  try {
    const pacienteCompleto: Paciente = {
      nombre: pacienteData.nombre || '',
      apellido: pacienteData.apellido || '',
      celular: pacienteData.celular || '',
      email: pacienteData.email || '',
      direccion: pacienteData.direccion || '',
      codigoPostal: pacienteData.codigoPostal || '',
      medioPublicidad: pacienteData.medioPublicidad || '',
      dni: pacienteData.dni || '',
      fechaNac: pacienteData.fechaNac || null, // Asegurarse de incluir la fecha de nacimiento
      soloConsulto: pacienteData.soloConsulto || false, // Asegurar que se envíe el valor booleano
    };

    const response = await apiService(ENDPOINTS.PACIENTES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pacienteCompleto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear un nuevo paciente: ${errorText}`);
    }

    const data: Paciente = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear paciente:', error);
    throw error;
  }
};

export const buscarPacientePorDNI = async (dni: string): Promise<Paciente | null> => {
  try {
    const response = await apiService(ENDPOINTS.PACIENTES_BUSCAR_POR_DNI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ DNI: dni }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      throw new Error(`Error al buscar paciente por DNI: ${errorText}`);
    }

    const data: Paciente = await response.json();
    return data;
  } catch (error) {
    console.error('Error al buscar paciente por DNI:', error);
    throw error;
  }
};

export const actualizarPaciente = async (id: number, pacienteData: Paciente) => {
  try {
    const response = await apiService(`${ENDPOINTS.PACIENTES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pacienteData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el paciente: ${errorText}`);
    }

    const data: Paciente = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    throw error;
  }
};

export const obtenerPacientes = async (): Promise<Paciente[]> => {
  try {
    const response = await apiService(ENDPOINTS.PACIENTES);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener pacientes: ${errorText}`);
    }
    const data: Paciente[] = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('El formato de los datos recibidos no es válido.');
    }
    return data;
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    throw error;
  }
};

export const obtenerPacientebyId = async (id: number) => {
  try {
    const response = await apiService(`${ENDPOINTS.PACIENTES}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el paciente: ${errorText}`);
    }

    const data: Paciente = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    throw error;
  }
};

export const obtenerPacientesSoloConsulto = async (): Promise<Paciente[]> => {
  try {
    const response = await apiService(ENDPOINTS.PACIENTES_SOLO_CONSULTO, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener pacientes solo consulto: ${errorText}`);
    }

    const data: Paciente[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener pacientes solo consulto:', error);
    throw error;
  }
};

export const obtenerPacientesSinVisitaEnUltimosMeses = async (meses: number): Promise<Paciente[]> => {
  try {
    const response = await apiService(`${ENDPOINTS.PACIENTES_SIN_VISITA_EN_ULTIMOS_MESES}/${meses}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener pacientes sin visita en los últimos meses: ${errorText}`);
    }

    const data: Paciente[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener pacientes sin visita en los últimos meses:', error);
    throw error;
  }
};


