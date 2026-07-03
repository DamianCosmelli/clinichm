import { ENDPOINTS } from '../api/endpoints';
import { Producto } from '../models/Producto';
import { apiService } from '../api/apiService';

export const ListaProductos = async (): Promise<Producto[]> => {
  try {
    const response = await apiService(ENDPOINTS.PRODUCTOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }

    const data = await response.json();
    return data.map((producto: Producto) => ({
      id: producto.id,
      categoriaProdId: producto.categoriaProdId,
      nombre: producto.nombre,
      noAutoDescontable: producto.noAutoDescontable,
    }));
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};

export const actualizarProducto = async (productoId: number, producto: Partial<Producto>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.PRODUCTOS}/${productoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

export const crearProducto = async (producto: Partial<Producto>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.PRODUCTOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};

export const obtenerProductoPorId = async (productoId: number): Promise<Producto> => {
  try {
    const response = await apiService(`${ENDPOINTS.PRODUCTOS}/${productoId}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener producto: ${errorText}`);
    }
    const data = await response.json();
    return data as Producto;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw error;
  }
};
