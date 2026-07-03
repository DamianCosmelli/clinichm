import { ENDPOINTS } from '../api/endpoints';
import { MedioDePago } from '../models/MedioDePago';
import { apiService } from '../api/apiService';

export const fetchMediosDePago = async (): Promise<MedioDePago[]> => {
  try {
    const response = await apiService(ENDPOINTS.MEDIOS_DE_PAGO, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los medios de pago');
    }

    const data: MedioDePago[] = await response.json();

    return data.map((medio) => ({
      id: medio.id,
      medioPago: medio.medioPago,
    }));
  } catch (error) {
    console.error('Error al obtener los medios de pago:', error);
    throw error;
  }
};
