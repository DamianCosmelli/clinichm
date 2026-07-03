import { Calendar, dayjsLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useContext, useEffect, useState } from "react";
import "dayjs/locale/es";
import dayjs from "dayjs";
import EventoRecepcion from "./EventoRecepcion";
import Dropdown from "../common/Dropdown";
import { useCargarDropdownRecepCalendar } from "../../hooks/useCargarDropdownRecepCalendar";
import {
  startOfWeek,
  //endOfWeek,
  startOfMonth,
  //endOfMonth,
  startOfDay,
  //endOfDay,
} from "date-fns";
import { ListaRecepcionFecha } from "../../services/recepcionPacientesService";
import IconoBuscar from "../../assets/search-rounded.svg";
//import iconCheckSelected from "../../assets/icon-check.svg";
import RecepcionCard from "./RecepcionCard";
import Loading from "../../pages/common/Loading";
import BotonConIcono from "../common/BotonConIcono";
import { useNavigate } from "react-router-dom";
import iconoPlus from '../../assets/icon-plus-line.svg';
import { mapRecepcionToEvento } from "../../mappers/mapRecepcionToEvento";
import { EventoRecepcionCalendar } from "../../models/EventoRecepcionCalendar";
import { medicosDisponiblesAgenda } from "../../services/agendaService";
import { ListaMedicos } from "../../services/medicosService";
import { Medico } from "../../models/Medico";
import { AuthContext } from '../../utils/authContext'; // Importar el contexto de autenticación
import { ROLES } from '../../utils/roles';

dayjs.locale("es");
  

const localizer = dayjsLocalizer(dayjs);

const CalendarRecepcion: React.FC = () => {
  const [events, setEvents] = useState<EventoRecepcionCalendar[]>([]);
  const [allEvents, setAllEvents] = useState<EventoRecepcionCalendar[]>([]);
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(new Date());
  const { opcionesEstados,opcionesPiso, opcionesSucursales } =
    useCargarDropdownRecepCalendar();
const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    //sucursal: "Todas las Sedes",
    // Establece el filtro de sucursal según el rol del usuario
    sucursal:user?.role !== ROLES.ADMIN
        ? user?.sucursal ?? "Todas las Sedes"
        : "Todas las Sedes",
    piso: "Todos los Pisos",
    estado: "Todos los Estados",
    search: "",
  });

  // Estado para el evento seleccionado y el modal
  const [eventoSeleccionado, setEventoSeleccionado] =
    useState<EventoRecepcionCalendar | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true); //loading de Turnos
  const [medicosDisponibles, setMedicosDisponibles] = useState<Medico[]>([]); // Estado para almacenar los médicos disponibles
  const [grupos, setGrupos] = useState<{ id: string; medico: string }[]>([]);
  // Manejador de evento al hacer clic en un evento
  const handleEventoClick = (evento: EventoRecepcionCalendar) => {
    setEventoSeleccionado(evento);
    setMostrarModal(true);
  };

  /**** Obtener Recepcion [INICIO] ****/
  useEffect(() => {
    const fetchEvents = async () => {
      try{
      const start: Date = getStartDateForView(date, view);
      //const end: Date = getEndDateForView(date, view);
      const response = await ListaRecepcionFecha(start);
      const events: EventoRecepcionCalendar[] = await Promise.all(
        response.map(mapRecepcionToEvento)
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

  /**** Obtener Turnos [FIN] ****/

  /***Filtrar eventos según los filtros seleccionados [INICIO] */

  useEffect(() => {
    const eventosFiltrados = allEvents.filter((evento) => {
      const coincideSucursal =
        filters.sucursal === "Todas las Sedes" ||
        evento.sucursal === filters.sucursal;

      const coincidePiso =
        filters.piso === "Todos los Pisos" ||
        evento.piso === filters.piso;

      const coincideEstado =
        filters.estado === "Todos los Estados" ||
        evento.estado === filters.estado;

      const coincideNombreOrDNI =
        filters.search === "" ||
        evento.pacienteDNI.match(filters.search) ||
        evento.paciente.toLowerCase().match(filters.search) ;

      return (
        coincideSucursal && coincidePiso && coincideEstado && coincideNombreOrDNI
      );
    });

    setEvents(eventosFiltrados);
  }, [filters, allEvents]);

  /***Filtrar eventos según los filtros seleccionados [FIN] */

  /** Manejo de listado de medicos segun agenda [INICIO] */

    const fetchMedicoAgendaIds = async (
    fecha: Date,
    hora: number,
    sede: number
  ): Promise<number[]> => {
    try {
      const data = await medicosDisponiblesAgenda(fecha, hora, sede);
      return Array.isArray(data) ? data.map((item) => item.medicoId) : [];
    } catch (error) {
      console.error("Error al cargar los médicos disponibles:", error);
      return [];
    }
  };

  useEffect(() => {
        const fetchMedicos = async () => {
          const fechaValor = date; 
          const horarioValor = "9";
          const sedeValor = opcionesSucursales.find((s) => s.nombre === filters.sucursal)?.id;
    
          if (fechaValor && horarioValor && sedeValor) {
            const idsPermitidos = await fetchMedicoAgendaIds(
              new Date(fechaValor),
              parseInt(horarioValor),
              parseInt(sedeValor.toString())
            );
            const medicos = await ListaMedicos();
            const idsSet = new Set(idsPermitidos.map((id) => Number(id)));
            // Filtrar los médicos disponibles según los IDs permitidos
            const nuevosMedicos = medicos.filter((medico) =>
              idsSet.has(Number(medico.id))
            );

            // ordena medicos
            nuevosMedicos.sort((a, b) => Number(a.id) - Number(b.id)); 

            // Agregar el médico obligatorio (id 1) a la lista de médicos disponibles
            const medicoObligatorio = medicos.find(
              (medico) => Number(medico.id) === 1); 
              nuevosMedicos.push(medicoObligatorio!);
    
            setMedicosDisponibles(nuevosMedicos);
          } 
        };
    
        fetchMedicos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [date, filters.sucursal]);


  // Extraer grupos únicos de médicos
 useEffect(() => {
  let nuevosGrupos: { id: string; medico: string }[] = [];

if (filters.sucursal === "Todas las Sedes") {
    // Obtener todos los médicos únicos
    const medicosUnicos = Array.from(new Set(events.map((e) => e.medico)));
    
    // Filtrar el equipo médico
    const medicoEspecial = "Equipo Medico";
    const medicosFiltrados = medicosUnicos.filter(medico => medico !== medicoEspecial);
    
    // Crear el array con el equipo médico al final
    nuevosGrupos = [
      ...medicosFiltrados.map(medico => ({
        id: medico,
        medico: medico,
      })),
      {
        id: medicoEspecial,
        medico: medicoEspecial,
      }
    ];
  } else {
    nuevosGrupos = Array.from(
      new Set(
        medicosDisponibles
          .map((e) => `${e.nombre} ${e.apellido}`)
      )
    ).map((medico) => ({
      id: medico,
      medico: medico,
    }));
  }
  setGrupos(nuevosGrupos);
}, [filters, events, medicosDisponibles]);

 /** Manejo de listado de medicos segun agenda [FIN] */
 
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
        label="Nueva Atencion"
        onClick={() => navigate('/nueva-atencion')}
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

          {/*<div className="h-10 bg-neutral-50 rounded outline outline-offset-[-1px] outline-neutral-900 inline-flex justify-start items-center">
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
          </div>*/}
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
            disabled={user?.role !== ROLES.ADMIN ? true : false}
          />

          <Dropdown
            options={[
              "Todos los Pisos",
              ...opcionesPiso.map((s) => s.piso),
            ]} 
            placeholder="Seleccione Piso"
            onChange={(e) => handleFilterChange("piso", e)}
            className="input-filters"
            value={filters.piso}
          />

          <Dropdown
            options={[
              "Todos los Estados",
              ...opcionesEstados.map((s) => s.estado),
            ]} 
            placeholder="Seleccione Estado"
            onChange={(e) => handleFilterChange("estado", e)}
            className="input-filters"
            value={filters.estado}
          />

          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar por Nombre o DNI"
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

        {/* Grupos de medicos [INICIO] */}
        {view === "day" && (
        <div className="w-full bg-neutral-300 rounded-tl-[10px] rounded-tr-[10px]"
        style={{ display: "grid", gridTemplateColumns: `repeat(${grupos.length}, 1fr)` }}
        >
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="text-center text-neutral-900 text-sm font-semibold font-['Poppins'] leading-tight py-4"
            >
              {grupo.medico}
            </div>
          ))}
        </div>
        )}
        {/* Grupos de medicos [FIN] */}

      </div>
      {/* HEADER + FILTROS [FIN]*/}
      {/* CALENDARIO CON SCROLL [INICIO] */}
      <div className="flex-1 overflow-auto min-h-0">
        <div
          className={`h-[850px] ${view !== "day" ? "hide-time-gutter" : ""}`}
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
              event: (props) => <EventoRecepcion {...props} view={view} />,
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
            <RecepcionCard
              recepcion={eventoSeleccionado}
              onClose={() => setMostrarModal(false)}
            />
          </div>
        </div>
      )}
      {/* MODAL [FIN] */}
    </div>)}
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

{/*const getEndDateForView = (date: Date, view: View): Date => {
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
};*/}
const customEventStyleGetter = () => {
  return {
    className: "hide-event-label",
    style: {
      minHeight: '35px', // o cualquier valor que prefieras
      backgroundColor: 'transparent', // O cualquier color que prefieras
      border: 'none', // Elimina el borde
      boxShadow: 'none', // A veces queda una sombra residual
      color: '#000', // Color del texto si lo querés especificar
      padding: 0,  
    },
  };
};
/** FUNCIONES EXTAS [FIN] */

export default CalendarRecepcion;
