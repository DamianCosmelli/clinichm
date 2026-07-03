import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioEmpleado } from '../../schema/useFormularioEmpleado';
import { z } from 'zod';
import { schemaEmpleado } from '../../schema/useFormularioEmpleado';
import { crearEmpleado } from '../../services/empleadosService';

type FormularioEmpleadoData = z.infer<typeof schemaEmpleado>;

interface FormularioEmpleadoProps {
  setMensajeExito: (mensaje: string | null) => void;
  initialValues?: {
    nombreApellido: string;
    dni: string;
  };
  handleFormSubmit?: (data: FormularioEmpleadoData) => Promise<void>;
}

const FormularioEmpleado: React.FC<FormularioEmpleadoProps> = ({ setMensajeExito, initialValues, handleFormSubmit }) => {
  const { register, handleSubmit, reset, errors } = useFormularioEmpleado();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormularioEmpleadoData) => {
    if (handleFormSubmit) {
      await handleFormSubmit(data);
    } else {
      try {
        const partes = data.nombreApellido.trim().split(/\s+/);
        const nombre = partes.slice(0, 2).join(' ');
        const apellido = partes.slice(2).join(' ');
        await crearEmpleado({ nombre, apellido, dni: data.dni });
        setMensajeExito('Empleado creado');
        setTimeout(() => {
          setMensajeExito(null);
          navigate('/ajustes?tab=Empleados');
        }, 2000);
        reset();
      } catch (error) {
        console.error('Error al crear el empleado:', error);
        setMensajeExito(null);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(87vh-60px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="flex flex-row gap-6 w-full max-w-4xl">
        <div className="flex-1">
          <label className="label-general">
            Nombre y Apellido <span className="label-asterisco">*</span>
          </label>
          <input
            {...register('nombreApellido')}
            type="text"
            placeholder="Nombre y Apellido"
            className="input-style"
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, '');
            }}
          />
          {errors.nombreApellido && <p className="text-red-500 text-sm">{errors.nombreApellido.message}</p>}
        </div>
        <div className="flex-1">
          <label className="label-general">
            Documento <span className="label-asterisco">*</span>
          </label>
          <input
            {...register('dni')}
            type="text"
            placeholder="DNI"
            className="input-style"
            maxLength={8} // Limitar a 8 caracteres
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
            }}
          />
          {errors.dni && <p className="text-red-500 text-sm">{errors.dni.message}</p>}
        </div>

          <div className="flex items-end justify-end gap-2 mt-40">
            <BotonConIcono
              label={initialValues ? "Editar empleado" : "Crear empleado"}
              type="submit"
              iconSrc={iconoPlus}
              className="boton-con-icono"
            />
          </div>
      </div>
      
    </form>
  );
};

export default FormularioEmpleado;
