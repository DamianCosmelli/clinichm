import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioNuevaSucursal } from '../../schema/useFormularioNuevaSucursal'; // Importar el esquema correcto
import { z } from 'zod';
import { schemaSucursal } from '../../schema/useFormularioNuevaSucursal'; // Usar el esquema de sucursales
import { crearSucursal } from '../../services/sucursalesService'; // Importar el servicio correcto

type FormularioNuevaSucursalData = z.infer<typeof schemaSucursal>;

interface FormularioNuevaSucursalProps {
  setMensajeExito: (mensaje: string | null) => void;
  initialValues?: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
  };
  handleFormSubmit?: (data: FormularioNuevaSucursalData) => Promise<void>;
}

const FormularioNuevaSucursal: React.FC<FormularioNuevaSucursalProps> = ({ setMensajeExito, initialValues, handleFormSubmit }) => {
  const { register, handleSubmit, reset, errors } = useFormularioNuevaSucursal();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormularioNuevaSucursalData) => {
    if (handleFormSubmit) {
      await handleFormSubmit(data);
    } else {
      try {
        await crearSucursal(data);
        setMensajeExito('Sucursal creada');
        setTimeout(() => {
          setMensajeExito(null);
          navigate('/ajustes?tab=Sedes');
        }, 2000);
        reset();
      } catch (error) {
        console.error('Error al crear la sucursal:', error);
        setMensajeExito(null);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(87vh-60px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">
              Nombre <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('nombre')}
              type="text"
              placeholder="Nombre"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, '');
              }}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="label-general">
              Dirección <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('direccion')}
              type="text"
              placeholder="Dirección"
              className="input-style"
            />
            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion.message}</p>}
          </div>
        </div>
        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">
              Ciudad <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('ciudad')}
              type="text"
              placeholder="Ciudad"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, '');
              }}
            />
            {errors.ciudad && <p className="text-red-500 text-sm">{errors.ciudad.message}</p>}
          </div>
          <div>
            <label className="label-general">
              Código Postal <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('codigoPostal')}
              type="text"
              placeholder="Código Postal"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, '');
              }}
            />
            {errors.codigoPostal && <p className="text-red-500 text-sm">{errors.codigoPostal.message}</p>}
          </div>

          <div className="flex items-end justify-end gap-2 mt-12 ml-3">
        <BotonConIcono
          label={initialValues ? "Editar sede" : "Crear sede"} // Cambiar el texto según el contexto
          type="submit"
          iconSrc={iconoPlus}
          className="boton-con-icono"
        />
      </div>
        </div>
      </div>
      
    </form>
  );
};

export default FormularioNuevaSucursal;
