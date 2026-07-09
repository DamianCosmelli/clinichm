import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useCargarCierreCaja from '../hooks/useCargarCierreCaja';
import IngresosTotalesCard from '../components/CierreCaja/IngresosTotalesCard';
import GastosTotalesCard from '../components/CierreCaja/GastosTotalesCard';
import TotalEfectivoCard from '../components/CierreCaja/TotalEfectivoCard';
import IngresosPorMedioCard from '../components/CierreCaja/IngresosPorMedioCard';
import GastosEmpleadosCard from '../components/CierreCaja/GastosEmpleadosCard';
import BotonConIcono from '../components/common/BotonConIcono'; // Importar el componente BotonConIcono
import iconoDescargar from '../assets/icono-descarga.svg'; // Importar el ícono de descarga
import { generarInformeCierreCaja, procesarCierreDiario, /*obtenerCierreCaja,*/ ObtenerCierreCajaInfo } from '../services/cierreCajaService'; // Importar el método
import { ListaSucursales } from '../services/sucursalesService'; // Importar el servicio para obtener sucursales
//import { CierreCaja } from '../models/CierreCaja'; // Importar el modelo CierreCaja

import PopupCierreCaja from '../components/CierreCaja/PopupCierreCaja'; // Importar el nuevo componente
import iconCheck from '../assets/icon-check.svg'; // Importar el ícono de éxito
import iconChevronRightRounded from "..//assets/icon-chevron-right-rounded.svg";
import iconPlusLine from "../assets/icon-plus-line.svg";
import { CierreCajaInfo } from '../models/CierreCajaInfo';
import MovimientosCierreCard from '../components/CierreCaja/MovimientosCierreCard';

const CierreDeCaja: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const searchParams = new URLSearchParams(location.search);
  const idCierreCaja = parseInt(searchParams.get('id') || '0', 10);

  const {
    ingresosARS,
    ingresosUSD,
    gastosARS,
    totalEfectivo,
    ingresosPorMedio,
    gastosEmpleados,
  } = useCargarCierreCaja(idCierreCaja);

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]); // Fecha actual
  //const [pagosComisiones, setPagosComisiones] = useState<PagoDeComisiones[]>([]);
  const [cierreCaja, setCierreCaja] = useState<CierreCajaInfo | null >(null); // Estado para los datos del cierre
  const [mensajeExito, setMensajeExito] = useState(false); // Estado para el mensaje de éxito

  const cargarSucursales = async () => {
    try {
      const data = await ListaSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  const handleCerrarCaja = () => {
    setMostrarPopup(true);
    cargarSucursales();
  };

  const handleConfirmarCierre = async () => {
    if (!sucursalSeleccionada || !fecha) {
      console.error('Debe seleccionar una sucursal y una fecha para cerrar la caja.');
      return;
    }

    const cierreCajaData = {
      idSucursal: sucursalSeleccionada,
      fechaHora: new Date(fecha).toISOString(),
    };

    try {
      const nuevoCierreCaja = (await procesarCierreDiario(cierreCajaData)) as { id: number }; // Asegurar que devuelve un objeto con 'id'
      
      setMostrarPopup(false);
      setMensajeExito(true); // Mostrar mensaje de éxito
      setTimeout(() => setMensajeExito(false), 3000); // Ocultar mensaje después de 3 segundos
      navigate(`?id=${nuevoCierreCaja.id}`); // Redirigir usando useNavigate
    } catch (error) {
      console.error('Error al procesar el cierre de caja:', error);
    }
  };

  const handleCancelarCierre = () => {
    setMostrarPopup(false);
  };

  const descargarInforme = async () => {
    try {
      const informeBlob = await generarInformeCierreCaja(idCierreCaja);
      const url = window.URL.createObjectURL(informeBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-cierre-caja-${idCierreCaja}.xlsx`; // Nombre del archivo
      link.click();
      window.URL.revokeObjectURL(url); // Liberar memoria
    } catch (error) {
      console.error('Error al descargar el informe:', error);
    }
  };

  useEffect(() => {
    const cargarCierreCaja = async () => {
      try {
        const data = await ObtenerCierreCajaInfo(idCierreCaja);
        setCierreCaja(data);
      } catch (error) {
        console.error('Error al cargar datos del cierre de caja:', error);
      }
    };

    if (idCierreCaja) {
      cargarCierreCaja();
    }
  }, [idCierreCaja]);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative">
      <div className="flex flex-col px-8 py-4 -ml-4 h-full overflow-y-auto">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/caja" className="text-navegacion">Caja</Link>
          <img src={iconChevronRightRounded} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Cierre de Caja</span>
        </div>
        {/* Título */}
        <div className="relative flex justify-between items-center mt-4">
          <span className="text-subtitulo">Cierre de Caja</span>
          {mensajeExito && ( // Mostrar mensaje de éxito
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Caja cerrada
              </span>
            </div>
          )}
        </div>
        {/* Título Detalles por categoría */}
        <div className="mt-16 w-full h-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D69E41] flex flex-col justify-start items-end gap-6 overflow-y-auto">
          {/* Título Detalles por categoría */}
          <div className="w-full flex justify-between items-center relative">
            <span className="text-[#111111] text-2xl font-poppins leading-[38.4px]">
              Detalles por categoría
            </span>
            <div className="flex gap-4 absolute -top-2 right-10">
              {idCierreCaja ? (
                <div className="-mr-9">
                  <button className="close-box flex items-center gap-2" onClick={descargarInforme}>
                    <img className="close-icon" src={iconoDescargar} alt="Descargar informe" />
                    <span className="close-text">Descargar informe</span>
                  </button>
                </div>
              ) : null}
              {!idCierreCaja && (
                <div className="mr-28">
                  <BotonConIcono
                    label="Cerrar caja"
                    iconSrc={iconPlusLine}
                    className="w-38 bg-[#005B4B] text-white hover:bg-opacity-90"
                    onClick={handleCerrarCaja} // Mostrar popup
                  />
                </div>
              )}
            </div>
          </div>
          {/* Cards iniciales */}
          <div className="w-full flex justify-between items-start gap-6">
            <IngresosTotalesCard
              ingresosARS={
                cierreCaja
                  ? cierreCaja.resumen.montoEfectivo +
                    cierreCaja.resumen.montoTarjetaCredito +
                    cierreCaja.resumen.montoDebito +
                    cierreCaja.resumen.montoTransferencia
                  : ingresosARS
              }
              ingresosUSD={cierreCaja ? cierreCaja.resumen.montoDolar : ingresosUSD}
            />
            <GastosTotalesCard
              gastosARS={cierreCaja ? (cierreCaja.resumen.totalRetiro + cierreCaja.resumen.totalVuelto) : gastosARS} 
            />
            <TotalEfectivoCard
              totalEfectivo={cierreCaja ? cierreCaja.resumen.totalEfectivo : totalEfectivo}
            />
          </div>
          <IngresosPorMedioCard ingresosPorMedio={ingresosPorMedio} />
          {idCierreCaja && cierreCaja ? (
            <>  
              <MovimientosCierreCard movimientosCierre={cierreCaja!.movimientos} />
            </>
          ):''}
          {/* Mostrar GastosEmpleadosCard solo si hay datos */}
          {gastosEmpleados.length > 0 && <GastosEmpleadosCard gastosEmpleados={gastosEmpleados} />}
          {/* Mostrar PagosComisionesCard solo si hay datos */}
        </div>
      </div>
      {/* Popup para cerrar caja */}
      {mostrarPopup && (
        <PopupCierreCaja
          sucursales={sucursales}
          sucursalSeleccionada={sucursalSeleccionada}
          setSucursalSeleccionada={setSucursalSeleccionada}
          fecha={fecha}
          setFecha={setFecha}
          onClose={handleCancelarCierre}
          onConfirm={handleConfirmarCierre} // Mostrar mensaje de éxito y actualizar URL
        />
      )}
    </div>
  );
};

export default CierreDeCaja;
