import React from 'react';
import negativo from "../../assets/negativo.svg";

interface Props {
  comisionesARS: number;
}

const formatearMonto = (monto: number) =>
  monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

const TotalComisionesCard: React.FC<Props> = ({ comisionesARS }) => {
  return (
    <div className="w-[267px] h-[200px] p-4 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Comisiones
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <img src={negativo} alt="Ícono monto" className="w-4 h-4" />
          <span
            className="text-xl font-poppins font-medium leading-[33.6px]"
            style={{ color: '#A40202' }}
          >
            ARS {formatearMonto(comisionesARS)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalComisionesCard;