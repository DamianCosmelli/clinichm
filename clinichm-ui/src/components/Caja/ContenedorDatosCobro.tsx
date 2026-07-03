import React, { useEffect, useState } from 'react';
import BotonConIcono from '../common/BotonConIcono';
import ContenedorDatosPersonales from './ContenedorDatosPersonales'; // Importar el componente
import ContenedorMetodoCaptacion from './ContenedorMetodoCaptacion'; // Importar el componente
import ContenedorDatosCaja from './ContenedorDatosCaja'; // Importar el componente
import ContenedorEdicionPaciente from './ContenedorEdicionPaciente'; // Importar el componente
import { Paciente } from '../../models/Paciente';
import useCargarDatosCobro from '../../hooks/useCargarDatosCobro';
import { obtenerCotizacionDolar } from '../../services/DolarHoyService';
import { actualizarPaciente, buscarPacientePorDNI } from '../../services/pacientesService'; // Importar el servicio para actualizar pacientes y buscar paciente por DNI
import '../../styles/cobro.css';
import iconoEditar from '../../assets/iconoEditar.svg';
import iconPlusLine from '../../assets/icon-plus-line.svg';
import {Pago} from "../../models/Pagos";
import { crearPago } from '../../services/MovimientoCajaService';

interface ContenedorDatosCobroProps {
  paciente: Paciente | null;
  setMensajeExito: React.Dispatch<React.SetStateAction<string | null>>; 
  setMensajeStock?: React.Dispatch<React.SetStateAction<string | null>>; 
}

const ContenedorDatosCobro: React.FC<ContenedorDatosCobroProps> = ({ paciente, setMensajeExito, setMensajeStock }) => {
  const { sucursales, mediosDePago, medicos, tratamientos, productos, error } = useCargarDatosCobro();

  const [idPaciente, setIdPaciente] = useState<number | null>(null); // Estado para el ID del paciente
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<string | undefined>(undefined);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string | undefined>(undefined);
  const [medioDePagoSeleccionado, setMedioDePagoSeleccionado] = useState<string | undefined>(undefined);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<string | undefined>(undefined);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | undefined>(undefined);
  const [voucher, setVoucher] = useState<number | undefined>(undefined);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [cotizacionDolar, setCotizacionDolar] = useState<number | null>(null); // Estado para la cotización del dólar
  const [vuelto, setVuelto] = useState<number| undefined>(undefined); 
  const [horaAcreditacion, setHoraAcreditacion] = useState<string>(''); // Estado para la hora de acreditación
  const [numeroFactura, setNumeroFactura] = useState<string>(''); // Estado para el número de comprobante
  const [modoEdicion, setModoEdicion] = useState(false); // Estado para controlar el modo de edición
  const [pacienteEditable, setPacienteEditable] = useState<Paciente | null>(null); // Estado para manejar los datos editables del paciente
  //Listados de multriples usados
  const [medioDePagoListado, setMedioDePagoListado] = useState<{id: number,  medio: string; monto: number }[]>([]);
  const [tratamientosListado, setTratamientosListado] = useState<{ tratamientoId: number, nombre: string; conComision: boolean }[]>([]);
  const [productosListado, setProductosListado] = useState<{productoId: number, nombre: string; cantidad: number }[]>([]);
  const [notas, SetNotas] = useState<string>(''); // Estado para manejar las notas del pago

  const handleEditar = () => {
    setModoEdicion(true); // Activar el modo de edición
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false); // Desactivar el modo de edición
  };

  useEffect(() => {
    if (paciente?.id) {
      setIdPaciente(paciente.id); // Captura el ID del paciente si está disponible
    }
  }, [paciente]);

  useEffect(() => {
    const cargarCotizacionDolar = async () => {
      if (medioDePagoSeleccionado === 'Efectivo Dolar') {
        const cotizacion = await obtenerCotizacionDolar();
        setCotizacionDolar(cotizacion);
      }
    };
    cargarCotizacionDolar();
  }, [medioDePagoSeleccionado]);

  useEffect(() => {
    if (modoEdicion && paciente) {
      setPacienteEditable({ ...paciente }); // Crear una copia editable del paciente
    }
  }, [modoEdicion, paciente]);

  const handleInputChange = (field: keyof Paciente, value: string | boolean) => {
    if (pacienteEditable) {
      setPacienteEditable({ ...pacienteEditable, [field]: value }); // Actualizar el estado editable
    }
  };

  const handleTratamientoChange = async (nombreTratamiento: string) => {
    setTratamientoSeleccionado(nombreTratamiento);
  };

  const handlerProductoChange = async (nombre: string) => {
    setProductoSeleccionado(nombre);
  }

  const crearPagoMovimientoCaja = async (): Promise<Pago | null> => {
    if (!idPaciente || !sucursalSeleccionada || !medioDePagoSeleccionado || total === undefined) {
      console.error('Por favor, complete todos los campos obligatorios.');
      return null;
    }

    const sucursal = sucursales.find((s) => s.nombre === sucursalSeleccionada);
    const medioDePago = mediosDePago.find((m) => m.medioPago === medioDePagoSeleccionado);

    if (!sucursal || !medioDePago) {
      
      return null;
    }
    
    const pagoEjecutado : Pago = {
      idPaciente: idPaciente,
      idSucursal: sucursal.id,
      idMedico: medicos.find((m) => m.nombre === medicoSeleccionado)?.id || 0,
      tratamientos: tratamientosListado,
      productos: productosListado,
      mediosDePago: medioDePagoListado,
      cotizacionDolar: cotizacionDolar ?? 0, //sino se usa dolar se guarda cero
      horaAcreditacion: horaAcreditacion,
      total: total,
      vuelto: vuelto ,
      numeroFactura: numeroFactura,
      voucher:voucher ,
      fechaHora: new Date().toISOString(),
      notas: notas, // Agregar las notas al pago
    }
    return pagoEjecutado;
  };


  const handleGuardar = async () => {
    try {
      // Buscar el ID del paciente por DNI si no está disponible
      if (!idPaciente && paciente?.dni) {
        const pacienteEncontrado = await buscarPacientePorDNI(paciente.dni);
        if (pacienteEncontrado) {
          setIdPaciente(pacienteEncontrado.id || null); // Asegurar que no se asigne undefined
        } else {
          console.error('Paciente no encontrado por DNI');
          return;
        }
      }

      let datosPacienteEditados = false;

      // Guardar la edición del paciente si hubo cambios
      if (pacienteEditable && JSON.stringify(pacienteEditable) !== JSON.stringify(paciente)) {
        await actualizarPaciente(pacienteEditable.id!, pacienteEditable); // Guardar los cambios del paciente
        datosPacienteEditados = true;

        // Actualizar el estado del paciente con los datos editados
        if (pacienteEditable.id === paciente?.id && paciente) {
          Object.assign(paciente, pacienteEditable);
        }
      }

      const pagoMovimientoCaja = await crearPagoMovimientoCaja();
      if (pagoMovimientoCaja) {
        // Guardar elpago en el backend
        const pago = await crearPago(pagoMovimientoCaja); // Llamar al servicio para guardar el pago

        //Muestra mensaje de error si no se pudo descontar producto
        if (pago['resultado'] === 'Sin Stock') {
          if (setMensajeStock) {
            setMensajeStock('No pudo descontarse producto. Verificar stock disponible en la sucursal.');
            setTimeout(() => setMensajeStock(null), 4000);
          }
        }

        // Mostrar el mensaje de éxito correcto
        const mensajeExito = datosPacienteEditados
          ? 'Cobro y datos del paciente guardados'
          : 'Cobro guardado';
        setMensajeExito(mensajeExito);
        setTimeout(() => setMensajeExito(null), 3000);
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Recarga la página para mostrar los ultimos cobros
      }
    } catch (error) {
      console.error('Error al guardar el movimiento o los datos del paciente:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (

    <div
      className="mt-4 ml-1 w-full px-6 py-6 bg-[#FBFBFB] rounded-lg outline-2 outline-[#D69E41] outline-offset-[-2px] flex flex-col gap-6 overflow-y-auto"
      //style={{ maxHeight: 'calc(100vh - 250px)' }}
    >
      {paciente && !modoEdicion ? (
        <div className="w-full flex justify-between items-center relative mt-[-48px]">
          <div className="w-[394px] h-12 flex justify-start items-center gap-2.5">
            <div className="contenedor-nombre">
              {paciente.nombre} {paciente.apellido}
            </div>
          </div>
          <div
            data-estado="Activo"
            data-show-icon="true"
            className="mt-20 mr-2 w-25 h-20"
          >
            <div className="flex items-center justify-center">
              <BotonConIcono
                label="Editar"
                iconSrc={iconoEditar}
                onClick={handleEditar} // Manejar clic en "Editar"
              />
            </div>
          </div>
        </div>
      ) : null}

      {modoEdicion && (
        <ContenedorEdicionPaciente
          pacienteEditable={pacienteEditable}
          handleInputChange={handleInputChange}
          handleCancelarEdicion={handleCancelarEdicion}
        />
      )}

      {!modoEdicion && (
        <div className="w-full flex justify-start items-start gap-6 mt-[-40px]">
          <ContenedorDatosPersonales paciente={paciente} /> {/* Usar el nuevo componente */}
          <ContenedorMetodoCaptacion paciente={paciente} /> {/* Usar el nuevo componente */}
        </div>
      )}

      <div className="w-full flex justify-end items-center gap-3"></div>
      <div className="w-full flex justify-start items-start gap-8">
        <ContenedorDatosCaja
          sucursales={sucursales}
          mediosDePago={mediosDePago}
          medicos={medicos}
          tratamientos={tratamientos}
          productos={productos}
          medioDePagoSeleccionado={medioDePagoSeleccionado}
          setMedioDePagoSeleccionado={setMedioDePagoSeleccionado}
          sucursalSeleccionada={sucursalSeleccionada}
          setSucursalSeleccionada={setSucursalSeleccionada}
          medicoSeleccionado={medicoSeleccionado}
          setMedicoSeleccionado={setMedicoSeleccionado}
          tratamientoSeleccionado={tratamientoSeleccionado}
          handleTratamientoChange={handleTratamientoChange}
          productoSeleccionado={productoSeleccionado}
          handlerProductoChange={handlerProductoChange}
          vuelto={vuelto}
          setVuelto={setVuelto}
          cotizacionDolar={cotizacionDolar}
          setCotizacionDolar ={setCotizacionDolar}
          horaAcreditacion={horaAcreditacion}
          setHoraAcreditacion={setHoraAcreditacion}
          total={total}
          setTotal={setTotal}
          cantidad={0}
          numeroFactura={numeroFactura}
          setNumeroFactura={setNumeroFactura}
          voucher={voucher}
          setVoucher={setVoucher}
          idPaciente={idPaciente} 

          setMedioDePagoListado={setMedioDePagoListado}
          setTratamientosListado={setTratamientosListado}
          setProductosListado={setProductosListado}
          notas={notas}
          setNotas={SetNotas}

        />
      </div>
      <div className="w-full flex justify-between items-center relative mb-16">
        <div
          data-estado="Activo"
          data-show-icon="true"
          className="mr-25 w-20 h-20"
        ></div>
        <div className="w-full flex justify-end">
          <BotonConIcono
            label="Guardar"
            iconSrc={iconPlusLine}
            className={`w-30 h-20 ${
              (!total || medioDePagoListado.length === 0 || medioDePagoListado.reduce((acc, m) => acc + (m.monto || 0), 0) !== total)
                ? 'boton-con-icono-disabled pointer-events-none opacity-50' : ''
            }`}
            onClick={handleGuardar}
          />
        </div>
      </div>
    </div>
    
  );
};

export default ContenedorDatosCobro;