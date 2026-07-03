import React from "react";
import "../../styles/loading.css";

const Loading: React.FC = () => {
  return (
    <div className="w-full h-full p-8 rounded-lg border border-[var(--Neutral-7A7979,#7A7979)] bg-[var(--Neutral-FBFBFB,#FBFBFB)] flex flex-col justify-center items-center gap-16">
      <div className="flex flex-col justify-start items-center gap-8">
        {/* Spinner animado más grueso */}
        <div className="w-20 h-20 border-8 border-t-[#85673B] border-[#D69E41] rounded-full animate-spin-slow"></div>
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <div className="flex flex-col justify-start items-center gap-4 w-[418px] px-2">
            <div className="text-[#111111] text-2xl font-medium leading-[33.6px] font-['Poppins'] break-words">
              Estamos preparando el sitio...
            </div>
          </div>
          <div className="w-full text-center text-[#111111] text-xl font-normal leading-7 font-['Poppins'] break-words">
            Solo tomará unos segundos.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
