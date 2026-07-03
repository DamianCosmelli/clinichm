import { ENDPOINTS } from '../api/endpoints';
import { apiService } from '../api/apiService';

export const SucursalById = async (sucursalId:number) => {
  try {
    const response = await apiService(ENDPOINTS.SUCURSALES + `/${sucursalId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la sucursal');
    }  
   
    const sucursal: { id: number; nombre: string } = await response.json();
 
    return {
      id: sucursal.id,
      nombre: sucursal.nombre,
    };
  } catch (error) {
    console.error('Error al obtener la sucursal:', error);
    throw error;
  }
};
