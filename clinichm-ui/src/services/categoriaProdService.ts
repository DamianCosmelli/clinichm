import { ENDPOINTS } from '../api/endpoints';
import { CategoriaProd } from '../models/CategoriaProd';
import { apiService } from '../api/apiService';

export const ListaCategoriasProd = async (): Promise<CategoriaProd[]> => {
  try {
    const response = await apiService(ENDPOINTS.CATEGORIAS_PROD, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las categorías de productos');
    }

    const data = await response.json();
    return data.map((categoria: CategoriaProd) => ({
      id: categoria.id,
      nombre: categoria.nombre,
    }));
  } catch (error) {
    console.error('Error al obtener las categorías de productos:', error);
    throw error;
  }
};
