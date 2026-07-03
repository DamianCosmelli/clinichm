import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoInfo from '../../assets/iconoInfo.svg';
import { ListaProductos } from '../../services/productosService';
import { ListaSucursales } from '../../services/sucursalesService';
import { ListaStock, actualizarStock, crearStock } from '../../services/stockService';
import { Producto } from '../../models/Producto';
import { Sucursal } from '../../models/Sucursal';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioNuevoIngresoStock } from '../../schema/useFormularioNuevoIngresoStock';
import { z } from 'zod';
import { schemaNuevoIngresoStock } from '../../schema/useFormularioNuevoIngresoStock';

type FormularioNuevoIngresoStockData = z.infer<typeof schemaNuevoIngresoStock>;

interface Props {
  setMensajeExito: (msg: string | null) => void;
}

const FormularioNuevoIngresoStock: React.FC<Props> = ({ setMensajeExito }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [fechaIngreso, setFechaIngreso] = useState(today);


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useFormularioNuevoIngresoStock();

  useEffect(() => {
    ListaProductos().then(setProductos);
    ListaSucursales().then(setSucursales);
    // Setear la fecha de ingreso por defecto en RHF al montar
    setValue('fechaIngreso', today);
  }, [setValue, today]);

  const onSubmit = async (data: FormularioNuevoIngresoStockData) => {
    setLoading(true);
    try {
      // Buscar si ya existe un stock con mismo producto, lote, vencimiento, fecha de ingreso y deposito
      const stocks = await ListaStock();
      const existente = stocks.find(
        (s) =>
          s.productoId === Number(data.productoId) &&
          s.lote === data.lote &&
          s.vencimiento === data.vencimiento &&
          s.deposito === data.deposito &&
          s.fechaIngreso === data.fechaIngreso
      );

      if (existente) {
        // Solo actualizar el registro existente sumando la cantidad, sin crear un nuevo movimiento
        await actualizarStock(existente.id, {
          ...existente,
          cantidadExistente: existente.cantidadExistente + Number(data.cantidadIngreso),
          cantidadIngreso: existente.cantidadIngreso + Number(data.cantidadIngreso),
          tipoOperacion: existente.tipoOperacion === "Transferencia" ? "Transferencia" : "Ingreso",
        });
      } else {
        // Crear nuevo registro de stock
        await crearStock({
          productoId: Number(data.productoId),
          lote: data.lote,
          vencimiento: data.vencimiento,
          cantidadIngreso: Number(data.cantidadIngreso),
          cantidadExistente: Number(data.cantidadIngreso),
          fechaIngreso: data.fechaIngreso,
          deposito: data.deposito,
          tipoOperacion: "Ingreso",
        });
      }
      setMensajeExito('Stock registrado');
      reset();
      setTimeout(() => {
        setMensajeExito(null);
        navigate('/stock'); 
      }, 1500);
    } catch {
      setMensajeExito(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(100vh-150px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="grid grid-cols-2 gap-40">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">
              Producto <span className="label-asterisco">*</span>
            </label>
            <select
              {...register('productoId')}
              className="input-style"
            >
              <option value="">Seleccionar producto</option>
              {productos
                .slice()
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
            </select>
            {errors.productoId && <p className="text-red-500 text-sm">{errors.productoId.message as string}</p>}
          </div>
          <div>
            <label className="label-general">
              Lote <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('lote')}
              className="input-style"
              type="text"
            />
            {errors.lote && <p className="text-red-500 text-sm">{errors.lote.message as string}</p>}
          </div>
          <div>
            <label className="label-general">
              Fecha de vencimiento <span className="label-asterisco">*</span>
            </label>
            <input
              type="date"
              {...register('vencimiento')}
              className="input-style"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.vencimiento && <p className="text-red-500 text-sm">{errors.vencimiento.message as string}</p>}
          </div>
        </div>
        {/* Columna 2 */}
        <div className="flex flex-col gap-4">
          <div className='flex flex-col gap-1'>
            <label className="label-general">
              Cantidad de ingreso <span className="label-asterisco">*</span>
            </label>
            <input
              type="number"
              {...register('cantidadIngreso')}
              min={1}
              step={0.01}
              className="input-style"
              inputMode="numeric"
              //pattern="[0-9]*"
              onInput={e => {
                const input = e.target as HTMLInputElement;
                // Permitir solo números positivos con decimales (punto o coma)
                let cleaned = input.value.replace(/[^0-9.,]/g, '');
                // Reemplazar comas por puntos y evitar múltiples puntos
                cleaned = cleaned.replace(/,/g, '.').replace(/(\..*)\./g, '$1');
                if (input.value !== cleaned) {
                  input.value = cleaned;
                }
              }}
            />
            
            {errors.cantidadIngreso && <p className="text-red-500 text-sm">{errors.cantidadIngreso.message as string}</p>}
            <div className="w-full h-full flex justify-start items-center gap-1 ml-4">
      <div className="w-3.5 h-3.5 flex justify-start items-center ">
        <img
          src={iconoInfo}
          alt="Información"
          className="w-3 h-3"
        />
      </div>
      <div className="text-[#5E5D5D] text-[14px] font-poppins font-normal leading-[19.6px] break-words">
       Ingrese unidades totales de viales, jeringas,...
      </div>
    </div> 
          </div>
           
          <div>
            <label className="label-general">
              Fecha de ingreso <span className="label-asterisco">*</span>
            </label>
            <input
              type="date"
              {...register('fechaIngreso')}
              className="input-style"
              value={fechaIngreso}
              onChange={e => {
                setFechaIngreso(e.target.value);
                setValue('fechaIngreso', e.target.value, { shouldValidate: true });
              }}
            />
            {errors.fechaIngreso && <p className="text-red-500 text-sm">{errors.fechaIngreso.message as string}</p>}
          </div>
          <div>
            <label className="label-general">
              Depósito <span className="label-asterisco">*</span>
            </label>
            <select
              {...register('deposito')}
              className="input-style"
            >
              <option value="">Seleccionar depósito</option>
              <option value="Deposito Principal">Deposito Principal</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.nombre}>{s.nombre}</option>
              ))}
            </select>
            {errors.deposito && <p className="text-red-500 text-sm">{errors.deposito.message as string}</p>}
          </div>
          <div className="flex items-center gap-2 mt-8 ml-78">
            <BotonConIcono
              label={loading ? 'Ingresando...' : 'Ingresar'}
              type="submit"
              iconSrc={iconoPlus}
              className="bg-[#005B4B] text-white rounded px-4 py-2 font-bold hover:bg-opacity-90"
             
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioNuevoIngresoStock;



