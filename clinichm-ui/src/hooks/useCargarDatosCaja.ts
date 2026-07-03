import { useEffect, useState } from 'react';
import { fetchMovimientosCaja } from '../services/MovimientoCajaService';
import { fetchMediosDePago } from '../services/mediosDePagoService';
import { ListaSucursales } from '../services/sucursalesService';
import { fetchCierresCaja } from '../services/cierreCajaService';
import type { MovimientoCaja } from '../models/MovimientoCaja';
import type { MedioDePago } from '../models/MedioDePago';
import type { CierreCaja } from '../models/CierreCaja';

interface DatosCaja {
  movimientos: MovimientoCaja[];
  mediosDePago: MedioDePago[];
  sucursales: { id: number; nombre: string }[];
  cierresCaja: CierreCaja[];
  error: string | null;
}

const useCargarDatosCaja = () => {
  const [datos, setDatos] = useState<DatosCaja>({
    movimientos: [],
    mediosDePago: [],
    sucursales: [],
    cierresCaja: [],
    error: null,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [movimientosData, mediosDePagoData, sucursalesData, cierresCajaData] = await Promise.all([
          fetchMovimientosCaja(),
          fetchMediosDePago(),
          ListaSucursales(),
          fetchCierresCaja(),
        ]);

        setDatos({
          movimientos: movimientosData,
          mediosDePago: mediosDePagoData,
          sucursales: sucursalesData,
          cierresCaja: cierresCajaData,
          error: null,
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setDatos((prev) => ({ ...prev, error: 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.' }));
      }
    };

    cargarDatos();
  }, []);

  return datos;
};

export default useCargarDatosCaja;
