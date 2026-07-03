import CalendarTurnos from "../components/Turnos/TurnoCalendar";

const Turnos: React.FC = () => {
  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex items-center gap-1 px-4 py-1 -mt-2 -ml-4">
        <span className="text-navegacion">Turnos</span>
      </div>

      <div className="w-full mt-4" />

      <CalendarTurnos />
    </div>
  );
};

export default Turnos;
