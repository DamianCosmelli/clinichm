import { ENDPOINTS } from '../api/endpoints';
import { apiService } from '../api/apiService';
import { Medico } from '../models/Medico'; // Importar el modelo Medico

export const MedicoById = async (medicoId: number): Promise<Medico> => {
  try {
    const response = await apiService(ENDPOINTS.MEDICOS + `/${medicoId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el médico');
    }

    const medico: Medico = await response.json();
    return medico; // Retornar el objeto completo del modelo Medico
  } catch (error) {
    console.error('Error al obtener el médico:', error);
    throw error;
  }
};
