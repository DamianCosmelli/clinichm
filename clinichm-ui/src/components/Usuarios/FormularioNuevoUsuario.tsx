import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioNuevoUsuario } from '../../schema/useFormularioNuevoUsuario'; // Ruta corregida
import { z } from 'zod';
import { schema } from '../../schema/useFormularioNuevoUsuario';
import { crearUsuario } from '../../services/usuariosService';
import { ListaRoles } from '../../services/rolesService';
import { ListaSucursales } from '../../services/sucursalesService';
import iconoInfo from '../../assets/iconoInfo.svg';

type FormularioNuevoUsuarioData = z.infer<typeof schema> & { celular?: string }; // Hacer celular opcional

interface FormularioNuevoUsuarioProps {
  setMensajeExito: (mensaje: string | null) => void;
  initialValues?: Partial<FormularioNuevoUsuarioData>; // Valores iniciales opcionales
  handleFormSubmit?: (data: FormularioNuevoUsuarioData) => Promise<void>; // Función personalizada para manejar el envío
}

const FormularioNuevoUsuario: React.FC<FormularioNuevoUsuarioProps> = ({
  setMensajeExito,
  initialValues,
  handleFormSubmit,
}) => {
  const { register, handleSubmit, reset, errors } = useFormularioNuevoUsuario(); // Eliminar formState
  const navigate = useNavigate();
  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, sucursalesData] = await Promise.all([ListaRoles(), ListaSucursales()]);
        setRoles(rolesData);
        setSucursales(sucursalesData);
      } catch (error) {
        console.error('Error al cargar roles o sucursales:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues); // Precargar valores iniciales
    }
  }, [initialValues, reset]);

  const defaultFormSubmit = async (data: FormularioNuevoUsuarioData) => {
    try {
      await crearUsuario({
        userName: data.userName,
        nombre: data.nombreApellido.split(' ')[0] || '',
        apellido: data.nombreApellido.split(' ').slice(1).join(' ') || '',
        password: data.password,
        rolId: parseInt(data.rolId, 10),
        celular: data.celular,
        sucursalID: parseInt(data.sucursalID, 10),
      });
      setMensajeExito('Usuario creado');
      setTimeout(() => {
        setMensajeExito(null);
        navigate('/usuarios'); // Redirigir a la página de usuarios
      }, 3000);
      reset();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setMensajeExito(null);
    }
  };

  const onSubmit = handleFormSubmit || defaultFormSubmit; // Usar la función personalizada si se proporciona

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
              Nombre y Apellido <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('nombreApellido')}
              type="text"
              placeholder="Nombre y Apellido"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, ""); // Eliminar caracteres no alfabéticos
              }}
            />
            {errors.nombreApellido && <p className="text-red-500 text-sm">{errors.nombreApellido.message}</p>}
          </div>
          <div className='flex flex-col'>
            <label className="label-general">Nombre de usuario</label>
            <input
              {...register('userName')}
              type="text"
              placeholder="Nombre de usuario"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-z0-9]/g, ""); // Solo minúsculas y números
              }}
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
       En minusculas. Acepta números.(Ej: usuario123)
      </div>
    </div> 
            {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
          </div>
          <div className='flex flex-col'>
            <label className="label-general">Contraseña</label>
            <input
              {...register('password')}
              type="text"
              placeholder="Contraseña"
              className="input-style"
              maxLength={12} // Limitar a 12 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zA-Z0-9!@#$%]/g, ""); // Permite letras, números y caracteres especiales comunes
              }}
            />
            <div className="w-full h-full flex justify-start items-center gap-2 ml-4">
              <div className="w-3.5 h-3.5 flex justify-start items-center ">
                <img
                  src={iconoInfo}
                  alt="Información"
                  className="w-3 h-3"
                  title='Letras (mayúsculas y minúsculas), números y caracteres especiales !@#$%'
                />
              </div>
              <span className="text-[#5E5D5D] text-sm font-poppins font-normal leading-[19.6px]" title='Letras (mayúsculas y minúsculas), números y caracteres especiales !@#$%'>
                  Debe tener entre 6 y 12 caracteres.
              </span>
          </div> 
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className='flex flex-col'>
            <label className="label-general">Celular</label>
            <input
              {...register('celular')}
              type="text"
              placeholder="Celular"
              className="input-style"
              maxLength={11} // Limitar a 11 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
              }}
            />
            {errors.celular && <p className="text-red-500 text-sm">{errors.celular.message}</p>}
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">Rol</label>
            <select {...register('rolId')} className="input-style">
              <option value="" disabled>
                Seleccione un rol
              </option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id} selected={initialValues?.rolId === rol.id.toString()}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            {errors.rolId && <p className="text-red-500 text-sm">{errors.rolId.message}</p>}
          </div>
          <div>
            <label className="label-general">Sucursal</label>
            <select {...register('sucursalID')} className="input-style">
              <option value="" disabled>
                Seleccione una sucursal
              </option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id} selected={initialValues?.sucursalID === sucursal.id.toString()}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
            {errors.sucursalID && <p className="text-red-500 text-sm">{errors.sucursalID.message}</p>}
          </div>
          {/* 
          <div>
            <label className="label-general">
              Rol asignado por <span className="label-asterisco">*</span>
            </label>
            <input type="text" value="Luciana Ortiz" readOnly className="input-style input-readonly" />
          </div>
          */}
        </div>
      </div>
      <div className="flex justify-end w-full max-w-4xl col-span-2 fixed bottom-20 right-43">
        <BotonConIcono
          label={initialValues ? "Guardar" : "Crear Usuario"}
          type="submit"
          iconSrc={iconoPlus}
          className="boton-con-icono"
        />
      </div>
    </form>
  );
};

export default FormularioNuevoUsuario;
