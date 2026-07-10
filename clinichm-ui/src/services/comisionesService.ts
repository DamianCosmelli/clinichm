import { ENDPOINTS } from '../api/endpoints';
import { PagoDeComisiones } from '../models/PagoDeComisiones';
import { MovimientoCaja } from '../models/MovimientoCaja';
import { apiService } from '../api/apiService';

export const fetchComisiones = async (): Promise<PagoDeComisiones[]> => {
  try {
    const response = await apiService(ENDPOINTS.PAGO_COMISIONES, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las comisiones');
    }

    return await response.json() as PagoDeComisiones[];
  } catch (error) {
    console.error('Error al obtener las comisiones:', error);
    throw error;
  }
};

export const pagarComision = async (movimientoData: MovimientoCaja): Promise<MovimientoCaja> => {
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
      throw new Error('Error al registrar el pago de comisión');
    }

    return await response.json() as MovimientoCaja;
  } catch (error) {
    console.error('Error al pagar comisión:', error);
    throw error;
  }
};

export const liquidarComision = async (comision: PagoDeComisiones): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.PAGO_COMISIONES}/${comision.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medicoId: comision.medicoId,
        fechaDePago: comision.fechaDePago,
        metodoDePago: comision.metodoDePago,
        monto: comision.monto,
        cierreDeCajaId: -1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al liquidar la comisión');
    }
  } catch (error) {
    console.error('Error al liquidar comisión:', error);
    throw error;
  }
};
