import React, { useState, useEffect, useContext } from "react";
import Dropdown from "../common/Dropdown";
import BotonConIcono from "../common/BotonConIcono";
import iconoPlus from "../../assets/icon-plus-line.svg";
import iconoEliminar from "../../assets/iconoEliminar.svg";
import iconoInfo from '../../assets/iconoInfo.svg';
import { useFormularioNuevoTurno } from "../../schema/useFormularioNuevoTurno";
import { z } from "zod";
import { schema } from "../../schema/useFormularioNuevoTurno"; // Importar el esquema
import { useCargarDropdownTurnoNuevo } from "../../hooks/useCargarDropdownTurnoNuevo";
import {
  crearPacienteNuevoTurno,
  buscarPacientePorDNI,
  obtenerPacientebyId,
} from "../../services/pacientesService"; // Importar la nueva función
import { actualizarTurno, guardarTurno } from "../../services/turnosService";
import { actualizarPaciente } from "../../services/pacientesService"; // Importar la función para actualizar el paciente
import { Paciente } from "../../models/Paciente";
import { Controller } from "react-hook-form";
import { Turno } from "../../models/Turno";
import { medicosDisponiblesAgenda } from "../../services/agendaService";
import EliminarRegistro from "../common/EliminarRegistro";
import { ENTITIES } from "../../models/Entidades";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../utils/authContext';

type FormularioNuevoTurnoData = z.infer<typeof schema>;

const FormularioNuevoTurno: React.FC<{
  setMensajeExito: (mensaje: string | null) => void;
  turno?: Turno; // Prop opcional para edición
}> = ({ setMensajeExito, turno }) => {
  const { register, handleSubmit, setValue, reset, control, watch, errors } =
    useFormularioNuevoTurno();
  const {
    opcionesTratamiento,
    opcionesUsuarios,
    opcionesMedicos,
    opcionesSucursales,
    opcionesestados,
  } = useCargarDropdownTurnoNuevo(); // Usar opcionesUsuarios
  const [dropdownMedicoHabilitado, setDropdownMedicoHabilitado] =
    useState(false); // Estado para habilitar/deshabilitar el dropdown de médicos
  const [medicosDisponibles, setMedicosDisponibles] = useState(opcionesMedicos); // Estado para almacenar los médicos disponibles

  const [nombreEditable, setNombreEditable] = useState(true); // Estado para controlar si el nombre es editable

  const [mostrarModal, setMostrarModal] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchMedicoAgendaIds = async (
    fecha: Date,
    hora: number,
    sede: number
  ): Promise<number[]> => {
    try {
      const data = await medicosDisponiblesAgenda(fecha, hora, sede);
      return Array.isArray(data) ? data.map((item) => item.medicoId) : [];
    } catch (error) {
      console.error("Error al cargar los médicos disponibles:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchMedicos = async () => {
      const fechaValor = watch("fecha");
      const horarioValor = watch("horario");
      const sedeValor = watch("sede");

      if (fechaValor && horarioValor && sedeValor) {
        const idsPermitidos = await fetchMedicoAgendaIds(
          new Date(fechaValor),
          parseInt(horarioValor.split(":")[0]),
          parseInt(sedeValor)
        );
        const idsSet = new Set(idsPermitidos.map((id) => Number(id)));
        // Filtrar los médicos disponibles según los IDs permitidos
        const nuevosMedicos = opcionesMedicos.filter((medico) =>
          idsSet.has(Number(medico.id))
        );
        // Agregar el médico obligatorio (id 1) a la lista de médicos disponibles
        const medicoObligatorio = opcionesMedicos.find(
          (medico) => Number(medico.id) === 1); 
          nuevosMedicos.push(medicoObligatorio!);
          nuevosMedicos.sort((a, b) => Number(a.id) - Number(b.id)); // Ordenar por ID numéricamente

        setMedicosDisponibles(nuevosMedicos);

        setDropdownMedicoHabilitado(true);
      } else {
        setDropdownMedicoHabilitado(false);
      }
    };

    fetchMedicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opcionesMedicos, watch("fecha"), watch("horario"), watch("sede")]);

  // Efecto para cargar los datos del formulario si se pasa un turno
  useEffect(() => {
    if (turno) {
      // Filtrar las claves que no están en el esquema
      const schemaKeys = Object.keys(
        schema.shape
      ) as (keyof FormularioNuevoTurnoData)[];
      Object.entries(turno).forEach(([key, value]) => {
        if (schemaKeys.includes(key as keyof FormularioNuevoTurnoData)) {
          setValue(key as keyof FormularioNuevoTurnoData, value);
        }
      });

      const cargarDatosFormulario = async () => {
        try {
          const paciente = await obtenerPacientebyId(turno.pacienteId);
          const medico = opcionesMedicos.find((m) => m.id === turno.medicoId);
          const tratamiento = opcionesTratamiento.find(
            (t) => t.id === turno.tratamientoId
          );
          const sucursal = opcionesSucursales.find(
            (s) => s.id === turno.sucursalId
          );
          const usuario = opcionesUsuarios.find(
            (u) => u.id === turno.usuarioRegistroId
          );

          if (paciente) {
            setValue("documento", paciente.dni || "");
            setValue(
              "nombreApellido",
              `${paciente.nombre} ${paciente.apellido}`.trim()
            );
            setValue("celular", paciente.celular || "");
          }

          if (tratamiento) {
            setValue("tratamiento", tratamiento.id.toString());
          }

          if (usuario) {
            setValue("turnoAsignadoPor", usuario.id.toString());
          }

          if (medico) {
            setValue("profesionalOEquipo", medico.id.toString());
          }

          if (sucursal) {
            setValue("sede", sucursal.id.toString());
          }

          // Establecer el estado del turno
          if (turno.confirmado) {
            const estadoTurno = opcionesestados.find(
              (s) => s.estado === "Confirmado"
            );
            setValue("estadoTurno", estadoTurno?.id.toString() || "");
          } else {
            const estadoTurno = opcionesestados.find(
              (s) => s.estado === "Sin Confirmar"
            );
            setValue("estadoTurno", estadoTurno?.id.toString() || "");
          }
          if (turno.cancelado) {
            const estadoTurno = opcionesestados.find(
              (s) => s.estado === "Cancelado"
            );
            setValue("estadoTurno", estadoTurno?.id.toString() || "");
          }
          if (turno.noEncontrado) {
            const estadoTurno = opcionesestados.find(
              (s) => s.estado === "Numero No Encontrado"
            );
            setValue("estadoTurno", estadoTurno?.id.toString() || "");
          }

          if (turno.reprogramado) {
            const estadoTurno = opcionesestados.find(
              (s) => s.estado === "Reprogramado"
            );
            setValue("estadoTurno", estadoTurno?.id.toString() || "");
          }

          setValue("fecha", turno.fechaHora.split("T")[0]); // Extraer la fecha
          setValue("horario", turno.fechaHora.split("T")[1]); // Extraer la hora
        } catch (error) {
          console.error("Error al cargar los datos del formulario:", error);
        }
      };

      cargarDatosFormulario();
    } else {
      setValue("turnoAsignadoPor", user!.usuarioId.toString());
    }
  }, [
    turno,
    setValue,
    opcionesMedicos,
    opcionesTratamiento,
    opcionesSucursales,
    opcionesUsuarios,
    opcionesestados, user
  ]);
  const navigate = useNavigate();
  const onSubmit = async (data: FormularioNuevoTurnoData) => {
    try {
      if (turno) {
        // instancia el paciente asociado y si cambian los datos lo actualiza
        const pacienteUpdate = await obtenerPacientebyId(turno.pacienteId);

        if (
          pacienteUpdate.dni !== data.documento ||
          pacienteUpdate.celular !== data.celular ||
          pacienteUpdate.nombre !== data.nombreApellido.split(" ")[0] ||
          pacienteUpdate.apellido !== data.nombreApellido.split(" ")[1]
        ) {
          await actualizarPaciente(pacienteUpdate.id!, {
            nombre: data.nombreApellido.split(" ")[0] || "",
            apellido: data.nombreApellido.split(" ")[1] || "",
            celular: data.celular,
            dni: pacienteUpdate.dni,
            email: pacienteUpdate.email || "",
            direccion: pacienteUpdate.direccion || "",
            codigoPostal: pacienteUpdate.codigoPostal || "",
            medioPublicidad: pacienteUpdate.medioPublicidad || "",
            fechaNac: pacienteUpdate.fechaNac || "",
          } as Paciente);
        }

        // Actualizar turno existente
        const turnoActualizado: Turno = {
          ...turno,
          fechaHora: `${data.fecha}T${data.horario}`,
          medicoId: parseInt(data.profesionalOEquipo, 10),
          sucursalId: parseInt(data.sede, 10),
          tratamientoId: parseInt(data.tratamiento, 10),
          usuarioRegistroId: parseInt(data.turnoAsignadoPor, 10),
          asistio: false, // Propiedad obligatoria
          confirmado: false,
          cancelado: false,
          noEncontrado: false,
          reprogramado: false,
        };

        // Asignar estado según estadoTurno
        switch (data.estadoTurno) {
          case "1": // Confirmado
            turnoActualizado.confirmado = true;
            break;
          case "2": // Sin Confirmar
            // Todos en false por defecto, así que no se necesita asignar nada
            break;
          case "3": // Cancelado
            turnoActualizado.cancelado = true;
            break;
          case "4": // Reprogramado
            turnoActualizado.reprogramado = true;
            break;
          case "5": // No Encontrado
            turnoActualizado.noEncontrado = true;
            break;
          
        }
        await actualizarTurno(turno.id!, turnoActualizado);

        setMensajeExito("Turno actualizado");
        setTimeout(() => setMensajeExito(null), 3000);
        setTimeout(() => navigate("/"), 4000); // Redirigir después de 4 segundos
      } else {
        /** Crear nuevo turno */
        let paciente;

        // Buscar paciente por DNI
        if (data.documento) {
          paciente = await buscarPacientePorDNI(data.documento);
        }

        // Si no se encuentra el paciente, crearlo
        if (!paciente) {

          let dniValue = data.documento;
          if (!dniValue && data.celular) {
            // Tomar los últimos 8 dígitos del celular (eliminando posibles caracteres no numéricos)
            const numerosCelular = data.celular.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
            dniValue = numerosCelular.slice(-8); // Toma los últimos 8 caracteres
          }

          paciente = await crearPacienteNuevoTurno({
            nombre: data.nombreApellido.split(" ")[0] || "",
            apellido: data.nombreApellido.split(" ")[1] || "",
            celular: data.celular,
            dni: dniValue, //data.documento,
            email: "",
            direccion: "",
            codigoPostal: "",
            medioPublicidad: "",
            fechaNac: null,
          } as Paciente);

          if (!paciente.id) {
            throw new Error("No se pudo obtener el ID del paciente");
          }
        } else {
          // Actualizar el celular si fue modificado
          if (paciente.celular !== data.celular) {
            await actualizarPaciente(paciente.id!, {
              // Usamos el operador ! para asegurar que paciente.id no sea undefined
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              celular: data.celular,
              dni: paciente.dni,
              email: paciente.email || "",
              direccion: paciente.direccion || "",
              codigoPostal: paciente.codigoPostal || "",
              medioPublicidad: paciente.medioPublicidad || "",
              fechaNac: paciente.fechaNac || "",
            } as Paciente);
          }
        }

        // Crear el modelo de Turno
        const turno = {
          fechaHora: `${data.fecha}T${data.horario}`,
          medicoId: parseInt(data.profesionalOEquipo, 10),
          sucursalId: parseInt(data.sede, 10),
          pacienteId: paciente.id!,
          tratamientoId: parseInt(data.tratamiento, 10),
          usuarioRegistroId: parseInt(data.turnoAsignadoPor, 10),
          asistio: false, // Agregar propiedad obligatoria
        };

        // Guardar el turno
       await guardarTurno(turno);

        // Mostrar mensaje de éxito
        setMensajeExito("Turno agendado");

        // Limpiar el formulario
        setTimeout(() => setMensajeExito(null), 3000);
        reset();
        setValue("turnoAsignadoPor", user!.usuarioId.toString());
        setNombreEditable(true); // Restablecer el estado de edición del nombre
      }
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setMensajeExito(null); // Asegurarse de que no se muestre el mensaje de éxito en caso de error
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(87vh-60px)] mt-8 px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8"
    >
      <div className="flex justify-center items-start gap-24">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">Número de Documento</label>
            <input
              {...register("documento")}
              type="text"
              className="input-style disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="Ingrese el número de documento"
              disabled={!!turno}
              maxLength={8} // Limitar a 8 caracteres
              onInput={async (e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos

                if (input.value) {
                  // Validar que el DNI no esté vacío
                  try {
                    const paciente = await buscarPacientePorDNI(input.value);
                    if (paciente) {
                      setValue(
                        "nombreApellido",
                        `${paciente.nombre} ${paciente.apellido}`,
                        { shouldValidate: false, shouldDirty: true }
                      );
                      setValue("celular", paciente.celular, {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      setNombreEditable(false); // Hacer que el nombre no sea editable
                    } else {
                      setValue("nombreApellido", "", {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      setValue("celular", "", {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      setNombreEditable(true); // Permitir edición del nombre
                    }
                  } catch (error) {
                    console.error("Error al buscar paciente por DNI:", error);
                  }
                }
              }}
            />
            {turno &&
            (<div className="flex justify-start items-center ml-4">
            <div className="w-6 h-6 flex justify-start items-center ">
              <img
                src={iconoInfo}
                alt="Información"
                className="w-6 h-6"
              />
            </div>
            <div className="text-[#5E5D5D] text-[12px] font-poppins font-normal leading-[19.6px] break-words max-w-[380px]">
              Si se registro el turno sin documento, se tomará el número de celular como DNI.
            </div>
          </div>)}
            {errors.documento && (
              <p className="text-red-500 text-sm">{errors.documento.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Nombre y Apellido <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("nombreApellido")}
              type="text"
              className="input-style"
              placeholder="Ingrese el nombre y apellido"
              readOnly={!nombreEditable} // Hacer que sea de solo lectura si no es editable
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
            <label className="label-general">Celular</label>
            <input
              {...register("celular")}
              type="text"
              className="input-style"
              placeholder="Ingrese el número de celular"
              maxLength={11} // Limitar a 10 caracteres
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
              }}
            />
            <div className="flex justify-start items-center ml-4">
            <div className="w-4 h-4 flex justify-start items-center ">
              <img
                src={iconoInfo}
                alt="Información"
                className="w-4 h-4"
              />
            </div>
            <div className="text-[#5E5D5D] text-[12px] font-poppins font-normal leading-[19.6px] break-words">
              Codigo de área y número (1155555555)
            </div>
          </div>
            {errors.celular && (
              <p className="text-red-500 text-sm">{errors.celular.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Tratamiento <span className="label-asterisco">*</span>
            </label>
            <Controller
              name="tratamiento"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Dropdown
                  options={opcionesTratamiento.map((t) => t.nombreTratamiento)} // Mostrar solo nombres
                  placeholder="Seleccione un tratamiento"
                  value={
                    opcionesTratamiento.find(
                      (t) => t.id.toString() === field.value
                    )?.nombreTratamiento || ""
                  }
                  onChange={(value) => {
                    const tratamiento = opcionesTratamiento.find(
                      (t) => t.nombreTratamiento === value
                    );
                    field.onChange(
                      tratamiento ? tratamiento.id.toString() : ""
                    ); // Capturar el ID
                  }}
                />
              )}
            />
          </div>
          <div>
            <label className="label-general">
              Turno asignado por <span className="label-asterisco">*</span>
            </label>
            <Controller
              name="turnoAsignadoPor"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Dropdown
                  options={opcionesUsuarios.map((u) => u.nombre)} // Mostrar nombre y apellido concatenados
                  placeholder="Seleccione un usuario"
                  value={
                    opcionesUsuarios.find(
                      (u) => u.id.toString() === field.value
                    )?.nombre || ""
                  }
                  onChange={(value) => {
                    const usuario = opcionesUsuarios.find(
                      (u) => u.nombre === value
                    );
                    field.onChange(usuario ? usuario.id.toString() : ""); // Capturar el ID
                  }}
                  disabled={true}
                />
              )}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-6">
          {" "}
          {/* Subir la columna derecha */}
          <div>
            <label className="label-general">
              Fecha <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("fecha")}
              type="date"
              className="input-style"
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.fecha && (
              <p className="text-red-500 text-sm">{errors.fecha.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Horario <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("horario")}
              type="time"
              className="input-style"
              min="09:00"
              max="19:00"
            />
            {errors.horario && (
              <p className="text-red-500 text-sm">{errors.horario.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Sede <span className="label-asterisco">*</span>
            </label>
            <Controller
              name="sede"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Dropdown
                  options={opcionesSucursales.map((s) => s.nombre)} // Mostrar solo nombres
                  placeholder="Seleccione una opción"
                  value={
                    opcionesSucursales.find(
                      (s) => s.id.toString() === field.value
                    )?.nombre || ""
                  }
                  onChange={(value) => {
                    const sucursal = opcionesSucursales.find(
                      (s) => s.nombre === value
                    );
                    field.onChange(sucursal ? sucursal.id.toString() : ""); // Capturar el ID
                  }}
                />
              )}
            />
          </div>
          <div>
            <label className="label-general">
              Medico <span className="label-asterisco">*</span>
            </label>
            <Controller
              name="profesionalOEquipo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Dropdown
                  options={
                    !dropdownMedicoHabilitado
                      ? ["Seleccione fecha, horario y sede"]
                      : medicosDisponibles.length > 0
                      ? medicosDisponibles.map((m) => m.nombre)
                      : ["No hay médicos disponibles"]
                  }
                  placeholder="Seleccione un médico"
                  value={
                    !dropdownMedicoHabilitado
                      ? "Seleccione fecha, horario y sede"
                      : medicosDisponibles.length > 0
                      ? medicosDisponibles.find(
                          (m) => m.id.toString() === field.value
                        )?.nombre || ""
                      : "No hay médicos disponibles"
                  }
                  onChange={(value) => {
                    if (!dropdownMedicoHabilitado) return;
                    const medico = medicosDisponibles.find(
                      (m) => m.nombre === value
                    );
                    field.onChange(medico ? medico.id.toString() : "");
                  }}
                />
              )}
            />
          </div>
          <div>
            {/* Mostrar el dropdown de Estado de Turno solo si hay un turno */}
            {turno && (
              <>
                {" "}
                <label className="label-general">
                  Estado Turno <span className="label-asterisco">*</span>
                </label>
                <Controller
                  name="estadoTurno"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Dropdown
                      options={opcionesestados.map((s) => s.estado)}
                      placeholder="Seleccione el estado"
                      value={
                        opcionesestados.find(
                          (u) => u.id.toString() === field.value
                        )?.estado || ""
                      }
                      onChange={(value) => {
                        const estadoTurno = opcionesestados.find(
                          (u) => u.estado === value
                        );
                        field.onChange(
                          estadoTurno ? estadoTurno.id.toString() : ""
                        );
                      }}
                    />
                  )}
                />
              </>
            )}
          </div>
          <div className="flex justify-end mt-8 mr-4 gap-4">
            {turno && (
              <div>
                <BotonConIcono
                  label="Eliminar"
                  type="button"
                  iconSrc={iconoEliminar}
                  className="boton-con-icono-rel flex-1"
                  onClick={() => {
                    setMostrarModal(true);
                  }}
                />
              </div>
            )}
            <div>
              <BotonConIcono
                label={turno ? "Guardar" : "Agendar"}
                type="submit"
                iconSrc={iconoPlus}
                className="boton-con-icono-rel flex-1"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Muestra el modal de eliminar **/}
      {mostrarModal && (
        <EliminarRegistro
          entidad={ENTITIES.Turnos}
          id={turno!.id!}
          confirmar={true} // Cambia a true para mostrar la confirmación
          onClose={() => setMostrarModal(false)}
        />
      )}
    </form>
  );
};

export default FormularioNuevoTurno;
