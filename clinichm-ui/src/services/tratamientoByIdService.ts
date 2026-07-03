import { ENDPOINTS } from '../api/endpoints';
import { apiService } from '../api/apiService';

export const TratamientoById = async (tratamientoId:number) => {
  try {
    const response = await apiService(ENDPOINTS.TRATAMIENTOS + `/${tratamientoId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el tratamiento');
    }  
   
    const tratamiento: { id: number; nombreTratamiento: string; } = await response.json();
 
    return {
      id: tratamiento.id,
      nombre: tratamiento.nombreTratamiento,
    };
  } catch (error) {
    console.error('Error al obtener el médico:', error);
    throw error;
  }
};
