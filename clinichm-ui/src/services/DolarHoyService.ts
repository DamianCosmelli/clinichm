const API_URL = 'https://dolarapi.com/v1/dolares/blue';

export const obtenerCotizacionDolar = async (): Promise<number | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener la cotización del dólar');
    }
    const data = await response.json();
    return data?.venta || null; // Retorna el valor de venta del dólar blue
  } catch (error) {
    console.error('Error al obtener la cotización del dólar:', error);
    return null;
  }
};
