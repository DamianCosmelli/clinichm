import React, { useEffect, useState } from 'react';
import { ListaStock } from '../../../services/stockService';
import { Stock } from '../../../models/Stock';
import { ListaProductos } from '../../../services/productosService';
import { Producto } from '../../../models/Producto';
import useCargarDatosMedicos from '../../../hooks/useCargarDatosMedicos';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import TableListados from '../../../components/common/TableListados';
import Loading from '../../common/Loading';

const ConsultaVencimientos: React.FC = () => {
  const { sucursales } = useCargarDatosMedicos();
  const [filtro, setFiltro] = useState({ sede: '', meses: 1, buscar: '' });
  const [stock, setStock] = useState<Stock[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [stockData, productosData] = await Promise.all([ListaStock(), ListaProductos()]);
      setStock(stockData);
      setProductos(productosData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Obtener nombre del producto por productoId
  const getNombreProducto = (productoId: number) =>
    productos.find((p) => p.id === productoId)?.nombre || 'N/A';

  // Filtrado
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const stockFiltrado = stock
    .filter((item) => item.cantidadExistente > 0)
    .filter((item) => !filtro.sede || item.deposito === filtro.sede)
    .filter((item) => {
      if (!item.vencimiento) return false;
      const fechaVenc = new Date(item.vencimiento);
      const inicio = new Date(hoy);
      if (Number(filtro.meses) === 1) {
        // Desde hoy hasta el mismo día del mes siguiente (inclusive)
        const fin = new Date(hoy);
        fin.setMonth(fin.getMonth() + 1);
        fin.setHours(23, 59, 59, 999);
        return fechaVenc >= inicio && fechaVenc <= fin;
      } else {
        // Estrictamente entre la fecha actual + (N-1) meses y la fecha actual + N meses
        const desde = new Date(hoy);
        desde.setMonth(desde.getMonth() + Number(filtro.meses) - 1);
        // El rango es: (desde, hasta]
        const hasta = new Date(hoy);
        hasta.setMonth(hasta.getMonth() + Number(filtro.meses));
        hasta.setHours(23, 59, 59, 999);
        return fechaVenc > desde && fechaVenc <= hasta;
      }
    })
    .filter((item) => {
      const nombreProducto = getNombreProducto(item.productoId).toLowerCase();
      const lote = (item.lote || '').toLowerCase();
      const vencimiento = (item.vencimiento || '').toLowerCase();
      const buscar = filtro.buscar.toLowerCase();
      return (
        !filtro.buscar ||
        nombreProducto.includes(buscar) ||
        lote.includes(buscar) ||
        vencimiento.includes(buscar)
      );
    });

  const headers = [
    'Producto',
    'Cantidad Existente',
    'Ingreso',
    'Vencimiento',
    'Lote',
    'Deposito',
    '',
  ];

  const rows = stockFiltrado.map((item) => ({
    id: item.id,
    Producto: <span className="font-bold">{getNombreProducto(item.productoId)}</span>,
    'Cantidad Existente': item.cantidadExistente,
    Ingreso: item.fechaIngreso,
    Vencimiento: item.vencimiento,
    Lote: item.lote,
    Deposito: item.deposito,
    "": null,
  }));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-6 items-center justify-center">
        {/* Filtro sede */}
        <div className="dropdown-caja ">
          <select
            className="dropdown-select font-poppins w-full"
            value={filtro.sede}
            onChange={(e) => setFiltro({ ...filtro, sede: e.target.value })}
          >
            <option value="">Seleccione un depósito</option>
            <option value="Deposito Principal">Deposito Principal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.nombre}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro meses */}
        <div className="dropdown-caja">
          <label className="mr-2 text-sm font-poppins text-black">Meses: </label>
          <input
            type="number"
            className="w-full text-sm font-poppins bg-transparent focus:outline-none"
            placeholder="Cantidad"
            value={filtro.meses}
            min={1}
            max={12}
            onChange={(e) => {
              const value = Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 12);
              setFiltro({ ...filtro, meses: value });
            }}
          />
        </div>
        {/* Buscador */}
        <div className="dropdown-caja">
          <div className="relative">
            <input
              type="text"
              className="dropdown-select pr-10"
              placeholder="Buscar"
              value={filtro.buscar}
              onChange={(e) => setFiltro({ ...filtro, buscar: e.target.value })}
            />
            <img
              src={iconoBuscar}
              alt="Buscar"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          </div>
        </div>
      </div>
      <TableListados headers={headers} rows={rows} />
    </div>
  );
};

export default ConsultaVencimientos;




