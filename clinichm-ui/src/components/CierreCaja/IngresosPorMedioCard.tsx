import React from 'react';

interface Props {
  ingresosPorMedio: Record<string, number>;
}

const IngresosPorMedioCard: React.FC<Props> = ({ ingresosPorMedio }) => {
  return (
    <div className="w-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Ingresos por medios de pago
      </div>
      <div className="w-full flex justify-between items-center gap-6">
        {Object.entries(ingresosPorMedio).map(([medio, monto]) => (
          <div
            key={medio}
            className="flex flex-col justify-start items-center gap-2"
          >
            <div className="text-[#111111] text-base font-poppins font-semibold leading-[22.4px]">
              {medio}
            </div>
            <div className="text-[#111111] text-base font-poppins font-normal leading-[22.4px]">
              {medio === 'Efectivo Dolar' ? `u$s ${monto.toFixed(2)}` : `$ ${monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngresosPorMedioCard;
