import { ENDPOINTS } from '../api/endpoints';
import { PagoDeComisiones } from '../models/PagoDeComisiones';
import { apiService } from '../api/apiService';

export const obtenerPagoDeComisionesPorCierreCaja = async (idCierreCaja: number): Promise<PagoDeComisiones[]> => {
  try {
    const response = await apiService(`${ENDPOINTS.PAGO_COMISIONES}?idCierreCaja=${idCierreCaja}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pagos de comisiones');
    }

    const data = await response.json();
    return data as PagoDeComisiones[];
  } catch (error) {
    console.error('Error al obtener los pagos de comisiones:', error);
    throw error;
  }
};
