import React, { useEffect, useState } from "react";
import { RecepcionPacientes } from "../../models/RecepcionPacientes";
import { ListaTratamientos } from "../../services/tratamientosService";
import { ListaMedicos } from "../../services/medicosService";
import SelectEstadosRecepcion from "../common/SelectEstadosRecepcion";
import Dropdown from "../common/Dropdown";
import SelectMotivo from "../common/SelectMotivo";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import BotonConIcono from "../common/BotonConIcono";
import iconoEliminar from "../../assets/iconoEliminar.svg";
import iconoGuardar from "../../assets/icon-plus-line.svg";
import Loading from "../../pages/common/Loading";
import EliminarRegistro from "../common/EliminarRegistro";
import { actualizarRecepcionPaciente } from "../../services/recepcionPacientesService";
import iconCheck from "../../assets/icon-check.svg"; // Importar el ícono de éxito
import { useNavigate } from "react-router-dom"; // Importar para redirección
import { EventoRecepcionCalendar } from "../../models/EventoRecepcionCalendar";
import { medicosDisponiblesAgenda } from "../../services/agendaService";

interface RecepcionEditModalProps {
  recepcionData: EventoRecepcionCalendar;
  onClose: () => void;
}

const RecepcionEditModal: React.FC<RecepcionEditModalProps> = ({
  recepcionData,
  onClose,
}) => {
  const [recepcion, setRecepcion] = useState<RecepcionPacientes | null>(null);
  const [tratamientos, setTratamientos] = useState<
    { id: number; nombreTratamiento: string }[]
  >([]);
  const [medicos, setMedicos] = useState<
    { id: number; nombre: string; apellido: string }[]
  >([]);
  const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const navigate = useNavigate(); // Para redirección
  const [medicosDisponibles, setMedicosDisponibles] = useState(medicos); // Estado para almacenar los médicos disponibles
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recepcionEncontrada: RecepcionPacientes = {
          id: recepcionData.id,
          pacienteId: recepcionData.pacienteId,
          tratamientoId: recepcionData.tratamientoId,
          medicoId: recepcionData.medicoId,
          sucursalId: recepcionData.sucursalId,
          horaIngreso: recepcionData.horaIngreso,
          piso: recepcionData.pisoNumero.toString(),
          estadoRecepcion: recepcionData.estado,
          motivoConsulta: recepcionData.motivoConsulta,
          horaAnestesia: recepcionData.horaAnestesia,
          esConsulta: recepcionData.esConsulta,
          esRetoque: recepcionData.esRetoque,
        };

        setRecepcion(recepcionEncontrada || null);

        if (recepcionEncontrada) {
          
          const tratamientosList = await ListaTratamientos();
          setTratamientos(tratamientosList);

          const medicosList = await ListaMedicos();
          setMedicos(medicosList);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, [recepcionData]);

  // Manejo de medicos disponibles de agenda
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
          const fechaValor = recepcionData.horaIngreso.substring(0,10);
          const horarioValor = recepcionData.horaIngreso.substring(11,13);
          const sedeValor = recepcionData.sucursalId; 
    
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
            
    
          } 
        };
    
        fetchMedicos();
      }, [medicos, recepcionData]);

  const handleGuardar = async () => {
    try {
      if (recepcion) {
        const horaAnestesiaISO = recepcion.horaAnestesia
          ? `${recepcion.horaIngreso.substring(0,10)}T${recepcion.horaAnestesia}:00`
          : undefined;

        await actualizarRecepcionPaciente(recepcion.id, {
          pacienteId: recepcion.pacienteId,
          tratamientoId: recepcion.tratamientoId,
          medicoId: recepcion.medicoId,
          horaIngreso: recepcion.horaIngreso,
          horaAnestesia: horaAnestesiaISO,
          estadoRecepcion: recepcion.estadoRecepcion,
          piso: recepcion.piso,
          sucursalId: recepcion.sucursalId,
          esConsulta: recepcion.motivoConsulta === "Consulta",
          esRetoque: recepcion.motivoConsulta === "Retoque",
          motivoConsulta: recepcion.motivoConsulta,
        });

        setMensajeExito("Recepción actualizada");
        setTimeout(() => {
          setMensajeExito(null);
          navigate("/recepcion"); // Redirigir a "Recepcion"
        }, 3000);
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Recarga la página
      }
    } catch (error) {
      console.error("Error al actualizar la recepción:", error);
      setMensajeExito("Error al actualizar la recepción");
      setTimeout(() => setMensajeExito(null), 3000);
    }
  };

  if (!recepcion) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 relative">
        <img
          src={iconoCerrar}
          alt="Cerrar"
          className="iconSize cursor-pointer absolute top-2 right-2"
          onClick={onClose}
        />
        <div className="absolute top-16 right-65 z-10">
          {" "}
          {/* Ajustar posición del botón Eliminar */}
          <BotonConIcono
            label="Eliminar"
            iconSrc={iconoEliminar}
            className="boton-eliminar"
            onClick={() => setMostrarEliminarModal(true)}
          />
        </div>
        {/* Botón Editar */}
        <div className="absolute top-16 right-27 z-10">
          {" "}
          {/* Ajustar posición del botón Editar */}
          <BotonConIcono
            label="Guardar"
            iconSrc={iconoGuardar}
            className="boton-editar"
            onClick={handleGuardar}
          />
        </div>
        <div
          className="mb-4 mt-8 ml-5"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <div className="text-lg font-semibold">{recepcionData.paciente}</div>
          <div>{recepcionData.tratamiento}</div>
          <div>
            {new Date(recepcion.horaIngreso).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}{" "}
            {new Date(recepcion.horaIngreso)
              .toLocaleTimeString()
              .substring(0, 5)}
          </div>
          <div>
            {`Sede: `}
            <span className="font-bold">{recepcionData.sucursal}</span>,{" "}
            {`Piso: `}
            <span className="font-bold">{recepcion.piso}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="mt-4">
            <SelectEstadosRecepcion
              name="estadoRecepcion"
              className="input-style mb-4"
              placeholder="Estado del turno"
              value={recepcion.estadoRecepcion}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;
                setRecepcion((prev) =>
                  prev ? { ...prev, estadoRecepcion: value } : prev
                );
              }}
            />
            <div className="mt-4"></div>
            <Dropdown
              options={["Piso 1", "Piso 2"]} // Array de opciones para los pisos
              placeholder="Seleccione el piso"
              className="input-style mb-4"
              value={`Piso ${recepcion.piso}`} // Precargar con el piso actual
              onChange={(value) => {
                const pisoSeleccionado = value === "Piso 1" ? "1" : "2";
                setRecepcion((prev) =>
                  prev ? { ...prev, piso: pisoSeleccionado } : prev
                ); // Guardar el piso editado en recepcion
              }}
            />
            <div className="mt-4">
            <Dropdown
              options={medicosDisponibles.map((medico) => `${medico?.nombre} ${medico?.apellido}`)}
              placeholder="Seleccione un médico"
              className="input-style mb-4"
              value={`${medicosDisponibles.find((m) => m?.id === recepcion.medicoId)?.nombre} ${
                medicosDisponibles.find((m) => m?.id === recepcion.medicoId)?.apellido
              }`}
              onChange={(value) => {
                const [nombre, apellido] = value.split(" ");
                const medicoSeleccionado = medicosDisponibles.find(
                  (medico) => medico.nombre === nombre && medico.apellido === apellido
                );
                setRecepcion((prev) => prev ? { ...prev, medicoId: medicoSeleccionado?.id || prev.medicoId } : prev);
              }}
            />
            </div>
            <div className="mt-4"></div>
            <label className="label-general ">
              Número de Documento <span className="label-asterisco">*</span>
            </label>
            <input
              type="text"
              className="input-style input-readonly"
              value={recepcionData.pacienteDNI}
              readOnly
            />
            <div className="mt-4"></div>
            <label className="label-general mt-2">Email</label>
            <input
              type="email"
              className="input-style input-readonly"
              value={recepcionData.pacienteMail}
              readOnly
            />
          </div>
          <div>
            <div className="mt-4"></div>
            <SelectMotivo
              name="motivoConsulta"
              className="input-style mb-4"
              value={recepcion.motivoConsulta}
              placeholder="Seleccione un motivo"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;
                setRecepcion((prev) =>
                  prev ? { ...prev, motivoConsulta: value } : prev
                );
              }}
            />
            <div className="mt-4"></div>
            <Dropdown
              options={tratamientos.map(
                (tratamiento) => tratamiento.nombreTratamiento
              )}
              placeholder="Seleccione un tratamiento"
              className="input-style mb-4"
              value={
                tratamientos.find((t) => t.id === recepcion.tratamientoId)
                  ?.nombreTratamiento
              }
              onChange={(value) => {
                const tratamientoSeleccionado = tratamientos.find(
                  (tratamiento) => tratamiento.nombreTratamiento === value
                );
                setRecepcion((prev) =>
                  prev
                    ? {
                        ...prev,
                        tratamientoId:
                          tratamientoSeleccionado?.id || prev.tratamientoId,
                      }
                    : prev
                );
              }}
            />
            <div className="mt-4"></div>
            <label className="label-general mt-2">¿Necesita anestesia?</label>
            <Dropdown
              options={["Sí", "No"]}
              placeholder="Seleccione una opción"
              className="input-style mb-4"
              value={recepcion?.horaAnestesia !== undefined  ? "Sí" : "No"}
              onChange={(value) => {
                setRecepcion((prev) =>
                  prev
                    ? {
                        ...prev,
                        horaAnestesia: value === "Sí" ?  prev.horaAnestesia || "" : undefined,
                      }
                    : prev
                );
              }}
            />
            {recepcion?.horaAnestesia !== undefined && (
              <>
                <label className="label-general mt-2">Hora anestesia</label>
                <input
                  type="time"
                  className="input-style"
                  value={recepcion?.horaAnestesia && recepcion?.horaAnestesia.length >= 5
                  ? recepcion.horaAnestesia.length > 5
                    ? recepcion.horaAnestesia.substring(11, 16)
                    : recepcion.horaAnestesia
                  : ""}
                  onChange={(e) => {
                    setRecepcion((prev) =>
                      prev ? { ...prev, horaAnestesia: e.target.value } : prev
                    );
                  }}
                />
              </>
            )}
            <div className="mt-4"></div>
            <label className="label-general mt-2">
              Celular <span className="label-asterisco">*</span>
            </label>
            <input
              type="text"
              className="input-style"
              value={recepcionData.pacienteCelular}
              onChange={() => {}}
            />
          </div>
        </div>
        {mostrarEliminarModal && (
          <EliminarRegistro
            entidad="recepcionPacientes"
            id={recepcionData.id}
            confirmar={true}
            redireccionar="/recepcion"
            onClose={() => {
              setMostrarEliminarModal(false);
              window.location.reload(); // Recarga la página
            }}
          />
        )}
        {mensajeExito && (
          <div className="absolute top-30 right-12 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
            <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
            <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
              {mensajeExito}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecepcionEditModal;
