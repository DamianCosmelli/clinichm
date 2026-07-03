import React, { useState, useEffect, useContext } from 'react';
import { ListaSucursales } from '../../services/sucursalesService';
import { ListaTratamientos } from '../../services/tratamientosService';
import { ListaMedicos } from '../../services/medicosService';
import { actualizarPaciente, buscarPacientePorDNI, crearPacienteNuevoTurno } from '../../services/pacientesService';
import { crearRecepcionPaciente } from '../../services/recepcionPacientesService';
import SelectMotivo from '../common/SelectMotivo';
import SelectRedSocial from '../common/SelectRedSocial';
import Dropdown from '../common/Dropdown';
import BotonConIcono from '../common/BotonConIcono';
import iconoPlus from '../../assets/icon-plus-line.svg';
import { useFormularioNuevaRecepcion } from "../../schema/useFormularioNuevaRecepcion";
import { Paciente } from '../../models/Paciente';
import { useNavigate } from 'react-router-dom';
import { medicosDisponiblesAgenda } from '../../services/agendaService';
import iconoInfo from '../../assets/iconoInfo.svg';
import { AuthContext } from '../../utils/authContext'; // Importar el contexto de autenticación
import { ROLES } from '../../utils/roles';


interface FormularioRecepcionProps {
  setMensajeExito: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormularioRecepcion: React.FC<FormularioRecepcionProps> = ({ setMensajeExito }) => {
  const [sedes, setSedes] = useState<{ id: number; nombre: string }[]>([]);
  const [tratamientos, setTratamientos] = useState<{ id: number; nombreTratamiento: string }[]>([]);
  const [medicos, setMedicos] = useState<{ id: number; nombre: string, apellido: string}[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [dropdownMedicoHabilitado, setDropdownMedicoHabilitado] = useState(false);
  const [medicosDisponibles, setMedicosDisponibles] = useState(medicos); // Estado para almacenar los médicos disponibles
  const navigate = useNavigate(); // Para redirección
  const { user } = useContext(AuthContext);

  const { register, handleSubmit, reset, errors, setValue, watch } = useFormularioNuevaRecepcion();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sucursalesData, tratamientosData, medicosData] = await Promise.all([
          ListaSucursales(),
          ListaTratamientos(),
          ListaMedicos(),
        ]);
        setSedes(sucursalesData);
        setTratamientos(tratamientosData);
        setMedicos(medicosData);

        // Si el usuario no es admin, setear la sede automáticamente
      if (user && user.role !== ROLES.ADMIN) {
        // Buscar la sede del usuario por ID o nombre según cómo esté en user
        const sedeUsuario = sucursalesData.find(s => s.id === user.usuarioData.sucursalID || s.nombre === user.sucursal);
        if (sedeUsuario) {
          setValue("sede", sedeUsuario.nombre);
        }
      }

        // Precargar fecha y hora actuales
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().substring(0, 5);
        setValue("fecha", currentDate);
        setValue("horaLlegada", currentTime);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [setValue, user]);

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
        const horarioValor = watch("horaLlegada");
        const sedeValor = sedes.find((s) => s.nombre === watch("sede"))?.id;
  
        if (fechaValor && horarioValor && sedeValor) {
          const idsPermitidos = await fetchMedicoAgendaIds(
            new Date(fechaValor),
            parseInt(horarioValor.split(":")[0]),
            parseInt(sedeValor.toString())
          );
          const idsSet = new Set(idsPermitidos.map((id) => Number(id)));
          // Filtrar los médicos disponibles según los IDs permitidos
          const nuevosMedicos = medicos.filter((medico) =>
            idsSet.has(Number(medico.id))
          );
          // Agregar el médico obligatorio (id 1) a la lista de médicos disponibles
          const medicoObligatorio = medicos.find(
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
    }, [medicos, watch("fecha"), watch("horaLlegada"), watch("sede")]);

  const handleDniChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
       
      const inputDni = e.target.value.replace(/\D/g, '');
      setValue("dni", inputDni);

    if (inputDni.length === 8 && watch("nombreApellido") === "") {
      try {
        const pacienteEncontrado = await buscarPacientePorDNI(inputDni);
        if (pacienteEncontrado) {
          setPaciente(pacienteEncontrado);
          setValue("nombreApellido", `${pacienteEncontrado.nombre} ${pacienteEncontrado.apellido}`);
          setValue("celular", pacienteEncontrado.celular || "");
          setValue("email", pacienteEncontrado.email || "");
          setValue("direccion", pacienteEncontrado.direccion || "");
          setValue("codigoPostal", pacienteEncontrado.codigoPostal || "");
          setValue("metodoCaptacion", pacienteEncontrado.medioPublicidad || "");
        } else {
          setPaciente(null);
          setValue("nombreApellido", "");
          setValue("celular", "");
          setValue("email", "");
          setValue("direccion", "");
          setValue("codigoPostal", "");
          setValue("metodoCaptacion", "");
        }
      } catch (error) {
        console.error('Error al buscar paciente por DNI:', error);
      }
    } else {
      //setPaciente(null);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    try {    
      let pacienteId: number;
        // Caso 1: Si paciente existe y hay cambios, actualizarlo
        if (paciente) {
          if (paciente.celular !== data.celular ||
              paciente.email !== data.email ||
              paciente.direccion !== data.direccion ||
              paciente.codigoPostal !== data.codigoPostal ||
              paciente.medioPublicidad !== data.medioPublicidad ||
              paciente.fechaNac !== data.fechaNac) {
            
            await actualizarPaciente(paciente.id!, {
              nombre: data.nombreApellido.split(" ")[0] || "",
              apellido: data.nombreApellido.split(" ").slice(1).join(" ") || "",
              celular: data.celular,
              dni: data.dni,
              email: data.email || "",
              direccion: data.direccion || "",
              codigoPostal: data.codigoPostal || "",
              medioPublicidad: data.medioPublicidad || "",
              //fechaNac: data.fechaNac || "",
            } as Paciente);
          }
          pacienteId = paciente.id!;
          setMensajeExito("Atención registrada");
        } 
        // Caso 2: Si paciente es null pero encontramos uno existente por DNI
        else {
          const pacienteEncontrado = await buscarPacientePorDNI(data.dni);
          
          if (pacienteEncontrado) {
            pacienteId = pacienteEncontrado.id!;
            setMensajeExito("Atención registrada");
          } 
          // Caso 3: Si ambos son null, crear nuevo paciente
          else {
            const nuevoPaciente = await crearPacienteNuevoTurno({
              nombre: data.nombreApellido.split(" ")[0] || "",
              apellido: data.nombreApellido.split(" ").slice(1).join(" ") || "",
              celular: data.celular || "",
              email: data.email || "",
              direccion: data.direccion || "",
              codigoPostal: data.codigoPostal || "",
              medioPublicidad: data.metodoCaptacion || "",
              dni: data.dni || "",
            });
            pacienteId = nuevoPaciente.id!;
            setMensajeExito("Paciente creado y atención registrada");
          }
        }

      const recepcionData = {
        pacienteId,
        tratamientoId: tratamientos.find((t) => t.nombreTratamiento === data.tratamiento)?.id ?? 0,
        medicoId: medicos.find((m) => `${m.nombre} ${m.apellido}` === data.medico)?.id ?? 0,
        horaIngreso: `${data.fecha}T${data.horaLlegada}:00`,
        horaAnestesia: undefined,
        estadoRecepcion: "En Espera",
        esConsulta: data.motivo === "Consulta", // Configurar esConsulta según el motivo
        piso: data.piso || "0",
        sucursalId: sedes.find((s) => s.nombre === data.sede)?.id ?? 0,
        esRetoque: data.motivo === "Retoque", // Configurar esRetoque según el motivo
        motivoConsulta: data.motivo || "",
      };
      console.log("Datos de recepción:", recepcionData); // Log para verificar los datos antes de enviar
      await crearRecepcionPaciente(recepcionData);

      setTimeout(() => setMensajeExito(null), 3000);
      setTimeout(() => navigate("/recepcion"), 2000);
      reset(); 
    } catch (error) {
      //setMensajeExito("ERROR");
      console.error("Error al registrar atención:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(100vh-180px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6 mt-70">
          <div>
            <label className="label-general">Número de Documento</label>
            <input
              {...register("dni")}
              type="text"
              placeholder="Número de documento"
              className="input-style"
              maxLength={8}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                if (errors.dni) errors.dni.message = undefined; // Borrar el mensaje de error
              }}
              onChange={handleDniChange}
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
              Puede buscar por número de celular (sin codigo de área)
            </div>
          </div>
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
              //readOnly={!!paciente} // Hacer el input de solo lectura si hay un paciente cargado
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, ""); // Eliminar caracteres no alfabéticos
                if (errors.nombreApellido) errors.nombreApellido.message = undefined; // Borrar el mensaje de error
              }}
            />
            {errors.nombreApellido && (
              <p className="text-red-500 text-sm">{errors.nombreApellido.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">
              Celular <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("celular")}
              type="text"
              placeholder="Celular"
              className="input-style"
              maxLength={11}
              //readOnly={!!paciente} // Hacer el input de solo lectura si hay un paciente cargado
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                if (errors.celular) errors.celular.message = undefined; // Borrar el mensaje de error
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
              Codigo de area y numero (1155555555)
            </div>
          </div>
          </div>
          <div>
            <label className="label-general">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="input-style"
              //readOnly={!!paciente} // Hacer el input de solo lectura si hay un paciente cargado
              onInput={() => {
                if (errors.email) errors.email.message = undefined; // Borrar el mensaje de error
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label-general">Dirección</label>
            <input
              {...register("direccion")}
              type="text"
              placeholder="Dirección"
              className="input-style"
              //readOnly={!!paciente} // Hacer el input de solo lectura si hay un paciente cargado
            />
          </div>
          <div>
            <label className="label-general">Código Postal</label>
            <input
              {...register("codigoPostal")}
              type="text"
              placeholder="Código Postal"
              className="input-style"
              maxLength={4}
              //readOnly={!!paciente} // Hacer el input de solo lectura si hay un paciente cargado
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                if (errors.codigoPostal) errors.codigoPostal.message = undefined; // Borrar el mensaje de error
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
              Solo números
            </div>
          </div>
          </div>
          <div>
              <label className="label-general">Medio de Publicidad</label>
            <SelectRedSocial
              {...register("metodoCaptacion")}
              name="metodoCaptacion"
              className="input-style"
              onChange={(e) => setValue("metodoCaptacion", e.target.value)} // Guardar el valor seleccionado en el estado del formulario
              value={watch("metodoCaptacion")} // Usar watch para obtener el valor actual
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-6 mt-70">
          <div>
            <label className="label-general">Hora de llegada</label>
            <input
              {...register("horaLlegada")}
              type="time"
              className="input-style"
              min="09:00"
              max="19:00"
              defaultValue={watch("horaLlegada")} // Precargar con la hora actual
            />
          </div>
          <div>
            <label className="label-general">
              Fecha <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("fecha")}
              type="date"
              className="input-style"
              defaultValue={watch("fecha")} // Precargar con la fecha actual
            />
            {errors.fecha && (
              <p className="text-red-500 text-sm">{errors.fecha.message}</p>
            )}
          </div>
          <div>
            <Dropdown
              options={sedes.map((sede) => sede.nombre)} // Convertir a array de strings
              placeholder="Seleccione una sede"
              onChange={(value) => {
                setValue("sede", value);
              }}
              value={watch("sede")} // Usar watch para obtener el valor actual
              className="input-style"
              disabled={user?.role != ROLES.ADMIN ? true : false}// Deshabilitar si no es admin
            />
          </div>
          <div>
            <Dropdown
              options={["Piso 1", "Piso 2"]} // Array de strings directamente
              placeholder="Seleccione el piso"
              onChange={(value) => {
                setValue("piso", value === "Piso 1" ? "1" : "2");
              }}
              value={watch("piso") === "1" ? "Piso 1" : watch("piso") === "2" ? "Piso 2" : ""} // Usar watch para obtener el valor actual
              className="input-style"
            />
          </div>
          <div>
            <SelectMotivo
              {...register("motivo")}
              name="motivo"
              className="input-style"
              onChange={(e) => setValue("motivo", e.target.value)} // Guardar el valor seleccionado en el estado del formulario
              value={watch("motivo")} // Usar watch para obtener el valor actual
            />
          </div>
          <div>
            <Dropdown
              options={tratamientos.map((tratamiento) => tratamiento.nombreTratamiento)} // Convertir a array de strings
              placeholder="Seleccione un tratamiento"
              onChange={(value) => {
                setValue("tratamiento", value);
              }}
              value={watch("tratamiento")} // Usar watch para obtener el valor actual
              className="input-style"
            />
          </div>
          <div>
            <Dropdown
              options={
                    !dropdownMedicoHabilitado
                      ? ["Seleccione fecha, horario y sede"]
                      : medicosDisponibles.length > 0
                      ? medicosDisponibles.map((m: { id: number; nombre: string; apellido: string }) => `${m.nombre} ${m.apellido}`)
                      : ["No hay médicos disponibles"]
                  }
              placeholder="Seleccione un médico"
              onChange={(value) => {
                    if (!dropdownMedicoHabilitado) return;
                    const medico = medicosDisponibles.find(
                      (m) => `${m.nombre} ${m.apellido}` === value
                    );
                    setValue("medico", medico ? `${medico.nombre} ${medico.apellido}` : "");
                  }}
              value={watch("medico")} // Usar watch para obtener el valor actual
              className="input-style"
            />
          </div>
        </div>
      </div>
      <BotonConIcono
        label="Registrar"
        type="submit"
        iconSrc={iconoPlus}
        className="bg-blue-500 text-white mt-220 ml-192"
      />
    </form>
  )
};

export default FormularioRecepcion;