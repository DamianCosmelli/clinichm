import config from '../api/config';
import { apiService } from '../api/apiService';


export const deleteEntidad = async (entidad: string, id: number) => {
  try {
    const url = `${config.apiBaseUrl}api/${entidad}/${id}`;
    const response = await apiService(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar entidad ${entidad}: ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error al eliminar entidad:', error);
    throw error;
  }
};