import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioNuevoMedico } from '../../schema/useFormularioNuevoMedico'; // Importar el esquema correcto
import { z } from 'zod';
import { schemaMedico } from '../../schema/useFormularioNuevoMedico'; // Usar el esquema de médicos
import { crearMedico } from '../../services/medicosService'; // Importar el servicio correcto
import { ListaRolesComision } from '../../services/rolesComisionService'; // Importar el servicio correcto
import { ListaSucursales } from '../../services/sucursalesService';

type FormularioNuevoMedicoData = z.infer<typeof schemaMedico>; // Usar el esquema correcto

interface FormularioNuevoMedicoProps {
  setMensajeExito: (mensaje: string | null) => void;
  initialValues?: {
    nombreApellido: string;
    matricula: string;
    rolId: string;
    sucursalID: string;
  }; // Agregar initialValues como opcional
  handleFormSubmit?: (data: FormularioNuevoMedicoData) => Promise<void>; // Agregar handleFormSubmit como opcional
}

const FormularioNuevoMedico: React.FC<FormularioNuevoMedicoProps> = ({ setMensajeExito, initialValues, handleFormSubmit }) => {
  const { register, handleSubmit, reset, errors } = useFormularioNuevoMedico(); // Usar el esquema de médicos
  const navigate = useNavigate();
  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, sucursalesData] = await Promise.all([ListaRolesComision(), ListaSucursales()]);
        setRoles(rolesData.map((role) => ({ id: role.id, nombre: role.role }))); // Mapear roles para incluir la propiedad nombre
        setSucursales(sucursalesData);
      } catch (error) {
        console.error('Error al cargar roles o sucursales:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues); // Usar valores iniciales si están disponibles
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormularioNuevoMedicoData) => {
    if (handleFormSubmit) {
      await handleFormSubmit(data); // Usar handleFormSubmit si está disponible
    } else {
      try {
        await crearMedico({
          nombre: data.nombreApellido.split(' ')[0] || '',
          apellido: data.nombreApellido.split(' ').slice(1).join(' ') || '',
          matricula: data.matricula,
          roleId: parseInt(data.rolId, 10),
          sucursalId: parseInt(data.sucursalID, 10),
        }); // Corregir la sintaxis aquí
        setMensajeExito('Médico creado');
        setTimeout(() => {
          setMensajeExito(null);
          navigate('/ajustes?tab=Medicos');
        }, 2000);
        reset();
      } catch (error) {
        console.error('Error al crear el médico:', error);
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
          <div>
            <label className="label-general">
              Matrícula <span className="label-asterisco">*</span>
            </label>
            <input
              {...register('matricula')}
              type="text"
              placeholder="Matrícula"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zA-Z0-9]/g, ''); // Permitir letras y números
              }}
            />
            {errors.matricula && <p className="text-red-500 text-sm">{errors.matricula.message}</p>} {/* Mostrar errores de matrícula */}
          </div>
        </div>
        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
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
          <div>
            <label className="label-general">Rol de comisión</label>
            <select {...register('rolId')} className="input-style">
              <option value="" disabled>
                Seleccione un rol de comisión
              </option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id} selected={initialValues?.rolId === rol.id.toString()}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            {errors.rolId && <p className="text-red-500 text-sm">{errors.rolId.message}</p>}
          </div>
            <div className="flex items-end justify-end gap-2 mt-12 ml-3">
              <BotonConIcono
                label={initialValues ? "Editar medico" : "Crear medico"} // Cambiar el texto según el contexto
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

export default FormularioNuevoMedico;
