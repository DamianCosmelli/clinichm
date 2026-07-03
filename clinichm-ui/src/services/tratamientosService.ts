import { ENDPOINTS } from '../api/endpoints';
import { Tratamiento } from '../models/Tratamiento';
import { apiService } from '../api/apiService';

export const ListaTratamientos = async (): Promise<Tratamiento[]> => {
  try {
    const response = await apiService(ENDPOINTS.TRATAMIENTOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los tratamientos');
    }

    const data = await response.json();

    return data.map((tratamiento: Tratamiento) => ({
      id: tratamiento.id,
      nombreTratamiento: tratamiento.nombreTratamiento,
      descripcion: tratamiento.descripcion,
      sucursalId: tratamiento.sucursalId,
      precioEfectivo: tratamiento.precioEfectivo,
      precioOtrosMediosDePago: tratamiento.precioOtrosMediosDePago,
      comision: tratamiento.comision,
      comisionEncargado: tratamiento.comisionEncargado,
      comisionEspecial: tratamiento.comisionEspecial, // Nuevo campo agregado
    }));
  } catch (error) {
    console.error('Error al obtener los tratamientos:', error);
    throw error;
  }
};

export const obtenerTratamientoPorId = async (tratamientoId: number): Promise<Tratamiento> => {
  try {
    const response = await apiService(`${ENDPOINTS.TRATAMIENTOS}/${tratamientoId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener tratamiento: ${errorText}`);
    }
    const data: Tratamiento = await response.json(); // Especificar tipo Tratamiento
    return data;
  } catch (error) {
    console.error(`Error al obtener tratamiento con ID ${tratamientoId}:`, error);
    throw error;
  }
};

export const actualizarTratamiento = async (tratamientoId: number, tratamiento: Partial<Tratamiento>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.TRATAMIENTOS}/${tratamientoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tratamiento),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el tratamiento');
    }
  } catch (error) {
    console.error('Error al actualizar el tratamiento:', error);
    throw error;
  }
};

export const crearTratamiento = async (tratamiento: Partial<Tratamiento>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.TRATAMIENTOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tratamiento),
    });

    if (!response.ok) {
      throw new Error('Error al crear el tratamiento');
    }
  } catch (error) {
    console.error('Error al crear el tratamiento:', error);
    throw error;
  }
};
