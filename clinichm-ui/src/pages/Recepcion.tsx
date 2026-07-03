import React from "react";
import CalendarRecepcion from "../components/Recepcion/RecepcionCalendar";

const Recepcion: React.FC = () => {
  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex items-center gap-1 px-4 py-1 -mt-2 -ml-4">
        <span className="text-navegacion">Recepcion</span>
      </div>

      <div className="w-full mt-4" />

      <CalendarRecepcion />
    </div>
  );
};

export default Recepcion;
