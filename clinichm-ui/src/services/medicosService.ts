import { ENDPOINTS } from '../api/endpoints';
import { Medico } from '../models/Medico'; // Importar el modelo Medico
import { apiService } from '../api/apiService';

export const ListaMedicos = async (): Promise<Medico[]> => {
  try {
    const response = await apiService(ENDPOINTS.MEDICOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los médicos');
    }

    const data = await response.json();
    return data as Medico[]; // Retornar todos los datos del médico
  } catch (error) {
    console.error('Error al obtener los médicos:', error);
    throw error;
  }
};

export const obtenerMedicoPorId = async (medicoId: number): Promise<Medico> => {
  try {
    const response = await apiService(`${ENDPOINTS.MEDICOS}/${medicoId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener médico: ${errorText}`);
    }
    const data = await response.json();
    return data as Medico; // Retornar todos los datos del médico
  } catch (error) {
    console.error('Error al obtener médico:', error);
    throw error;
  }
};

export const crearMedico = async (medico: Partial<Medico>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.MEDICOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medico),
    });

    if (!response.ok) {
      throw new Error('Error al crear el médico');
    }
  } catch (error) {
    console.error('Error al crear el médico:', error);
    throw error;
  }
};

export const actualizarMedico = async (medicoId: number, medico: Partial<Medico>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.MEDICOS}/${medicoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medico),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el médico');
    }
  } catch (error) {
    console.error('Error al actualizar el médico:', error);
    throw error;
  }
};
