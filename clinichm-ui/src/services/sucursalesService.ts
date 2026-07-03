import { ENDPOINTS } from '../api/endpoints';
import { Sucursal } from '../models/Sucursal';
import { apiService } from '../api/apiService';

export const ListaSucursales = async (): Promise<Sucursal[]> => {
  try {
    const response = await apiService(ENDPOINTS.SUCURSALES, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las sucursales');
    }

    const data = await response.json();

    return data.map((sucursal: Sucursal) => ({
      id: sucursal.id,
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      ciudad: sucursal.ciudad,
      codigoPostal: sucursal.codigoPostal,
    }));
  } catch (error) {
    console.error('Error al obtener las sucursales:', error);
    throw error;
  }
};

export const obtenerSucursalPorId = async (sucursalId: number): Promise<Sucursal> => {
  try {
    const response = await apiService(`${ENDPOINTS.SUCURSALES}/${sucursalId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener sucursal: ${errorText}`);
    }
    const data = await response.json();
    return data as Sucursal;
  } catch (error) {
    console.error('Error al obtener sucursal:', error);
    throw error;
  }
};

export const crearSucursal = async (sucursal: Partial<Sucursal>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.SUCURSALES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sucursal),
    });

    if (!response.ok) {
      throw new Error('Error al crear la sucursal');
    }
  } catch (error) {
    console.error('Error al crear la sucursal:', error);
    throw error;
  }
};

export const actualizarSucursal = async (sucursalId: number, sucursal: Partial<Sucursal>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.SUCURSALES}/${sucursalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sucursal),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la sucursal');
    }
  } catch (error) {
    console.error('Error al actualizar la sucursal:', error);
    throw error;
  }
};
