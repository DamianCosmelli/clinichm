import React from 'react';
import positivo from "../../assets/positivo.svg";
import negativo from "../../assets/negativo.svg";

interface Props {
  gastosARS: number;
}

const GastosTotalesCard: React.FC<Props> = ({ gastosARS }) => {
  const getMontoColor = (monto: number) => (monto >= 0 ? '#005B4B' : '#A40202');
  const getMontoIcon = (monto: number) =>
    monto >= 0 ? positivo : negativo;

  return (
    <div className="w-[267px] h-[200px] p-4 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Gastos totales
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <img src={getMontoIcon(-gastosARS)} alt="Ícono monto" className="w-4 h-4" />
          <span
            className="text-xl font-poppins font-medium leading-[33.6px]"
            style={{ color: getMontoColor(-gastosARS) }}
          >
            ARS {gastosARS.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GastosTotalesCard;
