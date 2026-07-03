import { ENDPOINTS } from '../api/endpoints';
import { Rol } from '../models/Rol';
import { apiService } from '../api/apiService';

export const ListaRoles = async (): Promise<Rol[]> => {
  try {
    const response = await apiService(ENDPOINTS.ROL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los roles');
    }

    const data = await response.json();

    return data.map((rol: Rol) => ({
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
    }));
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    throw error;
  }
};
