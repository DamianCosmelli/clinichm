import React, { useState, useRef } from 'react';
import useCargarDatosMedicos from '../../../hooks/useCargarDatosMedicos';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { obtenerTurnosRangoFecha } from '../../../services/turnosService';
import type { Turno } from '../../../models/Turno';
import iconoInterrogacion from '../../../assets/iconoInterrogacion.svg';
import checkBlanco from '../../../assets/checkBlanco.svg';
import closeBlanco from '../../../assets/closeBlanco.svg';
import callBlanco from '../../../assets/callBlanco.svg';
import groupBlanco from '../../../assets/groupBlanco.svg';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Loading from "../../common/Loading";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TurnosPorPeriodo: React.FC = () => {
  const { sucursales } = useCargarDatosMedicos();
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [rangoFechas, setRangoFechas] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLDivElement>(null);

  // Formatear fechas para mostrar en el input
  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // Cerrar calendario al hacer click fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Llama al endpoint cuando cambia el rango de fechas
  React.useEffect(() => {
    const { startDate, endDate } = rangoFechas[0];
    if (!startDate || !endDate) return;
    // Forzar que si selecciona un solo día, el rango sea de ese día completo
    const desde = new Date(startDate);
    desde.setHours(0, 0, 0, 0);
    const hasta = new Date(endDate);
    hasta.setHours(23, 59, 59, 999);

    if (desde > hasta) {
      setTurnos([]);
      setError('El rango de fechas no es válido.');
      setShowTooltip(true);
      setLoading(false);
      return;
    }
    setError(null);
    setShowTooltip(false);

    const fetchTurnos = async () => {
      try {
        setLoading(true);
        const turnosObtenidos = await obtenerTurnosRangoFecha(desde.toISOString(), hasta.toISOString());
        setTurnos(turnosObtenidos);
      } catch (err: unknown) {
        setTurnos([]);
        setError(err instanceof Error ? err.message : 'Error al obtener turnos');
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  }, [rangoFechas]);

  // Filtrar turnos por sede seleccionada (SucursalId)
  const turnosFiltrados = sedeSeleccionada
    ? turnos.filter(t => String(t.sucursalId) === String(sedeSeleccionada))
    : turnos;

  // Conteo de estados sobre los turnos filtrados
  const total = turnosFiltrados.length;
  const sinConfirmar = turnosFiltrados.filter(t => t.confirmado === false).length;
  const confirmados = turnosFiltrados.filter(t => t.confirmado === true).length;
  const presentes = turnosFiltrados.filter(t => t.asistio === true).length; // Para el gráfico
  const cancelados = turnosFiltrados.filter(t => t.cancelado).length;
  const noEncontrados = turnosFiltrados.filter(t => t.noEncontrado).length;
  const reprogramados = turnosFiltrados.filter(t => t.reprogramado).length;

  // Datos para el gráfico de pastel
  const presentesCount = presentes;
  const ausentesCount = turnosFiltrados.filter(t => t.asistio === false).length;

  const pieData = {
    labels: ['Ausentes', 'Presentes'],
    datasets: [
      {
        data: [ausentesCount, presentesCount],
        backgroundColor: ['#005B4B', '#D69E41'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Aquí se desarrollará el reporte de Turnos por período */}
      <div className="flex gap-4 mb-4 items-end justify-center">
        <div className="dropdown-caja w-1/3">
          <select
            className="dropdown-select font-poppins w-full"
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            <option value="">Seleccione una sede</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="relative" ref={inputRef} style={{ minWidth: 0 }}>
          <input
            type="text"
            className="border rounded px-2 py-1 font-poppins w-60 cursor-pointer bg-white"
            readOnly
            value={`${formatDate(rangoFechas[0].startDate)} - ${formatDate(rangoFechas[0].endDate)}`}
            onClick={() => setShowCalendar(!showCalendar)}
            data-tooltip-id="fecha-tooltip"
            data-tooltip-content={error || ''}
            data-tooltip-place="bottom"
            style={error ? { borderColor: '#85673B' } : {}}
          />
          {showTooltip && error && (
            <ReactTooltip
              id="fecha-tooltip"
              isOpen={showTooltip}
              place="bottom"
              style={{
                background: '#fff',
                color: '#85673B',
                border: '1px solid #85673B',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                zIndex: 50,
                boxShadow: '0 2px 8px #0001',
                padding: '8px 16px',
              }}
              afterHide={() => setShowTooltip(false)}
            />
          )}
          {showCalendar && (
            <div className="absolute z-10 bg-white shadow-lg mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={(item: RangeKeyDict) => setRangoFechas([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={rangoFechas}
                locale={undefined}
              />
            </div>
          )}
        </div>
      </div>
      {/* Conteo de estados - nuevo contenedor estilizado */}
      <div className="w-full h-full p-4 bg-[#FDFDFD] rounded-lg flex flex-col justify-start items-start gap-4">
        {/* Totales */}
        <div className="w-full h-[76px] rounded-[10px] outline-1 outline-[#7A7979] outline-offset-[-1px] flex items-center gap-[130px]">
          <div className="flex-1 h-full pl-4 pr-4 rounded-l-[10px] flex items-center gap-2">
            <div className="flex-1 flex items-end gap-4">
              <div className="w-[231px] flex flex-col gap-3">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">Totales</div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{total}</div>
            </div>
          </div>
        </div>
        {/* Estados */}
        <div className="w-full flex gap-4">
          {/* Sin confirmar */}
          <div className="flex-1 bg-[#FDFDFD] rounded-[10px] outline-1 outline-[#117BA8] flex flex-col">
            <div className="h-[30px] px-2 bg-[#117BA8] rounded-t-[10px] flex items-center gap-2">
              <div className="text-center text-[#FBFBFB] text-[14px] font-poppins font-semibold leading-[19.6px]">Sin confirmar</div>
            </div>
            <div className="p-2 flex justify-between items-center">
              <div className="px-1.5 rounded flex items-center gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{sinConfirmar}</div>
              </div>
              <div className="w-[30px] h-[30px] bg-[#117BA8] rounded-full flex justify-center items-center">
                <img
                  src={iconoInterrogacion}
                  alt="icono interrogación"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          {/* Confirmados */}
          <div className="flex-1 bg-[#FDFDFD] rounded-[10px] outline-1 outline-[#005B4B] flex flex-col">
            <div className="h-[30px] px-2 bg-[#005B4B] rounded-t-[10px] flex items-center gap-2">
              <div className="text-center text-[#FBFBFB] text-[14px] font-poppins font-semibold leading-[19.6px]">Confirmados</div>
            </div>
            <div className="p-2 flex justify-between items-center">
              <div className="px-1.5 rounded flex items-center gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{confirmados}</div>
              </div>
              <div className="w-[30px] h-[30px] bg-[#005B4B] rounded-full flex justify-center items-center">
                <img
                  src={checkBlanco}
                  alt="icono check"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          {/* Cancelados */}
          <div className="flex-1 bg-[#FDFDFD] rounded-[10px] outline-1 outline-[#480A58] flex flex-col">
            <div className="h-[30px] px-2 bg-[#480A58] rounded-t-[10px] flex items-center gap-2">
              <div className="text-center text-[#FBFBFB] text-[14px] font-poppins font-semibold leading-[19.6px]">Cancelados</div>
            </div>
            <div className="p-2 flex justify-between items-center">
              <div className="px-1.5 rounded flex items-center gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{cancelados}</div>
              </div>
              <div className="w-[30px] h-[30px] bg-[#480A58] rounded-full flex justify-center items-center">
                <img
                  src={closeBlanco}
                  alt="icono cancelado"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          {/* No encontrados */}
          <div className="flex-1 bg-[#FDFDFD] rounded-[10px] outline-1 outline-[#D31F8B] flex flex-col">
            <div className="h-[30px] px-2 bg-[#D31F8B] rounded-t-[10px] flex items-center gap-2">
              <div className="text-center text-[#FBFBFB] text-[14px] font-poppins font-semibold leading-[19.6px]">No encontrados</div>
            </div>
            <div className="p-2 flex justify-between items-center">
              <div className="px-1.5 rounded flex items-center gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{noEncontrados}</div>
              </div>
              <div className="w-[30px] h-[30px] bg-[#D31F8B] rounded-full flex justify-center items-center">
                <img
                  src={callBlanco}
                  alt="icono no encontrados"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          {/* Reprogramados */}
          <div className="flex-1 bg-[#FDFDFD] rounded-[10px] outline-1 outline-[#1611A8] flex flex-col">
            <div className="h-[30px] px-2 bg-[#1611A8] rounded-t-[10px] flex items-center gap-2">
              <div className="text-center text-[#FBFBFB] text-[14px] font-poppins font-semibold leading-[19.6px]">Reprogramados</div>
            </div>
            <div className="p-2 flex justify-between items-center">
              <div className="px-1.5 rounded flex items-center gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7">{reprogramados}</div>
              </div>
              <div className="w-[30px] h-[30px] bg-[#1611A8] rounded-full flex justify-center items-center">
                <img
                  src={groupBlanco}
                  alt="icono reprogramados"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Presencialidad (título alineado a la izquierda, gráfico y leyenda centrados) */}
        <div className="w-full flex-1 px-8 py-8 bg-[#FDFDFD] rounded-[24px] outline-1 outline-[#7A7979] outline-offset-[-1px] flex flex-col gap-6 items-center">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-end gap-2 w-full">
              <div className="w-[200px] flex flex-col gap-2">
                <div className="text-[#111] text-[20px] font-poppins font-semibold leading-7 text-left">Presencialidad</div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row justify-center items-center gap-10">
            <div className="flex items-center justify-center min-w-[220px] min-h-[220px]">
              <div className="w-full h-full max-w-[250px] max-h-[320px] aspect-square bg-white rounded-full flex items-center justify-center border border-gray-200">
                <Pie
                  data={pieData}
                  options={{
                    plugins: {
                      legend: { display: false },
                      datalabels: {
                        color: '#111', // negro
                        font: {
                          weight: 'bold',
                          size: 18,
                        },
                        formatter: (value: number) => value,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        display: (context: any) => context.dataset.data[context.dataIndex] > 0, // Mostrar solo si el valor es mayor a 0
                      },
                    },
                    cutout: '0%',
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 ml-6 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#005B4B] rounded-full" />
                <div className="text-[#111] text-[15px] font-poppins">Ausentes</div>
                
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#D69E41] rounded-full" />
                <div className="text-[#111] text-[15px] font-poppins">Presentes</div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnosPorPeriodo;



