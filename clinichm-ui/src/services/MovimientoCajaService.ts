import { ENDPOINTS } from '../api/endpoints';
import { MovimientoCaja } from '../models/MovimientoCaja';
import { apiService } from '../api/apiService';
import { Pago } from '../models/Pagos';

export const crearMovimientoCaja = async (movimientoData: MovimientoCaja) => {
  try {
    const response = await apiService(ENDPOINTS.MOVIMIENTOS_CAJA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movimientoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al crear un nuevo movimiento de caja');
    }

    const data = await response.json();

    return data; // Retorna el movimiento de caja guardado
  } catch (error) {
    console.error('Error al crear movimiento de caja:', error);
    throw error;
  }
};

export const fetchMovimientosCaja = async () => {
  try {
    const response = await apiService(ENDPOINTS.MOVIMIENTOS_CAJA, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los movimientos de caja');
    }

    const data = await response.json();

    return data.map((movimiento: MovimientoCaja) => ({
      ...movimiento,
      idMedioPago: movimiento.idMedioPago, // Asegurar que se incluya idMedioPago
    }));
  } catch (error) {
    console.error('Error al obtener los movimientos de caja:', error);
    throw error;
  }
};
export const crearPago = async (pagoData: Pago) => {
  try {
    const response = await apiService(`${ENDPOINTS.MOVIMIENTO_CAJA}/procesar-pago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al crear un nuevo pago');
    }

    const data = await response.json();

    return data; // Retorna el movimiento de caja guardado
  } catch (error) {
    console.error('Error al crear pago:', error);
    throw error;
  }
};
export const generarInformeMovimientosyCom = async (sucursal: number): Promise<Blob> => {
  try {
    const query = new URLSearchParams({
      sucursal: sucursal.toString()});

    const response = await apiService(`${ENDPOINTS.MOVIMIENTO_CAJA}/hoy?${query}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al generar el informe de movimientos y comisiones');
    }

    return await response.blob(); // Retornar el archivo como Blob
  } catch (error) {
    console.error('Error al generar el informe de movimientos y comisiones:', error);
    throw error;
  }
};