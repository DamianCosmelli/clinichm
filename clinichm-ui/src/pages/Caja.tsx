import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import BotonConIcono from "../components/common/BotonConIcono";
import TableListados from "../components/common/TableListados";
import iconoRetiro from '../assets/icon-retiro.svg';
import iconoCobro from '../assets/icono-cobro.svg';
import iconoCierreCaja from '../assets/icono-cierreCaja.svg';
import iconoTarjeta from '../assets/icon-tarjeta.svg';
import imagenMercadoPago from '../assets/imagen-mercadoPago.png';
import iconoDescargar from '../assets/icono-descarga.svg'; // Importar el ícono de descarga
import infoIcon from '../assets/iconoInfo.svg'; // Importar el ícono de información
import {Tooltip} from "@material-tailwind/react";// Importar el componente Tooltip
import '../styles/caja.css';
import useCargarDatosCaja from '../hooks/useCargarDatosCaja';
import Loading from './common/Loading'; // Importar el componente Loading
import { AuthContext } from '../utils/authContext'; // Importar el contexto de autenticación
import { ROLES } from '../utils/roles';
import PopupReporteCentral from '../components/CierreCaja/PopupReporteCentral';
import { generarInformeCajaCentral } from '../services/cierreCajaService';
import IconoNotas from '../assets/IconoComentario.svg';
import PopupNotas from '../components/common/PopupNotas';
import { generarInformeMovimientosyCom } from '../services/MovimientoCajaService';


const Caja: React.FC = () => {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]); // Fecha actual
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { movimientos, mediosDePago, sucursales, error, cierresCaja } = useCargarDatosCaja();
  const [filtro, setFiltro] = useState({
    mes: 'este-mes',
    tipoMovimiento: 'todos-los-movimientos',
    medioPago: 'todos',
    sucursal:user?.role !== ROLES.ADMIN
    ? user?.usuarioData?.sucursalID?.toString() ?? "todos"
    : "todos",
  });

  // Mostrar pantalla de carga si no hay datos
  const isLoading = !movimientos.length && !cierresCaja.length;
  //mostrar popup de notas 
  const [notasSeleccionadas, setNotasSeleccionadas] = useState<{id: number, notas: string} | null>(null);
  const [verNotas, setVerNotas] = useState<boolean>(false);

  const movimientosFiltrados = useMemo(() => {
  
    return movimientos.filter((mov) => {
      const mesMovimiento = new Date(mov.fechaHora).getMonth() + 1; // Obtener el mes del movimiento
      const cumpleMes =
        filtro.mes === 'este-mes' || mesMovimiento === parseInt(filtro.mes, 10);
      const cumpleTipo =
        filtro.tipoMovimiento === 'todos-los-movimientos' ||
        mov.tipoMovimiento.toLowerCase() === filtro.tipoMovimiento.toLowerCase();
      const cumpleMedio =
        filtro.medioPago === 'todos' ||
        mov.idMedioPago === parseInt(filtro.medioPago, 10);
      const cumpleSucursal =
        filtro.sucursal === 'todos' ||
        mov.idSucursal === parseInt(filtro.sucursal, 10);
      return cumpleMes && cumpleTipo && cumpleMedio && cumpleSucursal;
    });
  }, [movimientos, filtro]);

  const handlerNotas = (id: number, nota: string) => {
    if (notasSeleccionadas?.id === id) {
      setNotasSeleccionadas(null);
      setVerNotas(false); // Cerrar si ya está abierto
      } else {
      setNotasSeleccionadas({id, notas: nota});
      setVerNotas(true); 
    }
  }

  const movimientosFiltradosTabla = useMemo(() => {
    return movimientosFiltrados
      .slice() // Crear una copia para no mutar el original
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()) // Ordenar por fecha descendente
      .map((mov) => {
        const medioPago = mediosDePago.find((medio) => medio.id === mov.idMedioPago);
        const iconMap: Record<number, string> = {
          2: iconoCobro, // Efectivo Dólar
          1: iconoCobro, // Efectivo Peso
          4: iconoTarjeta, // Tarjeta de Crédito
          3: iconoTarjeta, // Tarjeta de Débito
          5: imagenMercadoPago, // Transferencia
          6: iconoCobro, // Sin Cargo
        };

        const iconSrc = medioPago ? iconMap[medioPago.id] : '';
        const medioPagoNombre = medioPago ? medioPago.medioPago : 'N/A';

        const diasPasados = Math.floor((Date.now() - new Date(mov.fechaHora).getTime()) / (1000 * 60 * 60 * 24));
        const textoDias = diasPasados === -1 ? 'hoy' : `hace ${diasPasados + 1}d`; // Mostrar "hoy" si la diferencia es 0

        const montoFormateado =
          medioPagoNombre.toLowerCase() === 'efectivo dolar' ? (
            <div className="w-full text-center text-[#005B4B] text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              U$D {mov.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          ) : medioPagoNombre.toLowerCase() === 'sin cargo' ? (
            <div className="w-full text-center text-gray-600 text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              ${mov.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          )
          : mov.tipoMovimiento.toLowerCase() === 'retiro' || 
              mov.tipoMovimiento.toLowerCase() === 'vuelto' ? (
            <div className="w-full text-center text-[#000000] text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              -${Math.abs(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          ) : (
            <div className="w-full text-center text-[#005B4B] text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              +${mov.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          );
        const notasMovimiento = mov.notas ? (
          <img
          src={IconoNotas}
          alt="Notas"
          title="Ver Notas"// Tooltip
          className="cursor-pointer w-5 h-5"
          onClick={() => handlerNotas(mov.id!, mov.notas!)} 
        />
        ) : '';

        return {
          Movimiento: (
            <div className="flex items-center gap-2">
              {iconSrc && <img src={iconSrc} alt={medioPagoNombre} className="w-6 h-6" />}
              <span className="font-bold">{medioPagoNombre}</span>
            </div>
          ),
          Operación: mov.tipoMovimiento,
          Sede: sucursales.find((s) => s.id === mov.idSucursal)?.nombre || 'N/A',
          Monto: montoFormateado, // Formatear el monto según el medio de pago
          ' ' :notasMovimiento
        };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimientosFiltrados, mediosDePago, sucursales]);

  const TABLE_HEAD_CIERRES = ["Cierre de caja", "Operación", "Sede", "Monto"];

  const cierresFiltrados = useMemo(() => {
    return cierresCaja.filter((cierre) => {
      const mesCierre = new Date(cierre.fechaHora).getMonth() + 1; // Obtener el mes del cierre
      const cumpleMes =
        filtro.mes === 'este-mes' || mesCierre === parseInt(filtro.mes, 10);
      const cumpleSucursal =
        filtro.sucursal === 'todos' ||
        cierre.idSucursal === parseInt(filtro.sucursal, 10);
      return cumpleMes && cumpleSucursal;
    });
  }, [cierresCaja, filtro]);

  const cierresFiltradosTabla = useMemo(() => {
    return cierresFiltrados
      .slice() // Crear una copia para no mutar el original
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()) // Ordenar por fecha descendente
      .map((cierre) => {
        const fechaSinHora = new Date(cierre.fechaHora).toLocaleDateString(); // Extraer solo la fecha
        const diasPasados = Math.floor((Date.now() - new Date(cierre.fechaHora).getTime()) / (1000 * 60 * 60 * 24));
        const textoDias = `hace ${diasPasados}d`;

        const montoFormateado = cierre.montoEfectivo >= 0 
          ? (
            <div className="w-full text-center text-[#005B4B] text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              +${cierre.montoEfectivo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          ) 
          : (
            <div className="w-full text-center text-[#000000] text-[16px] font-poppins font-semibold leading-[22.4px] break-words">
              -${Math.abs(cierre.montoEfectivo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              <div className="text-[12px] text-[#000000] font-normal">{textoDias}</div>
            </div>
          );

        return {
          "Cierre de caja": (
            <div
              className="flex items-center gap-2 justify-center cursor-pointer"
              onClick={() => navigate(`/cierre-de-caja?id=${cierre.id}`)} // Manejar clic directamente aquí
            >
              <img src={iconoCierreCaja} alt="Cierre de caja" className="w-6 h-6" />
              <span className="font-bold">{fechaSinHora}</span>
            </div>
          ),
          Operación: "REPORTE",
          Sede: sucursales.find((s) => s.id === cierre.idSucursal)?.nombre || "N/A",
          Monto: montoFormateado, // Formatear el monto según sea positivo o negativo
        };
      });
  }, [cierresFiltrados, sucursales, navigate]);

  //if (isLoading) {
   // return <Loading />;
  //}

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const calcularTotalesPorMedioDePago = () => {
    const totalesPorMedio: Record<number, number> = {};
    movimientosFiltrados.forEach((mov) => {
      if (totalesPorMedio[mov.idMedioPago] === undefined) {
        totalesPorMedio[mov.idMedioPago] = 0;
      }
      if ((mov.tipoMovimiento.toLowerCase() === "retiro") ||
          (mov.tipoMovimiento.toLowerCase() === "vuelto")){
        totalesPorMedio[mov.idMedioPago] -= Math.abs(mov.monto);
      } else {
        totalesPorMedio[mov.idMedioPago] += mov.monto;
      }
    });
    return totalesPorMedio;
  };

  const calcularIngresosTotales = () => {
    return movimientosFiltrados
      .filter((mov) => mov.idMedioPago !== 2 &&
                       mov.idMedioPago !== 6) // Excluir Efectivo Dolar y Sin cargo
      .reduce((total, mov) => {
        if ((mov.tipoMovimiento.toLowerCase() === "retiro") ||
            (mov.tipoMovimiento.toLowerCase() === "vuelto")){
          return total - Math.abs(mov.monto);
        }
        return total + mov.monto;
      }, 0);
  };

  const generarDatosGrafico = () => {
    const seriesData = movimientosFiltrados
      .filter((mov) => mov.idMedioPago !== 2 && // Excluir Efectivo Dolar
                       mov.idMedioPago !== 6) // Excluir Sin Cargo
      .map((mov) => mov.monto);
    return { seriesData };
  };

  const totalesPorMedio = calcularTotalesPorMedioDePago();
  const { seriesData } = generarDatosGrafico();

  const ApexChart = () => {
    const state = {
      series: [{ name: "Movimientos", data: seriesData }],
      options: {
        chart: { type: 'line', zoom: { enabled: false }, toolbar: { show: false } },
        dataLabels: { enabled: false },
        stroke: { curve: 'straight' },
        title: { text: 'Movimientos por Fecha', align: 'left' },
        
      },
    };

    return (
      <div className="chart-wrapper">
        <ReactApexChart options={state.options} series={state.series} type="line" height="100%" width="100%" />
      </div>
    );
  };

  const handleGenerarReporte = async () => {
    
    try {
          const informeBlob = await generarInformeCajaCentral(fecha);
          const url = window.URL.createObjectURL(informeBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `informe_cierre_caja_central_${fecha}.xlsx`; // Nombre del archivo
          link.click();
          window.URL.revokeObjectURL(url); // Liberar memoria
          setMostrarPopup(false);
        } catch (error) {
          console.error('Error al descargar el informe:', error);
        }
  }

  const handleMovimientosYcom = async () => {
    
    try {
          const fechaActual = new Date();
          const fecha = fechaActual.toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).replace(/[/:,]/g, '-').replace(/\s/g, '_');
          const informeBlob = await generarInformeMovimientosyCom(user?.role === ROLES.ADMIN ? 0 : (user?.usuarioData?.sucursalID || 0));
          const url = window.URL.createObjectURL(informeBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `MovimientosYComisiones_${fecha}.xlsx`; // Nombre del archivo
          link.click();
          window.URL.revokeObjectURL(url); // Liberar memoria
          setMostrarPopup(false);
        } catch (error) {
          console.error('Error al descargar listado de movimientos:', error);
        }
  }

  const TABLE_HEAD = ["Movimiento", "Operación", "Sede", "Monto"," "];

  return (
    <div className="w-full h-[calc(110vh-180px)] bg-fondo-contenedor relative overflow-hidden">
      <div className="w-full">
        <span className="text-subtitulo mb-4">Caja</span>
        {/** BOTONES **/}
        <div className="boton-retiro-container">
          <BotonConIcono
            label="Retiro"
            onClick={() => navigate('/Retiro')}
            iconSrc={iconoRetiro}
            className="boton-retiro"
          />
        </div>
        <div className="boton-cobro-container">
          <BotonConIcono
            label="Cobro"
            onClick={() => navigate('/cobro')}
            iconSrc={iconoCobro}
            className="boton-cobro"
          />
        </div>
        </div>
        { !isLoading ? (
        <div className="w-full h-full">
        <div className="w-full">
        <div className="dropdown-container">
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.mes}
              onChange={(e) => setFiltro({ ...filtro, mes: e.target.value })}
            >
              <option value="este-mes">Este mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.tipoMovimiento}
              onChange={(e) => setFiltro({ ...filtro, tipoMovimiento: e.target.value })}
            >
              <option value="todos-los-movimientos">Todos los movimientos</option>
              <option value="cobro">Cobro</option>
              <option value="vuelto">Vuelto</option>
              <option value="retiro">Retiro</option>
            </select>
          </div>
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.medioPago}
              onChange={(e) => setFiltro({ ...filtro, medioPago: e.target.value })}
            >
              <option value="todos">Todos los medios de pago</option>
              {mediosDePago
              .sort((a, b) => a.id - b.id) //ordena los MPs por id
              .map((medio) => (
                <option key={medio.id} value={medio.id}>{medio.medioPago}</option>
              ))}
            </select>
          </div>
          <div className="dropdown-caja">
            <select
              className={`${user?.role !== ROLES.ADMIN ? 'dropdown-select-disabled' : 'dropdown-select'}`}
              value={filtro.sucursal}
              onChange={(e) => setFiltro({ ...filtro, sucursal: e.target.value })}
              disabled={user?.role != ROLES.ADMIN ? true : false}
            >
              <option value="todos">Todas las sucursales</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="content-container">
          <div className="chart-container">
            <div data-progreso="Paso0" className="chart-layout">
              <div className="chart-header">
                <div className="chart-title">
                  Ingresos totales
                  <span className="inline-flex items-center">
                    <Tooltip
                      content={
                        <div className="text-black bg-white border border-blue-400 p-2 rounded text-left">
                          <span>Total ingresado en pesos.</span>
                          <br />
                          <span>Exluido cobros sin cargo y en dolares</span>
                        </div>
                      }
                    >
                      <img src={infoIcon} alt="Info" className="w-4 h-4 cursor-pointer ml-1" />
                    </Tooltip>
                  </span>
                </div>
              </div>
              <div className="mt-2 text-[#111] font-poppins text-2xl font-semibold leading-[150%] tracking-[-0.48px] flex items-center">
                ${calcularIngresosTotales().toFixed(2)}
              </div>
              <div className="chart-body">
                <ApexChart />
              </div>
            </div>
          </div>
          <div className="payment-container">
            <div className="payment-layout">
              <div className="payment-header">
                <div className="payment-title">Ingresos por medios de pago</div>
                <button className="close-box" onClick={() => navigate('/cierre-de-caja')}>
                  <img className="close-icon" src={iconoCierreCaja} alt="Cierre de caja" />
                  <span className="close-text">Cierre de caja</span>
                </button>
              </div>
              <div className="payment-body">
                {mediosDePago
                .filter((medio) => medio.id !== 6) // no muestra el Sin Cargo
                .map((medio) => {
                  const totalPorMedio = totalesPorMedio[medio.id] || 0;
                  const iconMap: Record<number, string> = {
                    2: iconoCobro, // Efectivo Dólar
                    1: iconoCobro, // Efectivo Peso
                    4: iconoTarjeta, // Tarjeta de Crédito
                    3: iconoTarjeta, // Tarjeta de Débito
                    5: imagenMercadoPago, // Transferencia
                  };

                  const iconSrc = iconMap[medio.id] || '';
                  const displayName = medio.id === 5 ? 'Mercado Pago' : medio.medioPago;

                  const montoFormateado =
                    medio.medioPago.toLowerCase() === 'efectivo dolar'
                      ? `U$D ${totalPorMedio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                      : `$${totalPorMedio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

                  return (
                    <div className="payment-item" key={medio.id}>
                      <div className="payment-method">
                        <img src={iconSrc} alt={medio.medioPago} className="payment-icon" />
                        <div className="payment-name">{displayName}</div>
                      </div>
                      <div className="payment-details">
                        <div className="payment-amount">{montoFormateado}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor de Últimos movimientos */}
        <div className="w-full p-8 bg-[#FDFDFD] rounded-lg border border-[#CDCDCD] flex flex-col justify-start items-start gap-8 mt-8">
          <div className="w-full flex flex-col justify-start items-start gap-6">
            <div className="w-full flex justify-between items-center">
              <div className="flex-1 text-[#383838] text-lg font-poppins font-semibold leading-7 break-words">
                Últimos movimientos
              </div>
              <button className="close-box" onClick={handleMovimientosYcom}>
                <img className="close-icon" src={iconoDescargar} alt="Descargar informe" />
                <span className="close-text" title='Movimientos y comisiones del día'>Descargar</span>
              </button>
            </div>
          </div>
          <div className="w-full h-[400px] overflow-y-auto"> {/* Habilitar scroll */}
            <TableListados headers={TABLE_HEAD} rows={movimientosFiltradosTabla} />
          </div>
        </div>

        {/* Contenedor de Últimos cierres de caja */}
        <div className="w-full p-8 bg-[#FDFDFD] rounded-lg border border-[#CDCDCD] flex flex-col justify-start items-start gap-8 mt-8">
          <div className="w-full flex flex-col justify-start items-start gap-6">
            <div className="w-full flex justify-between items-center">
              <div className="flex-1 text-[#383838] text-lg font-poppins font-semibold leading-7 break-words">
                Últimos cierres de caja
              </div>
              {/*Si el usuario es admin puede descargar reporte de caja central*/}
              {user?.role == ROLES.ADMIN ? (
               <button className="close-box" onClick={() => setMostrarPopup(true)}>
                <img className="close-icon" src={iconoDescargar} alt="Descargar informe" />
                <span className="close-text">Descargar informe Caja Central</span>
              </button>):''}
            </div>
          </div>
          <div className="w-full h-[400px] overflow-y-auto">
            <TableListados
              headers={TABLE_HEAD_CIERRES}
              rows={cierresFiltradosTabla}
            />
          </div>
        </div>
        
      </div>
        </div>): (
          <div className="w-full h-full mt-4">
            <Loading />
            </div>)}
       {/* Popup para reporte Central */}
       {mostrarPopup && (
        <PopupReporteCentral
          fecha={fecha}
          setFecha={setFecha}
          onClose={() => setMostrarPopup(false)}
          onConfirm={handleGenerarReporte} // Mostrar mensaje de éxito y actualizar URL
        />
      )}
      {/* Popup para ver notas */}
      {verNotas && (
        <PopupNotas
          notas={notasSeleccionadas?.notas || ''}
          onClose={() => setVerNotas(false)}
        />
      )}
    </div>
  );
};

export default Caja;

