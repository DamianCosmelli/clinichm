import { Calendar, dayjsLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "dayjs/locale/es";
import dayjs from "dayjs";
import EventoAgenda from "./EventoAgenda";
import Dropdown from "../common/Dropdown";
import { useCargarDropdownAgendaCalendar } from "../../hooks/useCargarDropdownAgendaCalendar";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ListaAgendaFecha } from "../../services/agendaFechaService";
import { mapAgendaToEvento } from "../../mappers/mapAgendaToEvento";
import { EventoAgendaCalendar } from "../../models/EventoAgendaCalendar";
import IconoBuscar from "../../assets/search-rounded.svg";
import iconCheckSelected from "../../assets/icon-check.svg";
import AgendaCard from "./AgendaCard";
import Loading from "../../pages/common/Loading";
import { useNavigate } from 'react-router-dom';
import BotonConIcono from "../common/BotonConIcono";
import iconoPlus from  "../../assets/icon-plus-line.svg";

dayjs.locale("es");

const localizer = dayjsLocalizer(dayjs);

const CalendarAgenda: React.FC = () => {
  const [events, setEvents] = useState<EventoAgendaCalendar[]>([]);
  const [allEvents, setAllEvents] = useState<EventoAgendaCalendar[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const { opcionesMedicos, opcionesSucursales } =
    useCargarDropdownAgendaCalendar();
    
    const navigate = useNavigate();

  const [filters, setFilters] = useState({
    sucursal: "Todas las Sedes",
    medico: "Todos los Profesionales",
    search: "",
  });

  // Estado para el evento seleccionado y el modal
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<EventoAgendaCalendar | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true); //loading de Agenda

  // Manejador de evento al hacer clic en un evento
  const handleEventoClick = (evento: EventoAgendaCalendar) => {
    setEventoSeleccionado(evento);
    setMostrarModal(true);
  };

  /**** Obtener AgendaMedica [INICIO] ****/
  useEffect(() => {
    const fetchEvents = async () => {
      try {
      const start: Date = getStartDateForView(date, view);
      const end: Date = getEndDateForView(date, view);
      const response = await ListaAgendaFecha(start, end);
      const events: EventoAgendaCalendar[] = await Promise.all(
        response.map(mapAgendaToEvento)
      );
      setAllEvents(events);
    }catch (error) {
      console.error("Error cargando eventos", error);
    } finally {
      setLoading(false); 
    }
  };

    fetchEvents();
  }, [date, view]);

  /**** Obtener AgendaMedica [FIN] ****/

  /***Filtrar eventos según los filtros seleccionados [INICIO] */

  useEffect(() => {
    const eventosFiltrados = allEvents.filter((evento) => {
      const coincideSucursal =
        filters.sucursal === "Todas las Sedes" ||
        evento.sucursal === filters.sucursal;

      const coincideMedico =
        filters.medico === "Todos los Profesionales" ||
        evento.medico === filters.medico;

      const coincideHora =
        filters.search === "" ||
        dayjs(evento.start).format("HH:mm").includes(filters.search);

      return (
        coincideSucursal && coincideMedico && coincideHora
      );
    });

    setEvents(eventosFiltrados);
  }, [filters, allEvents]);

  /***Filtrar eventos según los filtros seleccionados [FIN] */

    // Extraer grupos únicos de médicos
    const grupos = Array.from(new Set(events.map((e) => e.medico))).map(
      (medico) => ({
        id: medico,
        medico: medico,
      })
    );

  //manejador de filtro de eventos
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /* Funciones para formateo de fecha [INICIO]*/

  const formatDate = (date: Date): string => {
    if (view === "month" || view === "week") {
      return date
        .toLocaleDateString("es-AR", {
          month: "long",
          year: "numeric",
        })
        .replace("de", "");
    }
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateAgenda = (date: Date): string => {
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
    });
  };

  /* Funciones para formateo de fecha [FIN]*/

  return (
    <>
    {loading ? (
      <Loading />
    ) : (
    <div className="w-full h-[calc(87vh-60px)] p-4 bg-fondo-contenedor rounded-[12px] flex flex-col">
      {/* HEADER + FILTROS [INICIO] */}
      <BotonConIcono
        label="Nueva agenda"
        onClick={() => navigate('/nueva-agenda')}
        iconSrc={iconoPlus}
        className="absolute top-0 right-0 -mt-2 mr-1" 
      />

      <div className="flex flex-col gap-2 mb-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (view === "month") {
                  setDate(dayjs(date).subtract(1, "month").toDate());
                } else if (view === "week") {
                  setDate(dayjs(date).subtract(1, "week").toDate());
                } else {
                  setDate(dayjs(date).subtract(1, "day").toDate());
                }
              }}
            >
              &lt;
            </button>
            <h2 className="text-lg font-semibold capitalize whitespace-nowrap">
              {formatDate(date)}
            </h2>
            <button
              onClick={() => {
                if (view === "month") {
                  setDate(dayjs(date).add(1, "month").toDate());
                } else if (view === "week") {
                  setDate(dayjs(date).add(1, "week").toDate());
                } else {
                  setDate(dayjs(date).add(1, "day").toDate());
                }
              }}
            >
              &gt;
            </button>
          </div>

          <div className="h-10 bg-neutral-50 rounded outline outline-offset-[-1px] outline-neutral-900 inline-flex justify-start items-center">
            {["month", "week", "day"].map((v) => {
              const isSelected = view === v;
              return (
                <div
                  key={v}
                  onClick={() => setView(v as View)}
                  className={`w-24 h-10 px-1.5 rounded-tl rounded-bl border-r border-neutral-900 flex justify-center items-center ${
                    isSelected ? "bg-gray-300 font-semibold gap-2.5" : ""
                  }`}
                >
                  {isSelected && (
                    <div className="w-5 h-5 relative flex items-center justify-center">
                      <img
                        src={iconCheckSelected}
                        alt="Icono"
                        className="w-4 h-4"
                      />
                    </div>
                  )}

                  <div
                    className={`text-neutral-900 text-sm font-normal font-['Poppins'] leading-tight ${
                      !isSelected ? "text-center w-full" : ""
                    }`}
                  >
                    {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Filtros [INICIO] */}
        <div className="flex flex-wrap mb-4 items-center">
          <Dropdown
            options={[
              "Todas las Sedes",
              ...opcionesSucursales.map((s) => s.nombre),
            ]} 
            placeholder="Seleccione Sede"
            onChange={(e) => handleFilterChange("sucursal", e)}
            className="input-filters"
            value={filters.sucursal}
          />

          <Dropdown
            options={[
              "Todos los Profesionales",
              ...opcionesMedicos.map((s) => s.nombre),
            ]} 
            placeholder="Seleccione Profesional"
            onChange={(e) => handleFilterChange("medico", e)}
            className="input-filters"
            value={filters.medico}
          />

          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar por hora"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="input-hora w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <img
                src={IconoBuscar}
                alt="Buscar"
                className="h-6 w-6" // Tamaño del icono
              />
            </div>
          </div>
        </div>
          {/* Filtros [FIN] */}

      </div>
      {/* HEADER + FILTROS [FIN]*/}
      {/* CALENDARIO CON SCROLL [INICIO] */}
      <div className="flex-1 overflow-auto min-h-0">
        <div
          className={`h-[700px]`} //en este calendario se ve en semana la columna de la hora
        >
          <Calendar
            eventPropGetter={customEventStyleGetter}
            onSelectEvent={handleEventoClick}
            localizer={localizer!}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
            view={view}
            onView={setView}
            date={date}
            min={new Date(2025, 3, 1, 8, 0)}
            max={new Date(2025, 3, 1, 20, 0)}
            onNavigate={setDate}
            toolbar={false}
            {...(view === "day"
              ? {
                  resources: grupos,
                  resourceIdAccessor: "id",
                  resourceTitleAccessor: "medico",
                  resourceAccessor: "medico",
                }
              : {})}
            messages={{
              noEventsInRange: "No hay eventos en este rango.",
              week: "Semana",
              work_week: "Semana laboral",
              day: "Día",
              month: "Mes",
              previous: "Anterior",
              next: "Siguiente",
              today: "Hoy",
            }}
            formats={{
              dayFormat: (date, culture) =>
                localizer!.format(date, "dddd D", culture),
              timeGutterFormat: (date, culture) =>
                localizer!.format(date, "HH:mm", culture),
            }}
            components={{
              resourceHeader: view === "day" ? () => null : undefined, // Ocultar encabezado de recursos en vista de día
              event: (props) => <EventoAgenda {...props} view={view} />,
              timeGutterHeader: () =>
                view === "day" ? (
                  <span className="self-stretch h-5 text-center justify-start text-neutral-900 text-sm font-semibold font-['Poppins'] leading-tight">
                    {formatDateAgenda(date)}
                  </span>
                ) : null,

              timeGutterWrapper: (props: { children?: React.ReactNode }) => (
                <div className="bg-gray-100 text-gray-900 text-sm h-full">
                  {props.children}
                </div>
              ),
            }}
          />
        </div>
      </div>
      {/* CALENDARIO CON SCROLL [FIN] */}

      {/* MODAL [INICIO] */}
      {mostrarModal && eventoSeleccionado && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white max-h-full overflow-y-auto rounded-xl shadow-lg p-4">
            <AgendaCard
              agenda={eventoSeleccionado}
              onClose={() => setMostrarModal(false)}
            />
          </div>
        </div>
      )}
      {/* MODAL [FIN] */}
    </div> )}
    </>
  );
};

/** FUNCIONES EXTAS [INICIO] */
const getStartDateForView = (date: Date, view: View): Date => {
  switch (view) {
    case "week":
      return startOfWeek(date, { weekStartsOn: 1 });
    case "day":
      return startOfDay(date);
    case "agenda":
    case "month":
    default:
      return startOfMonth(date);
  }
};

const getEndDateForView = (date: Date, view: View): Date => {
  switch (view) {
    case "week":
      return endOfWeek(date, { weekStartsOn: 1 });
    case "day":
      return endOfDay(date);
    case "agenda":
    case "month":
    default:
      return endOfMonth(date);
  }
};
const customEventStyleGetter = () => {
  return {
    className: "hide-event-label",
    style: {
      backgroundColor: 'transparent', // O cualquier color que prefieras
      border: 'none', // Elimina el borde
      boxShadow: 'none', // A veces queda una sombra residual
      color: '#000', // Color del texto si lo querés especificar
      padding: 0,
      
    },
  };
};
/** FUNCIONES EXTAS [FIN] */

export default CalendarAgenda;
