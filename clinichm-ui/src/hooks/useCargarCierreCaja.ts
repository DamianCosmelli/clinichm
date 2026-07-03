import { useEffect, useState } from 'react';
import { fetchMovimientosCaja } from '../services/MovimientoCajaService';
import { fetchMediosDePago } from '../services/mediosDePagoService';
import { ListaEmpleados } from '../services/empleadosService';
import { MovimientoCaja } from '../models/MovimientoCaja';

interface CierreCajaState {
  ingresosARS: number;
  ingresosUSD: number;
  gastosARS: number;
  totalEfectivo: number;
  ingresosPorMedio: Record<string, number>;
  gastosEmpleados: { nombre: string; motivo: string; monto: number }[];
}

const useCargarCierreCaja = (idCierreCaja: number = 0): CierreCajaState => {
  const [ingresosARS, setIngresosARS] = useState(0);
  const [ingresosUSD, setIngresosUSD] = useState(0);
  const [gastosARS, setGastosARS] = useState(0);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [ingresosPorMedio, setIngresosPorMedio] = useState<Record<string, number>>({});
  const [gastosEmpleados, setGastosEmpleados] = useState<
    { nombre: string; motivo: string; monto: number }[]
  >([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [movimientos, mediosDePago, empleados] = await Promise.all([
          fetchMovimientosCaja(),
          fetchMediosDePago(),
          ListaEmpleados(),
        ]);

        const empleadosMap = new Map(
          empleados.map((empleado) => [String(empleado.id), empleado.nombre+ ' ' + empleado.apellido])
        );

        const medioPagoMap = new Map(
          mediosDePago.map((medio) => [medio.id, medio.medioPago])
        );

        const ingresosARS = movimientos
          .filter(
            (mov: MovimientoCaja) =>
              mov.tipoMovimiento === 'Cobro' &&
              mov.idCierreCaja === idCierreCaja &&
              medioPagoMap.get(mov.idMedioPago) !== 'Efectivo Dolar'
          )
          .reduce((acc: number, mov: MovimientoCaja) => acc + mov.monto, 0);

        const ingresosUSD = movimientos
          .filter(
            (mov: MovimientoCaja) =>
              mov.tipoMovimiento === 'Cobro' &&
              mov.idCierreCaja === idCierreCaja &&
              medioPagoMap.get(mov.idMedioPago) === 'Efectivo Dolar'
          )
          .reduce((acc: number, mov: MovimientoCaja) => acc + mov.monto, 0);

        const gastosARS = movimientos
          .filter(
            (mov: MovimientoCaja) =>
              mov.tipoMovimiento === 'Retiro' && mov.idCierreCaja === idCierreCaja
          )
          .reduce((acc: number, mov: MovimientoCaja) => acc + mov.monto, 0);

        const totalEfectivo = movimientos
          .filter(
            (mov: MovimientoCaja) =>
              mov.idCierreCaja === idCierreCaja &&
              ((mov.tipoMovimiento === 'Cobro' && medioPagoMap.get(mov.idMedioPago) === 'Efectivo Peso') ||
                mov.tipoMovimiento === 'Retiro')
          )
          .reduce(
            (acc: number, mov: MovimientoCaja) =>
              mov.tipoMovimiento === 'Cobro' ? acc + mov.monto : acc - mov.monto,
            0
          );

        const ingresosPorMedio: Record<string, number> = {
          'Efectivo Dolar': 0,
          'Efectivo Peso': 0,
          'Tarjeta De Credito': 0,
          'Tarjeta De Debito': 0,
          'Transferencia': 0,
        };

        movimientos
          .filter((mov: MovimientoCaja) => mov.tipoMovimiento === 'Cobro' && mov.idCierreCaja === idCierreCaja)
          .forEach((mov: MovimientoCaja) => {
            const medio = medioPagoMap.get(mov.idMedioPago);
            if (medio && ingresosPorMedio[medio] !== undefined) {
              ingresosPorMedio[medio] += mov.monto;
            }
          });

        const gastosEmpleados = movimientos
          .filter(
            (mov: MovimientoCaja) =>
              mov.tipoMovimiento === 'Retiro' &&
              mov.idCierreCaja === idCierreCaja &&
              mov.idEmpleado
          )
          .map((mov: MovimientoCaja) => ({
            nombre: empleadosMap.get(mov.idEmpleado != null ? String(mov.idEmpleado) : '') || 'Desconocido',
            motivo: mov.descripcionRetiro || 'Sin motivo',
            monto: mov.monto,
          }));

        setIngresosARS(ingresosARS);
        setIngresosUSD(ingresosUSD);
        setGastosARS(gastosARS);
        setTotalEfectivo(totalEfectivo);
        setIngresosPorMedio(ingresosPorMedio);
        setGastosEmpleados(gastosEmpleados);
      } catch (error) {
        console.error('Error al cargar datos de cierre de caja:', error);
      }
    };

    cargarDatos();
  }, [idCierreCaja]);

  return { ingresosARS, ingresosUSD, gastosARS, totalEfectivo, ingresosPorMedio, gastosEmpleados };
};

export default useCargarCierreCaja;
