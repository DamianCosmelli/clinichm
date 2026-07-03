import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg'; // Importar el ícono de éxito
import { Paciente } from '../models/Paciente';
import { buscarPacientePorDNI } from '../services/pacientesService';
import ContenedorDatosCobro from '../components/Caja/ContenedorDatosCobro';
import MovimientosVacios from '../components/Caja/MovimientosVacios';
import { MovimientoCaja } from '../models/MovimientoCaja'; // Importar MovimientoCaja
import { fetchMovimientosCaja } from '../services/MovimientoCajaService'; // Importar el servicio para obtener movimientos
import TableListados from '../components/common/TableListados'; // Importar el componente de tabla
import iconoCobro from '../assets/icono-cobro.svg';
import iconoTarjeta from '../assets/icon-tarjeta.svg';
import imagenMercadoPago from '../assets/imagen-mercadoPago.png';
import { Sucursal } from '../models/Sucursal'; // Importar el modelo de Sucursal
import { fetchMediosDePago } from '../services/mediosDePagoService'; // Importar el servicio de medios de pago
import { MedioDePago } from '../models/MedioDePago'; // Importar el modelo de MedioDePago
import { ListaSucursales } from '../services/sucursalesService'; // Importar el servicio de sucursales
import iconoBuscar from '../assets/iconoBuscar.svg'; // Importar el ícono de búsqueda
import IconoNotas from '../assets/IconoComentario.svg';
import PopupNotas from '../components/common/PopupNotas';
import iconoError from '../assets/triang_Error.svg'; 

const Cobro: React.FC = () => {
  const [paciente, setPaciente] = useState<Paciente | null>(null); // Restaurar paciente
  const [dni, setDni] = useState<string>('');
  const [dniDisabled, setDniDisabled] = useState(false);
  const [mostrarContenedor, setMostrarContenedor] = useState(false); // Restaurar mostrarContenedor
  const [mensajeExito, setMensajeExito] = useState<string | null>(null); // Restaurar setMensajeExito
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]); // Estado para las sucursales
  const [mediosDePago, setMediosDePago] = useState<MedioDePago[]>([]); // Estado para los medios de pago
  //mostrar popup de notas 
  const [notasSeleccionadas, setNotasSeleccionadas] = useState<{id: number, notas: string} | null>(null);
  const [verNotas, setVerNotas] = useState<boolean>(false);
  const [mensajeStock, setMensajeStock] = useState<string | null>(null);
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const movimientosCaja = await fetchMovimientosCaja();
        setMovimientos(movimientosCaja);

        const medios = await fetchMediosDePago(); // Obtener los medios de pago
        setMediosDePago(medios);

        const sucursalesData = await ListaSucursales(); // Obtener las sucursales
        setSucursales(sucursalesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    cargarDatos();
  }, []);

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
    return movimientos
      .filter((mov: MovimientoCaja) => mov.tipoMovimiento.toLowerCase() === 'cobro') // Filtrar solo movimientos de tipo "Cobro"
      .slice()
      .sort((a: MovimientoCaja, b: MovimientoCaja) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()) // Ordenar por fecha descendente
      .map((mov: MovimientoCaja) => {
        const medioPago = mediosDePago.find((medio) => medio.id === mov.idMedioPago); // Obtener el medio de pago real
        const sucursal = sucursales.find((s) => s.id === mov.idSucursal); // Obtener la sucursal real

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
        const sucursalNombre = sucursal ? sucursal.nombre : 'N/A'; // Mostrar el nombre de la sucursal

        const diasPasados = Math.floor((Date.now() - new Date(mov.fechaHora).getTime()) / (1000 * 60 * 60 * 24));
        const textoDias = diasPasados === -1 ? 'hoy' : `hace ${diasPasados + 1}d`;

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
          : (
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
          Sede: sucursalNombre, // Mostrar el nombre de la sucursal
          Monto: montoFormateado,
          ' ' :notasMovimiento
        };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimientos, mediosDePago, sucursales]);

  const TABLE_HEAD = ["Movimiento", "Operación", "Sede", "Monto", " "]; // Sin ícono de información en "Monto"

  const handleBuscarPaciente = async () => {
    if (dni) {
      try {
        const pacienteEncontrado = await buscarPacientePorDNI(dni);
        setPaciente(pacienteEncontrado); // Restaurar uso de setPaciente
        setDniDisabled(true);
        setMostrarContenedor(true); // Restaurar uso de setMostrarContenedor
      } catch (error) {
        console.error('Error al buscar paciente por DNI:', error);
        setPaciente(null);
        setMostrarContenedor(false); // Restaurar uso de setMostrarContenedor
      }
    } else {
      setPaciente(null);
      setMostrarContenedor(false); // Restaurar uso de setMostrarContenedor
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBuscarPaciente();
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col px-8 py-4 -mt-2 -ml-4 h-full overflow-y-auto">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/caja" className="text-navegacion">Caja</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Cobro</span>
        </div>
        {/* Título */}
        <div className="relative flex justify-between items-center mt-4">
          <span className="text-subtitulo">Cobro</span>
          {/* Mostrar mensaje de éxito */}
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                {mensajeExito}
              </span>
            </div>
          )} 
            {mensajeStock && (
            <div className="absolute right-5 translate-x-8 top-6 inline-flex items-center gap-2 p-1  rounded-md bg-red-100">
              <img src={iconoError} alt="SinStock" className="w-6 h-6" />
              <span className="text-red-600 text-sm font-normal leading-[19.6px] font-poppins">
              {mensajeStock}
              </span>
            </div>
            )}
        </div>
        {/* Buscador */}
        <div
          className="mt-12 ml-1 w-full h-[32px] pt-[10px] pb-[10px] pl-[15px] pr-[10px] bg-[#FBFBFB] rounded-[4px] outline-1 outline-[#5E5D5D] flex justify-start items-center gap-[13px]"
        >
          <input
            type="text"
            placeholder="Buscar DNI del paciente"
            className="flex-1 text-[#5E5D5D] text-[16px] font-poppins font-normal leading-[22.4px] break-words bg-transparent border-none focus:outline-none"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
            onKeyPress={handleKeyPress}
            disabled={dniDisabled}
          />
          <div
            className="w-[24px] h-[24px] relative overflow-hidden cursor-pointer"
            onClick={handleBuscarPaciente}
          >
            <img
              src={iconoBuscar}
              alt="Buscar"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        {/* Fin Buscador */}
        {/* Contenedor debajo del input */}
        {mostrarContenedor ? (
          <ContenedorDatosCobro paciente={paciente} setMensajeExito={setMensajeExito} setMensajeStock={setMensajeStock}/>
        ) : movimientosFiltradosTabla.length > 0 ? (
          <div className="w-full h-full p-8 bg-[#FDFDFD] rounded-lg border border-[#CDCDCD] flex flex-col justify-start items-start gap-8 mt-8">
            <div className="w-full flex flex-col justify-start items-start gap-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex-1 text-[#383838] text-lg font-poppins font-semibold leading-7 break-words">
                  Últimos movimientos
                </div>
              </div>
            </div>
            <div className="w-full h-[400px] overflow-y-auto"> {/* Habilitar scroll */}
              <TableListados headers={TABLE_HEAD} rows={movimientosFiltradosTabla} showTooltip={false} /> {/* Desactivar Tooltip */}
            </div>
          </div>
        ) : (
          <MovimientosVacios />
        )}
        {/* Fin del contenedor */}
      </div>
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

export default Cobro;