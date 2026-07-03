import React, { useEffect } from "react";
import BotonConIcono from "../common/BotonConIcono";
import iconoPlus from "../../assets/icon-plus-line.svg";
import { useFormularioNuevoPaciente } from "../../schema/useFormularioNuevoPaciente";
import { z } from "zod";
import { schema } from "../../schema/useFormularioNuevoPaciente"; // Importar el esquema actualizado
import {
  crearPacienteNuevoTurno,
  actualizarPaciente,
} from "../../services/pacientesService"; // Importar los servicios
import { Paciente } from "../../models/Paciente"; // Importar el modelo Paciente
import SelectRedSocial from "../common/SelectRedSocial";

type FormularioNuevoPacienteData = z.infer<typeof schema>; // Actualizar el tipo inferido

const FormularioNuevoPaciente: React.FC<{
  setMensajeExito: (mensaje: string | null) => void;
  paciente?: Paciente; // Prop opcional para edición
}> = ({ setMensajeExito, paciente }) => {
  const { register, handleSubmit, reset, errors, setValue } =
    useFormularioNuevoPaciente(); // Asegurarse de incluir setValue

  useEffect(() => {
    if (paciente) {
      // Filtrar las claves que no están en el esquema
      const schemaKeys = Object.keys(
        schema.shape
      ) as (keyof FormularioNuevoPacienteData)[];
      Object.entries(paciente).forEach(([key, value]) => {
        if (schemaKeys.includes(key as keyof FormularioNuevoPacienteData)) {
          setValue(key as keyof FormularioNuevoPacienteData, value);
        }
      });

      // Combinar nombre y apellido para el campo nombreApellido
      setValue(
        "nombreApellido",
        `${paciente.nombre} ${paciente.apellido}`.trim()
      );

      // Configurar la fecha de nacimiento en el formato correcto
      if (paciente.fechaNac) {
        setValue("fechaNacimiento", paciente.fechaNac);
      }
    }
  }, [paciente, setValue]);

  const onSubmit = async (data: FormularioNuevoPacienteData) => {
    try {
      if (paciente) {
        // Actualizar paciente existente
        await actualizarPaciente(paciente.id!, {
          ...paciente,
          nombre: data.nombreApellido.split(" ")[0] || "",
          apellido: data.nombreApellido.split(" ").slice(1).join(" ") || "",
          celular: data.celular || "",
          email: data.email || "",
          direccion: data.direccion || "",
          codigoPostal: data.codigoPostal || "",
          medioPublicidad: data.medioPublicidad || "",
          dni: data.dni || "",
          fechaNac: data.fechaNacimiento || "",
          soloConsulto: data.soloConsulto,
        });
        setMensajeExito("Paciente actualizado");
      } else {
        // Crear nuevo paciente
        await crearPacienteNuevoTurno({
          nombre: data.nombreApellido.split(" ")[0] || "",
          apellido: data.nombreApellido.split(" ").slice(1).join(" ") || "",
          celular: data.celular || "",
          email: data.email || "",
          direccion: data.direccion || "",
          codigoPostal: data.codigoPostal || "",
          medioPublicidad: data.medioPublicidad || "",
          dni: data.dni || "",
          fechaNac: data.fechaNacimiento || "",
          soloConsulto: data.soloConsulto,
        });
        setMensajeExito("Paciente creado");
      }
      setTimeout(() => setMensajeExito(null), 3000);
      reset();
    } catch (error) {
      console.error("Error al guardar el paciente:", error);
      setMensajeExito(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(85vh-30px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
        <div>
            <label className="label-general">
              Número de Documento <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("dni")}
              type="text"
              placeholder="Número de Documento"
              className="input-style"
              maxLength={8} // Limitar a 8 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
              }}
            />
            {errors.dni && (
              <p className="text-red-500 text-sm">{errors.dni.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Nombre y Apellido <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("nombreApellido")}
              type="text"
              placeholder="Nombre y Apellido"
              className="input-style"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, ""); // Eliminar caracteres no alfabéticos
              }}
            />
            {errors.nombreApellido && (
              <p className="text-red-500 text-sm">
                {errors.nombreApellido.message}
              </p>
            )}
          </div>
          <div>
            <label className="label-general">Fecha de Nacimiento</label>
            <input
              {...register("fechaNacimiento")}
              type="date"
              placeholder="Fecha de Nacimiento"
              className="input-style"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="label-general">Celular</label>
            <input
              {...register("celular")}
              type="text"
              placeholder="Celular"
              className="input-style"
              maxLength={11} // Limitar a 11 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
              }}
            />
          </div>
          <div>
            <label className="label-general">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="input-style"
              onInput={() => {
                if (errors.email) {
                  errors.email.message = undefined; // Borrar el mensaje de error
                }
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">Dirección</label>
            <input
              {...register("direccion")}
              type="text"
              placeholder="Dirección"
              className="input-style"
            />
          </div>
          <div>
            <label className="label-general">Código Postal</label>
            <input
              {...register("codigoPostal")}
              type="text"
              placeholder="Código Postal"
              className="input-style"
              maxLength={4} // Limitar a 5 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
              }}
            />
          </div>
          <div>
            <label className="label-general">Medio de Publicidad</label>
            <SelectRedSocial 
            name="medioPublicidad" 
            register={register} 
            className="input-style"/>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <input
              {...register("soloConsulto")}
              type="checkbox"
              className="label-general w-5 h-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
              defaultChecked={false}
              
            />
            <label className="label-checkbox">Solo Consulto</label>
          </div>
          <div className="flex justify-end mt-15 mr-4 gap-4">
            <BotonConIcono
              label={paciente ? "Guardar" : "Crear Paciente"} // Cambiar el texto del botón
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

export default FormularioNuevoPaciente;
