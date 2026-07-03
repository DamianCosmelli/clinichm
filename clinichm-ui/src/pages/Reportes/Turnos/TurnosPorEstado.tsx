import React, { useState, useEffect, useCallback } from 'react';
//import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import useCargarDatosMedicos from '../../../hooks/useCargarDatosMedicos'; // Hook para cargar datos de sucursales
import Loading from "../../common/Loading" ; // Componente de carga
import TableListados from '../../../components/common/TableListados'; // Componente de tabla
//import { obtenerTurnosPorPacienteId } from '../../../services/turnosService';
//import { obtenerPacientebyId } from '../../../services/pacientesService';
//import { obtenerSucursalPorId } from '../../../services/sucursalesService';
//import { obtenerMedicoPorId } from '../../../services/medicosService'; // Importar el servicio para obtener médicos
//import { Turno } from '../../../models/Turno'; // Importar el modelo Turno
import iconoAcciones from '../../../assets/iconoAcciones.svg'; // Icono de acciones
import iconoCopiar from '../../../assets/iconoCopiar.svg'; // Importar el ícono de copiar
import iconCheckDorado from '../../../assets/icon-check-dorado.svg'; // Importar el ícono de check dorado
import { ListaTurnoFecha } from '../../../services/turnosFechaService';
import { TurnoCalendar } from '../../../models/TurnoCalendar';
//import BotonConIcono from '../../../components/common/BotonConIcono';
//import iconoExportar from '../../../assets/icono-cierreCaja.svg'; 


const TurnosPorEstado: React.FC = () => {
  //const navigate = useNavigate(); // Inicializar useNavigate
  const { sucursales } = useCargarDatosMedicos(); // Obtener sucursales
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  const [rows, setRows] = useState<{ Paciente: string; Sede: string; Contacto: string; Medico: string }[]>([]);
  const [turnos, setTurnos] = useState<TurnoCalendar[]>([]); // Guardar todos los turnos
  const [tituloListado, setTituloListado] = useState('Listado'); // Estado para el título dinámico
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mensajesCopiados, setMensajesCopiados] = useState<{ [key: string]: boolean }>({});
  const [filtroActivo, setFiltroActivo] = useState<string>(''); // Estado para el filtro activo
  const [loading, setLoading] = useState(true); // Nuevo estado para loading

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true); // Mostrar loading al iniciar carga
        const turnosData = await ListaTurnoFecha(new Date(fechaSeleccionada), 
        new Date(new Date(fechaSeleccionada).setDate(new Date(fechaSeleccionada).getDate() + 1)));
        setTurnos(turnosData); // Guardar todos los turnos
        const datos = turnosData.map((turno) => ({
          Paciente: turno.pacienteNombre,
          Sede: turno.sucursalNombre,
          Contacto: turno.pacienteCelular,
          Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
        }));
        setRows(datos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false); // Ocultar loading al finalizar
      }
    };

    cargarDatos();
  }, [fechaSeleccionada]);

  const filtrarTurnos = useCallback(() => {
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return coincideSede && coincideFecha;
    });

    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  }, [sedeSeleccionada, fechaSeleccionada, turnos]);

  const filtrarPorAusentes = () => {
    setTituloListado('Ausentes');
    setFiltroActivo('Ausentes'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.asistio === false && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  /*const filtrarPorDuplicados = () => {
    setTituloListado('Duplicados');
    setFiltroActivo('Duplicados'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.turnosDuplicados && turno.turnosDuplicados.length > 0 && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      const paciente = await obtenerPacientebyId(turno.pacienteId);
      const sucursal = await obtenerSucursalPorId(turno.sucursalId);
      return {
        Paciente: `${paciente.nombre} ${paciente.apellido}`,
        Sede: sucursal.nombre,
        Contacto: paciente.celular,
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  const filtrarPorCambioDeAgenda = () => {
    setTituloListado('Cambio de agenda');
    setFiltroActivo('Cambio de agenda'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.reprogramado === true && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      const paciente = await obtenerPacientebyId(turno.pacienteId);
      const sucursal = await obtenerSucursalPorId(turno.sucursalId);
      return {
        Paciente: `${paciente.nombre} ${paciente.apellido}`,
        Sede: sucursal.nombre,
        Contacto: paciente.celular,
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };
*/
  const filtrarPorSinConfirmar = () => {
    setTituloListado('Sin confirmar');
    setFiltroActivo('Sin confirmar'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.confirmado === false && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  const filtrarPorConfirmados = () => {
    setTituloListado('Confirmados');
    setFiltroActivo('Confirmados'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.confirmado === true && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  const filtrarPorCancelados = () => {
    setTituloListado('Cancelados');
    setFiltroActivo('Cancelados'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.cancelado === true && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  const filtrarPorNoEncontrados = () => {
    setTituloListado('No encontrados');
    setFiltroActivo('No encontrados'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.noEncontrado === true && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  const filtrarPorReprogramados = () => {
    setTituloListado('Reprogramados');
    setFiltroActivo('Reprogramados'); // Establecer filtro activo
    const turnosFiltrados = turnos.filter((turno) => {
      const coincideSede = sedeSeleccionada
        ? turno.sucursalId === parseInt(sedeSeleccionada)
        : true;
      const coincideFecha = fechaSeleccionada
        ? turno.fechaHora.split('T')[0] === fechaSeleccionada
        : true;
      return turno.reprogramado === true && coincideSede && coincideFecha;
    });
    const datosFiltrados = turnosFiltrados.map(async (turno) => {
      return {
        Paciente: turno.pacienteNombre,
        Sede: turno.sucursalNombre,
        Contacto: turno.pacienteCelular,
        Medico: turno.medicoNombre, // Concatenar nombre y apellido del médico
      };
    });

    Promise.all(datosFiltrados).then(setRows);
  };

  useEffect(() => {
    filtrarTurnos();
  }, [filtrarTurnos]);

  // Mostrar pantalla de carga si no hay sucursales o si está cargando
  if (!sucursales.length || loading) {
    return <Loading />;
  }

  const turnosFiltrados = rows
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1));
    setCurrentPage(page);
  };

  const copiarAlPortapapeles = (texto: string, contacto: string) => {
    navigator.clipboard.writeText(texto).then(() => {
      setMensajesCopiados((prev) => ({ ...prev, [contacto]: true }));
      setTimeout(() => {
        setMensajesCopiados((prev) => ({ ...prev, [contacto]: false }));
      }, 2000);
    });
  };

  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto font-poppins">
      <div className="w-full mt-4">
        {/* Subtabs */}
        {/* <div className="flex gap-4 border-b border-gray-300 pb-2 items-start">
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'TurnosPorEstado' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('TurnosPorEstado')}
          >
            Turnos por estado
          </button>
          <button
            className={`text-sm font-poppins px-4 py-2 rounded ${
              activeTab === 'TurnosAfectados' ? 'font-bold text-[#85673B] bg-gray-200' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('TurnosAfectados')}
          >
            Turnos afectados
          </button>
        </div> */}
        {/* Contenido de las subtabs */}
        <div className="mt-4">
          {/* {activeTab === 'TurnosPorEstado' && ( */}
            <div>
             
              {/*<div className="flex justify-end">
         <BotonConIcono
            label="Exportar"
            iconSrc={iconoExportar}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/crear-medico')} // Navegar a la página de creación de médico
          />
        </div>*/} 
              <div className="flex w-full h-full mt-4">
                {/* Filtros */}
                <div className="w-1/3 h-214 p-6 bg-[#FDFDFD] rounded-l-lg border border-[#85673B] flex flex-col gap-4 font-poppins">
                  <div className="text-lg font-semibold text-[#111111] font-poppins">Ordenar por fecha y sede</div>
                  <div className="w-full flex flex-col gap-4">
                   
                    {/* Filtro de fecha */}
                    <div className="dropdown-caja">
                      <input
                        type="date"
                        className="dropdown-select font-poppins"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                      />
                    </div>
                  </div>
                   {/* Filtro de sede */}
                    <div className="dropdown-caja">
                      <select
                        className="dropdown-select font-poppins"
                        value={sedeSeleccionada}
                        onChange={(e) => setSedeSeleccionada(e.target.value)}
                      >
                        <option value="">Todas las sedes</option>
                        {sucursales.map((sucursal) => (
                          <option key={sucursal.id} value={sucursal.id.toString()}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                  {/* Filtros por estado */}
                  <div className="mt-6">
                    <div className="w-full rounded-lg overflow-hidden font-poppins">
                      {/* Encabezado */}
                      <div className="bg-[rgba(0,91,75,0.15)] text-center text-black py-2 font-poppins">
                        Por estado
                      </div>
                      {/* Filas */}
                      <div
                        className={`flex justify-between items-center border-b border-gray-300 px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'Ausentes' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorAusentes}
                      >
                        <span className="font-bold">Ausentes</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de Ausentes"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <div
                        className={`flex justify-between items-center border-b border-gray-300 px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'Sin confirmar' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorSinConfirmar}
                      >
                        <span className="font-bold">Sin confirmar</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de Sin confirmar"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <div
                        className={`flex justify-between items-center border-b border-gray-300 px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'Confirmados' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorConfirmados}
                      >
                        <span className="font-bold">Confirmados</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de Confirmados"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <div
                        className={`flex justify-between items-center border-b border-gray-300 px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'Cancelados' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorCancelados}
                      >
                        <span className="font-bold">Cancelados</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de Cancelados"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <div
                        className={`flex justify-between items-center px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'No encontrados' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorNoEncontrados}
                      >
                        <span className="font-bold">No encontrados</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de No encontrados"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <div
                        className={`flex justify-between items-center px-4 py-2 cursor-pointer font-poppins ${
                          filtroActivo === 'Reprogramados' ? 'bg-[rgba(214,158,65,0.20)]' : ''
                        }`}
                        onClick={filtrarPorReprogramados}
                      >
                        <span className="font-bold">Reprogramados</span>
                        <img
                          src={iconoAcciones}
                          alt="Acciones"
                          title="Ver detalles de Reprogramados"
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listado */}
                <div className="w-2/3 h-214 p-6 bg-gradient-to-b from-[rgba(214,158,65,0.20)] to-[rgba(214,158,65,0.20)] bg-[#FDFDFD] rounded-r-lg border border-[#85673B] flex flex-col gap-4 font-poppins">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-[#111111] font-poppins">{tituloListado}</div>
                    <div className="dropdown-container mb-4">
                      <div className="dropdown-caja">
                        <select
                          className="dropdown-select font-poppins"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setItemsPerPage(parseInt(e.target.value, 10));
                          }}
                        >
                          <option value={10}>mostrar 10</option>
                          <option value={20}>mostrar 20</option>
                          <option value={30}>mostrar 30</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Contenedor con scroll para la tabla, altura dinámica */}
                  <div className={`overflow-y-auto ${turnosFiltrados.length > itemsPerPage ? 'max-h-[420px]' : ''}`}>
                    <TableListados 
                      headers={['Paciente', 'Medico', 'Sede', 'Contacto']}
                      rows={turnosFiltrados.map(row => ({
                        ...row,
                        Paciente: (
                          <div className="flex justify-center items-center">
                            {row.Paciente}
                          </div>
                        ),
                        Medico: ( // Renderizar el nombre del médico
                          <div className="flex justify-center items-center">
                            {row.Medico}
                          </div>
                        ),
                        Sede: (
                          <div className="flex justify-center items-center">
                            {row.Sede}
                          </div>
                        ),
                        Contacto: (
                          <div className="flex justify-center items-center gap-2">
                            {mensajesCopiados[row.Contacto] ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={iconCheckDorado}
                                  alt="Check"
                                  className="w-4 h-4"
                                />
                                <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                                  Número copiado
                                </div>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={iconoCopiar}
                                  alt="Copiar"
                                  className="cursor-pointer w-4 h-4"
                                  onClick={() => copiarAlPortapapeles(row.Contacto, row.Contacto)}
                                />
                                <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                                  {row.Contacto}
                                </div>
                              </>
                            )}
                          </div>
                        ),
                      }))}
                    />
                  </div>
                  {/* El paginador siempre visible debajo de la tabla */}
                  <div className="flex justify-center items-center mt-4">
                    <div className="flex items-center mx-2">
                      <input
                        type="number"
                        value={currentPage}
                        onChange={handlePageChange}
                        className="w-12 text-center border rounded"
                      />
                      <span className="ml-2 font-bold">/ {totalPages}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* )}
          {activeTab === 'TurnosAfectados' && (
            <TurnosAfectados /> // Usar el nuevo componente
          )} */}
        </div>
      </div>
    </div>
  );
};

export default TurnosPorEstado;


