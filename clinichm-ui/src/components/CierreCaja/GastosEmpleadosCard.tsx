import React from 'react';
import TableListados from '../common/TableListados';

interface Props {
  gastosEmpleados: { nombre: string; motivo: string; monto: number }[];
}

const GastosEmpleadosCard: React.FC<Props> = ({ gastosEmpleados }) => {
  return (
    <div className="w-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Gastos de Empleados
      </div>
      <TableListados
        headers={['Nombre y Apellido', 'Motivo', 'Monto']}
        rows={gastosEmpleados.map((gasto) => ({
          'Nombre y Apellido': gasto.nombre,
          Motivo: gasto.motivo,
          Monto: `$ ${gasto.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        }))}
        showTooltip={false}
      />
    </div>
  );
};

export default GastosEmpleadosCard;
