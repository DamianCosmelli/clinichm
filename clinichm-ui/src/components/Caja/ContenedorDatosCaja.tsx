import React, { useContext, useEffect, useState } from 'react';
import Dropdown from '../common/Dropdown';
import iconoPlus from '../../assets/icon-plus-line-dorado.svg';
import iconoInfo from '../../assets/iconoInfo.svg';
import iconoEliminar from '../../assets/iconoEliminar.svg'; // Importar el ícono de eliminar
import { AuthContext } from '../../utils/authContext';
import { ROLES } from '../../utils/roles';

interface ContenedorDatosCajaProps {
  sucursales: { id: number; nombre: string }[]; // Agregar 'id'
  mediosDePago: { id: number; medioPago: string }[];
  medicos: { id: number; nombre: string }[]; // Agregar 'id'
  tratamientos: { id: number; nombreTratamiento: string; precioEfectivo: number; precioOtrosMediosDePago: number }[];
  productos: { id: number; nombre: string }[];
  idPaciente: number | null; // Agregar 'idPaciente'
  medioDePagoSeleccionado: string | undefined;
  setMedioDePagoSeleccionado: React.Dispatch<React.SetStateAction<string | undefined>>;
  sucursalSeleccionada: string | undefined;
  setSucursalSeleccionada: React.Dispatch<React.SetStateAction<string | undefined>>;
  medicoSeleccionado: string | undefined;
  setMedicoSeleccionado: React.Dispatch<React.SetStateAction<string | undefined>>;
  tratamientoSeleccionado: string | undefined;
  handleTratamientoChange: (nombreTratamiento: string) => void;
  productoSeleccionado: string | undefined;
  handlerProductoChange: (nombre: string) => void;
  cantidad: number;
  //setCantidad: React.Dispatch<React.SetStateAction<number>>;
  cotizacionDolar: number | null;
  setCotizacionDolar: React.Dispatch<React.SetStateAction<number | null>>;
  horaAcreditacion: string;
  setHoraAcreditacion: React.Dispatch<React.SetStateAction<string>>;
  total: number | undefined;
  setTotal:React.Dispatch<React.SetStateAction<number | undefined>>;
  vuelto: number | undefined;
  setVuelto:React.Dispatch<React.SetStateAction<number | undefined>>;
  numeroFactura: string;
  setNumeroFactura: React.Dispatch<React.SetStateAction<string>>;
  voucher: number | undefined;
  setVoucher: React.Dispatch<React.SetStateAction<number | undefined>>;
  
  setMedioDePagoListado: React.Dispatch<React.SetStateAction<{ id: number; medio: string; monto: number }[]>>;
  setTratamientosListado: React.Dispatch<React.SetStateAction<{ tratamientoId: number; nombre: string; conComision: boolean }[]>>;
  setProductosListado: React.Dispatch<React.SetStateAction<{ productoId: number; nombre: string; cantidad: number }[]>>;

  notas: string;
  setNotas: React.Dispatch<React.SetStateAction<string>>;
}

const ContenedorDatosCaja: React.FC<ContenedorDatosCajaProps> = ({
  sucursales,
  mediosDePago,
  medicos,
  tratamientos,
  productos,
  medioDePagoSeleccionado,
  setMedioDePagoSeleccionado,
  sucursalSeleccionada,
  setSucursalSeleccionada,
  medicoSeleccionado,
  setMedicoSeleccionado,
  tratamientoSeleccionado,
  handleTratamientoChange,
  productoSeleccionado,
  handlerProductoChange,
  cantidad,

  cotizacionDolar,
  setCotizacionDolar,
  total,
  setTotal,
  vuelto,
  setVuelto,
  horaAcreditacion,
  setHoraAcreditacion,
  
  numeroFactura,
  setNumeroFactura,
  voucher,
  setVoucher,
  //idPaciente, // Agregar idPaciente aquí

  setMedioDePagoListado,
  setTratamientosListado,
  setProductosListado,
  notas,
  setNotas,

}) => {
  const [pagos, setPagos] = useState<{ id: number; medio: string; monto: number }[]>([]);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<{ tratamientoId: number; nombre: string; conComision: boolean }[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<{ productoId: number; nombre: string; cantidad: number }[]>([]);
  const [mostrarTablaTratamientos, setMostrarTablaTratamientos] = useState(false);
  const [mostrarTablaProductos, setMostrarTablaProductos] = useState(false);
  const [mostrarTablaPagos, setMostrarTablaPagos] = useState(false);
  const [cotizacionDolarFija, setCotizacionDolarFija] = useState<number | null>(null);
  const { user } = useContext(AuthContext);

  const eliminarPago = (index: number) => {
    const nuevosPagos = pagos.filter((_, i) => i !== index);
    setPagos(nuevosPagos);
  };

  const agregarPago = () => {

      const medioSeleccionado = mediosDePago.find((medio) => medio.medioPago === medioDePagoSeleccionado);
      if (!medioSeleccionado) return;
      //const yaAgregado = pagos.some((pago) => pago.medio === medioSeleccionado!.medioPago);
      const sinCargoAgregado = pagos.some((pago) => pago.id === 6);
      const esSinCargo = medioSeleccionado!.id === 6;

      // Reglas:
      // 1. No permitir agregar "Sin Cargo" si hay otro medio
      // 2. No permitir agregar otro medio si ya está "Sin Cargo"
      //if (yaAgregado) return;
      if (esSinCargo && pagos.length > 0) return;
      if (!esSinCargo && sinCargoAgregado) return; 

       // Permitir múltiples tarjetas (débito/crédito), pero no otros medios duplicados
      const esTarjeta = medioSeleccionado.medioPago.includes('Tarjeta'); // Ajusta según tus medios de pago
      const yaAgregadoNoTarjeta = !esTarjeta && pagos.some((pago) => pago.medio === medioSeleccionado.medioPago);

      if (yaAgregadoNoTarjeta) return; // Evita duplicados en medios NO tarjeta

      
      // Establecer el monto inicial: si es "Sin Cargo", usar el total, sino 0
      const montoInicial = esSinCargo ? calcularTotalConDescuento() : 0;
      
        setPagos([...pagos, { id: medioSeleccionado!.id, medio: medioSeleccionado!.medioPago, monto: montoInicial }]); // monto: 0 }]);
        setMostrarTablaPagos(true);

        // Fijar la cotización del dólar si se agrega "Efectivo Dolar"
        if (medioSeleccionado!.medioPago === 'Efectivo Dolar' && cotizacionDolar !== null) {
          setCotizacionDolarFija((prev) => prev ?? cotizacionDolar); // Solo fijar si no está ya fijada
        }

  };

  const calcularTotalPagos = () => {
    return pagos.reduce((acc, pago) => {
      const montoConvertido =
        pago.medio === 'Efectivo Dolar' && cotizacionDolarFija !== null
          ? pago.monto * cotizacionDolarFija
          : pago.monto;
      return acc + montoConvertido;
    }, 0);
  };

  const diferenciaTotal = () => {
    const sumaPagos = calcularTotalPagos();
    const totalTratamientos = calcularTotalTratamientos();
    const totalConDescuento = totalTratamientos - (voucher || 0); // Descontar el voucher
    return totalConDescuento - sumaPagos;
  };

  const agregarTratamiento = () => {
    if (tratamientoSeleccionado){ // && !tratamientosSeleccionados.some((t) => t.nombre === tratamientoSeleccionado)) {
      const tratamientoObj = tratamientos.find((t) => t.nombreTratamiento === tratamientoSeleccionado);
      if (tratamientoObj) {
        setTratamientosSeleccionados([
          ...tratamientosSeleccionados,
          { tratamientoId: tratamientoObj.id, nombre: tratamientoSeleccionado, conComision: true }
        ]); // Por defecto true
      }
      setMostrarTablaTratamientos(true);
    }
  };

  const agregarProducto = () => {
    if (productoSeleccionado && !productosSeleccionados.some((p) => p.nombre === productoSeleccionado)) {
      const productoObj = productos.find((p) => p.nombre === productoSeleccionado);
      if (productoObj) {
        setProductosSeleccionados([
          ...productosSeleccionados,
          { productoId: productoObj.id, nombre: productoSeleccionado, cantidad }
        ]);
      }
      setMostrarTablaProductos(true);
    }
  };

  const actualizarMonto = (index: number, nuevoMonto: number) => {
    const nuevosPagos = [...pagos];
    nuevosPagos[index].monto = nuevoMonto;
    setPagos(nuevosPagos);
  };

  const actualizarCantidadProducto = (index: number, nuevaCantidad: number) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index].cantidad = nuevaCantidad;
    setProductosSeleccionados(nuevosProductos);
  };

  const actualizarConComision = (index: number, conComision: boolean) => {
    const nuevosTratamientos = [...tratamientosSeleccionados];
    nuevosTratamientos[index].conComision = conComision;
    setTratamientosSeleccionados(nuevosTratamientos);
  };

  const calcularTotalTratamientos = () => {
    if (tratamientosSeleccionados.length === 0) {
      return 0;
    }

    // Verificar si hay algún medio de pago de Tarjeta De Credito o Tarjeta De Debito
    const usaOtrosMediosDePago = pagos.some(
      (pago) => pago.medio === 'Tarjeta De Credito' || pago.medio === 'Tarjeta De Debito'
    );

    return tratamientosSeleccionados.reduce((acc, tratamiento) => {
      const tratamientoEncontrado = tratamientos.find((t) => t.nombreTratamiento === tratamiento.nombre);
      if (tratamientoEncontrado) {
        const precio = usaOtrosMediosDePago
          ? tratamientoEncontrado.precioOtrosMediosDePago
          : tratamientoEncontrado.precioEfectivo;
        return acc + precio;
      }
      return acc;
    }, 0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calcularTotalConDescuento = () => {
    const totalTratamientos = calcularTotalTratamientos();
    return totalTratamientos - (voucher || 0); // Descontar el voucher
  };

  const calcularVuelto = () => {
    const diferencia = diferenciaTotal();
    return diferencia < 0 ? Math.abs(diferencia).toFixed(2) : '0.00';
  };

  useEffect(() => {
  const nuevoTotal = calcularTotalConDescuento();
  setTotal(nuevoTotal);
  const nuevoVuelto = calcularVuelto();
  setVuelto(Number(nuevoVuelto));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ calcularTotalConDescuento,calcularVuelto, total, vuelto]);

  useEffect(() => {
    setMedioDePagoListado(pagos);
    setTratamientosListado(tratamientosSeleccionados);
    setProductosListado(productosSeleccionados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagos,tratamientosSeleccionados,productosSeleccionados ])

useEffect(() => {
  // Actualizar montos de "Sin Cargo" cuando cambie el total
  // Solo actualizar si hay pagos y no estamos en proceso de eliminación
  if (pagos.length > 0) {
  const tieneSinCargo = pagos.some(pago => pago.id === 6);
  if (tieneSinCargo) {
    const nuevosPagos = pagos.map(pago => {
      if (pago.id === 6) {
        return {...pago, monto: calcularTotalConDescuento()};
      }
      return pago;
    });
    // Solo actualizar si realmente hubo un cambio
      if (JSON.stringify(nuevosPagos) !== JSON.stringify(pagos)) {
    setPagos(nuevosPagos); 
  }
}
  }

}, [calcularTotalConDescuento, pagos]); 

useEffect(() => {
  if (user?.role !== ROLES.ADMIN && !sucursalSeleccionada) {
    setSucursalSeleccionada(user?.sucursal);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

  return (
    <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
        Datos para caja
      </div>
      <div className="w-full flex justify-start items-start gap-">
        {/* Columna 1 */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <Dropdown
              options={sucursales.map((sucursal) => sucursal.nombre)}
              placeholder="Seleccione una sede"
              onChange={(value) => {
                setSucursalSeleccionada(value);
              }}
              value={sucursalSeleccionada}
              disabled={user?.role !== ROLES.ADMIN?true:false}
            />
          </div>
          <div>
            <Dropdown
              options={medicos.map((medico) => medico.nombre)}
              placeholder="Seleccione un médico"
              onChange={(value) => {
                setMedicoSeleccionado(value);
              }}
              value={medicoSeleccionado}
            />
          </div>
          <div className="flex items-center gap-2">
            <Dropdown
              options={tratamientos
                .slice() // Creamos una copia para no modificar el array original
                .sort((a, b) => a.nombreTratamiento.localeCompare(b.nombreTratamiento)) // Ordenamos alfabéticamente
                .map((tratamiento) => tratamiento.nombreTratamiento)}
              placeholder="Seleccione un tratamiento"
              onChange={handleTratamientoChange}
              value={tratamientoSeleccionado}
            />
          </div>
          <div
            data-estado="Activo"
            data-show-icon="true"
            className="w-full h-full flex justify-start items-center gap-1 ml-65 cursor-pointer"
            onClick={agregarTratamiento}
          >
            <div className="w-6 h-6 relative overflow-hidden">
              <img
                src={iconoPlus} // Cambiar a un ícono adecuado
                alt="Agregar tratamiento"
                className="absolute w-3.5 h-3.5 left-[5px] top-[5px]"
              />
            </div>
            <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
              Agregar tratamiento
            </div>
          </div>
          {mostrarTablaTratamientos && tratamientosSeleccionados.length > 0 && (
            <table className="w-105 mt-2 ml-4 border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-1 w-8">Tratamiento</th>
                  <th className="border border-gray-300 px-2 py-1 w-4">Con Comisión</th>
                  <th className="border border-gray-300 px-2 py-1 w-4">Precio</th>
                  
                </tr>
              </thead>
              <tbody>
                {tratamientosSeleccionados.map((tratamiento, index) => {
                  const tratamientoEncontrado = tratamientos.find((t) => t.nombreTratamiento === tratamiento.nombre);

                  // Verificar si hay algún medio de pago de Tarjeta De Credito o Tarjeta De Debito
                  const usaOtrosMediosDePago = pagos.some(
                    (pago) => pago.medio === 'Tarjeta De Credito' || pago.medio === 'Tarjeta De Debito'
                  );

                  const precio = tratamientoEncontrado
                    ? usaOtrosMediosDePago
                      ? tratamientoEncontrado.precioOtrosMediosDePago
                      : tratamientoEncontrado.precioEfectivo
                    : 0;

                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1 text-center">{tratamiento.nombre}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={tratamiento.conComision}
                          onChange={(e) => actualizarConComision(index, e.target.checked)}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{`$${precio.toFixed(2)}`}</td>
                      <td className="border border-gray-300 px-1 py-1 w-6">
                        <img
                          src={iconoEliminar}
                          alt="Eliminar"
                          className="cursor-pointer w-4 h-4"
                          onClick={() => setTratamientosSeleccionados(tratamientosSeleccionados.filter((_, i) => i !== index))}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>    
          )}
          <div className='mt-4'>
            <Dropdown
              options={productos
                .slice() // Creamos una copia para no modificar el array original
                .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenamos alfabéticamente
                .map((producto) => producto.nombre)}
              placeholder="Seleccione un producto"
              onChange={handlerProductoChange}
              value={productoSeleccionado}
            />
          </div>
          <div
            data-estado="Activo"
            data-show-icon="true"
            className="w-full h-full flex justify-start items-center gap-1 ml-69 cursor-pointer"
            onClick={agregarProducto}
          >
            <div className="w-6 h-6 relative overflow-hidden">
              <img
                src={iconoPlus} // Cambiar a un ícono adecuado
                alt="Agregar producto"
                className="absolute w-3.5 h-3.5 left-[5px] top-[5px]"
              />
            </div>
            <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
              Agregar producto
            </div>
          </div>
          {mostrarTablaProductos && productosSeleccionados.length > 0 && (
            <>
            <table className="w-105 mt-2 ml-4 border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-1">Producto</th>
                  <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                  
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((producto, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-6 py-1 text-center">{producto.nombre}</td>
                    <td className="border border-gray-300 px-2 py-1 w-10">
                      <input
                        type="number"
                        step={0.25}
                        min={0}
                        className="w-full text-sm p-1 border border-gray-300 rounded text-center"
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidadProducto(index, Number(e.target.value))}
                        onFocus={(e) => e.target.select()}
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1 w-6">
                      <img
                        src={iconoEliminar}
                        alt="Eliminar"
                        className="cursor-pointer w-4 h-4"
                        onClick={() => setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                     <div className="w-full h-full flex justify-start items-center gap-2 ml-4">
      <div className="w-3.5 h-3.5 flex justify-start items-center ">
        <img
          src={iconoInfo}
          alt="Información"
          className="w-3 h-3"
        />
      </div>
      <div className="text-[#5E5D5D] text-[14px] font-poppins font-normal leading-[19.6px] break-words">
       Toxinas: Ingrese la cantidad de unidades suministrada.
      </div>
    </div> 
            </>
          )}
         
        </div>
        {/* Columna 2 */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
      <Dropdown
        options={mediosDePago
          .sort((a, b) => a.id - b.id) //ordena los MPs por id
          .map((medio) => medio.medioPago)}
        placeholder="Seleccione un medio de pago"
        onChange={(value) => setMedioDePagoSeleccionado(value)}
        value={medioDePagoSeleccionado}
      />
    </div>
    <div
      data-estado="Activo"
      data-show-icon="true"
      className="w-full h-full flex justify-start items-center gap-1 ml-75 cursor-pointer"
      onClick={agregarPago}
    >
      <div className="w-6 h-6 relative overflow-hidden">
        <img
          src={iconoPlus} // Cambiar a un ícono adecuado
          alt="Agregar pago"
          className="absolute w-3.5 h-3.5 left-[5px] top-[5px]"
        />
      </div>
      <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
        Agregar pago
      </div>
    </div>
        {/* Mostrar barra de progreso si hay diferencia en el total */}
    {diferenciaTotal() !== 0 && (
      <div className="mt-4 w-105">
        <div className="w-full bg-gray-300 rounded-full h-4 ml-4">
          <div
            className={`h-4 rounded-full ${
              diferenciaTotal() > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min(
                (calcularTotalPagos() / calcularTotalConDescuento()) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-700 mt-2 ml-4 text-center">
          {diferenciaTotal() > 0
            ? `Faltan $${diferenciaTotal().toFixed(2)} del total de $${calcularTotalConDescuento().toFixed(2)}.`
            : `El monto excede el total de $${calcularTotalConDescuento().toFixed(2)} por $${Math.abs(diferenciaTotal()).toFixed(2)}.`}
        </div>
      </div>
    )}
    {mostrarTablaPagos && pagos.length > 0 && (
      <>
        <table className="w-105 mt-2 ml-4 border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-1 py-1 w-26">Medio</th>
              <th className="border border-gray-300 px-1 py-1 w-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => {
              const medio = mediosDePago.find((m) => m.medioPago === pago.medio);
              const isSinCargo = pago.id === 6;
             
              return (
                <tr key={index}>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    <span className="w-full text-sm p-1 border-none text-center">{medio?.medioPago}</span>
                  </td>
                  <td className="border border-gray-300 px-1 py-1">
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      className="w-full text-sm p-1 border border-gray-300 rounded text-center"
                      value={isSinCargo ? calcularTotalConDescuento() : pago.monto} //{pago.monto}
                      onChange={(e) => !isSinCargo && actualizarMonto(index, Number(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      readOnly={isSinCargo}
                    />
                  </td>
                  <td className="border border-gray-300 px-1 py-1 w-4">
                    <img
                      src={iconoEliminar}
                      alt="Eliminar"
                      className="cursor-pointer w-4 h-4"
                      onClick={() => eliminarPago(index)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-gray-300 px-1 py-1 font-semibold pl-4">Total</td>
              <td className="border border-gray-300 px-1 py-1 font-semibold text-center">
                {calcularTotalPagos().toFixed(2)}
              </td>
              <td className="border border-gray-300 px-1 py-1"></td>
            </tr>
          </tfoot>
        </table>
         <div className="w-full h-full flex justify-start items-center gap-2 ml-4">
          <div className="w-3.5 h-3.5 flex justify-start items-center ">
            <img
              src={iconoInfo}
              alt="Información"
              className="w-3 h-3"
            />
          </div>
          <div className="text-[#5E5D5D] text-[14px] font-poppins font-normal leading-[19.6px] break-words">
            Total expresado en pesos
          </div>
        </div> 
        {/* Mostrar siempre la cotización del dólar si "Efectivo Dolar" está presente en la tabla */}
        {pagos.some((pago) => pago.medio === 'Efectivo Dolar') && (
          <div className="mt-2">
            <label className="label-general">Cotización Dolar</label>
            <input
              type="text"
              className="input-style"
              value={`$${cotizacionDolarFija !== null ? cotizacionDolarFija.toFixed(2) : ''}`}
              onChange={(e) => {
                const sinSimbolo = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                const numero = parseFloat(sinSimbolo);
                if (!isNaN(numero)) {
                  setCotizacionDolarFija(numero);
                  setCotizacionDolar(numero);
                }
              }}
            />
          </div>
        )}
      </>
    )}
    {/* Mostrar hora de acreditación si "Transferencia" está presente */}
    {pagos.some((pago) => pago.medio === 'Transferencia') && (
      <div className="mt-2">
        <label className="label-general">Hora de acreditación</label>
        <input
          type="time"
          className="input-style"
          value={horaAcreditacion}
          onChange={(e) => setHoraAcreditacion(e.target.value)}
        />
      </div>
    )}
        <div>
      <label className="label-general">Voucher o promoción</label>
      <input
        type="number"
        step="0.01"
        min={0}
        className="input-style"
        placeholder="Ingrese el voucher o promoción"
        value={voucher !== undefined ? voucher : ""}
        onChange={(e) => setVoucher(e.target.value === "" ? undefined : Number(e.target.value))}
        onFocus={(e) => e.target.select()}
      />
         <div className="w-full h-full flex justify-start items-center gap-2 ml-4">
      <div className="w-3.5 h-3.5 flex justify-start items-center ">
        <img
          src={iconoInfo}
          alt="Información"
          className="w-3 h-3"
        />
      </div>
      <div className="text-[#5E5D5D] text-[14px] font-poppins font-normal leading-[19.6px] break-words">
        Valor en pesos
      </div>
    </div> 
    </div>
    <div>
      <label className="label-general font-bold!">Total</label>
      <input
        type="text"
        className="input-style font-semibold!"
        value={`$${calcularTotalConDescuento().toFixed(2)}`}
        readOnly
      />
    </div>
    <div>
      <label className="label-general">Vuelto</label>
      <input
        type="text"
        className="input-style"
        value={`$${calcularVuelto()}`}
        readOnly
      />
    </div>
    <div>
      <label className="label-general">Número de factura</label>
      <input
        type="text"
        className="input-style"
        placeholder="Ingrese el número de comprobante"
        value={numeroFactura}
        onChange={(e) => setNumeroFactura(e.target.value)}
      />
    <div className="w-full h-full flex justify-start items-center gap-2 ml-4">
      <div className="w-3.5 h-3.5 flex justify-start items-center ">
        <img
          src={iconoInfo}
          alt="Información"
          className="w-3 h-3"
        />
      </div>
      <div className="text-[#5E5D5D] text-[14px] font-poppins font-normal leading-[19.6px] break-words">
        Solo al emitir factura
      </div>
    </div>
    </div>   
    {/**** NOTAS ******/}
        <div>
      <label className="label-general">Notas</label>
      <textarea
      className="input-style"
      placeholder="Ingrese notas del pago"
      value={notas}
      onChange={(e) => setNotas(e.target.value)}
      />
    </div>  
        </div>
      </div>
    </div>
  );
};

export default ContenedorDatosCaja;
