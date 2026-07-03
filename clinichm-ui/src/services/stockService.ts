import { ENDPOINTS } from '../api/endpoints';
import { Stock } from '../models/Stock';
import { apiService } from '../api/apiService';

export const ListaStock = async (): Promise<Stock[]> => {
  try {
    const response = await apiService(ENDPOINTS.STOCK, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el stock');
    }

    const data = await response.json();

    return data.map((item: Stock) => ({
      id: item.id,
      productoId: item.productoId,
      lote: item.lote,
      vencimiento: item.vencimiento,
      cantidadIngreso: item.cantidadIngreso,
      cantidadExistente: item.cantidadExistente,
      fechaIngreso: item.fechaIngreso,
      deposito: item.deposito,
      tipoOperacion: item.tipoOperacion, 
    }));
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    throw error;
  }
};

export const obtenerStockPorId = async (stockId: number): Promise<Stock> => {
  try {
    const response = await apiService(`${ENDPOINTS.STOCK}/${stockId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener stock: ${errorText}`);
    }
    const data = await response.json();
    return data as Stock;
  } catch (error) {
    console.error('Error al obtener stock:', error);
    throw error;
  }
};

export const crearStock = async (stock: Partial<Stock>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.STOCK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      throw new Error('Error al crear el stock');
    }
  } catch (error) {
    console.error('Error al crear el stock:', error);
    throw error;
  }
};

export const actualizarStock = async (stockId: number, stock: Partial<Stock>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.STOCK}/${stockId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el stock');
    }
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    throw error;
  }
};

export const transferirStock = async (
  stockOrigen: Stock,
  cantidadTransferir: number,
  depositoDestino: string,
  fechaEgreso: string
): Promise<Stock[]> => {
  // 1. Buscar si existe un stock en el destino con mismo producto y lote
  const todosStocks = await ListaStock();
  const stockDestino = todosStocks.find(
    (s) =>
      s.productoId === stockOrigen.productoId &&
      s.lote === stockOrigen.lote &&
      s.deposito === depositoDestino
  );

  // 2. Actualizar stock origen (restar cantidad)
  const nuevoStockOrigen = {
    ...stockOrigen,
    cantidadExistente: stockOrigen.cantidadExistente - cantidadTransferir,
    
  };
  await actualizarStock(stockOrigen.id, nuevoStockOrigen);

  // 3. Actualizar o crear stock destino
  if (stockDestino) {
    // Sumar cantidad al existente, mantener tipoOperacion original del destino
    const nuevoStockDestino = {
      ...stockDestino,
      cantidadExistente: stockDestino.cantidadExistente + cantidadTransferir,
      cantidadIngreso: stockDestino.cantidadIngreso + cantidadTransferir, // sumar también en cantidadIngreso
    };
    await actualizarStock(stockDestino.id, nuevoStockDestino);
  } else {
    // Crear nuevo stock en el destino con tipoOperacion "Transferencia"
    const nuevoStock = {
      ...stockOrigen,
      id: undefined, 
      deposito: depositoDestino,
      cantidadIngreso: cantidadTransferir,
      cantidadExistente: cantidadTransferir,
      fechaIngreso: fechaEgreso,
      tipoOperacion: "Transferencia", 
    };
    await crearStock(nuevoStock);
  }

  // 4. Retornar la nueva lista de stocks para refrescar la UI
  return await ListaStock();
};
export const generarReporteStock = async (): Promise<Blob> => {
  try {
    const response = await apiService(`${ENDPOINTS.STOCK}/reporte`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      throw new Error('Error al generar el reporte de stock');
    }

    return await response.blob(); // Retornar el archivo como Blob
  } catch (error) {
    console.error('Error al generar el informe reporte de stock:', error);
    throw error;
  }
};
