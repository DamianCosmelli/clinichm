import TableListados from '../common/TableListados';
import { Producto } from '../../models/CierreCajaInfo';
import { useState } from 'react';

interface Props {
  productosConsumidos: Producto[];
}

const ProductosCierreCard: React.FC<Props> = ({ productosConsumidos }) => {
    const [medicoSeleccionado, setMedicoSeleccionado] = useState<string>('');

  // Obtener lista única de médicos
  const medicosUnicos = Array.from(
    new Set(productosConsumidos.map(p => p.medico ?? '').filter(Boolean))
  );

 // Filtrar productos según el médico seleccionado
  const productosFiltrados = medicoSeleccionado
    ? productosConsumidos.filter(p => p.medico === medicoSeleccionado)
    : productosConsumidos;

  return (
    <div className="w-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Productos empleados por médicos
      </div>
      <div className="w-full flex max-w-xs gap-2">
        <label className='font-poppins text-center mt-2'>Medico:</label>
        <select
          value={medicoSeleccionado}
          onChange={(e) => setMedicoSeleccionado(e.target.value)}
          className="w-full p-2 border border-[#D4D4D4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        >
          <option value="">Todos los médicos</option>
          {medicosUnicos.map((medico) => (
            <option key={medico} value={medico}>
              {medico}
            </option>
          ))}
        </select>
      </div>
      <TableListados
        headers={['Nombre y Apellido', 'Producto','Cantidad', 'Fecha']}
        rows={productosFiltrados.map((productos) => ({
          'Nombre y Apellido': productos.medico ?? '',
          'Producto': productos.producto ?? '',
          'Cantidad': productos.cantProd ?? '',
          'Fecha': productos.fecha ? new Date(productos.fecha).toLocaleDateString('es-ES'):'',
        }))}
        showTooltip={false}
      />
    </div>
  );
};

export default ProductosCierreCard;
