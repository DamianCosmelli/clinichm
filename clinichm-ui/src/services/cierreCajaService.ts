import { ENDPOINTS } from '../api/endpoints';
import { CierreCaja } from '../models/CierreCaja';
import { apiService } from '../api/apiService';
import { CierreCajaInfo } from '../models/CierreCajaInfo';

export const fetchCierresCaja = async (): Promise<CierreCaja[]> => {
  try {
    const response = await apiService(ENDPOINTS.CIERRES_CAJA, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al obtener los cierres de caja');
    }

    const data: CierreCaja[] = await response.json();
    return data.map((cierre) => ({
      ...cierre,
      fechaHora: new Date(cierre.fechaHora).toISOString(), // Asegurar formato ISO
    }));
  } catch (error) {
    console.error('Error al obtener los cierres de caja:', error);
    throw error;
  }
};

export const ObtenerCierreCajaInfo = async (id: number): Promise<CierreCajaInfo> => {
  try {
    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/cierre-info/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al obtener la info del cierre de caja');
    }

    const data = await response.json();

    return data;

  } catch (error) {
      console.error('Error al obtener la info del cierre de caja:', error);
      throw error;
  }
};

export const generarInformeCierreCaja = async (id: number): Promise<Blob> => {
  try {
    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/reporte-cierre/${id}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al generar el informe del cierre de caja');
    }

    return await response.blob(); // Retornar el archivo como Blob
  } catch (error) {
    console.error('Error al generar el informe del cierre de caja:', error);
    throw error;
  }
};

export const procesarCierreDiario = async (data: {
  idSucursal: number;
  fechaHora: string;
}): Promise<CierreCaja> => {
  try {
    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/procesar-cierre-diario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al procesar el cierre de caja');
    }

    return response.json(); // Asegurar que devuelve un objeto con 'id'
  } catch (error) {
    console.error('Error al procesar el cierre de caja:', error);
    throw error;
  }
};

export const obtenerCierreCaja = async (id: number): Promise<CierreCaja> => {
  try {
    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al obtener el cierre de caja');
    }

    const data: CierreCaja = await response.json();
    return {
      ...data,
      fechaHora: new Date(data.fechaHora).toISOString(), // Asegurar formato ISO
    };
  } catch (error) {
    console.error('Error al obtener el cierre de caja:', error);
    throw error;
  }
};
export const generarInformeCajaCentral = async (fecha: string): Promise<Blob> => {
  try {
    const query = new URLSearchParams({
      fecha: fecha.substring(0, 10)});

    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/reporte-central?${query}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al generar el informe de caja central');
    }

    return await response.blob(); // Retornar el archivo como Blob
  } catch (error) {
    console.error('Error al generar el informe de caja central:', error);
    throw error;
  }
};

export const cambiarMetodoPagoComision = async (idComision: number): Promise<boolean> => {
  try {
    const response = await apiService(`${ENDPOINTS.CIERRES_CAJA}/cambiar-metodo-pago-comision/${idComision}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al procesar el cambio de pago de comisión');
    }

    return response.json(); // Asegurar que devuelve un objeto con 'id'
  } catch (error) {
    console.error('Error al procesar el cambio de pago de comisión:', error);
    throw error;
  }
};
