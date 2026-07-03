import Dropdown from "../common/Dropdown";
import BotonConIcono from "../common/BotonConIcono";
import iconoEliminar from "../../assets/iconoEliminar.svg";
import iconoPlus from "../../assets/icon-plus-line.svg";
import { z } from "zod";
import { useCargarDropdownNuevaAgenda } from "../../hooks/useCargarDropdownNuevaAgenda"; // Importar el hook
import { actualizarAgenda } from "../../services/agendaService"; // Importar la función de guardar agenda
import {
  schema,
  useFormularioNuevaAgenda,
} from "../../schema/useFormularioNuevaAgenda";
import { Controller } from "react-hook-form";
import { Agenda } from "../../models/Agenda";
import { useEffect, useState } from "react";
import EliminarRegistro from "../common/EliminarRegistro";
import { ENTITIES } from "../../models/Entidades";
import { useNavigate } from "react-router-dom";

type FormularioNuevaAgendaData = z.infer<typeof schema>;

const FormularioEditarAgenda: React.FC<{
  setMensajeExito: React.Dispatch<React.SetStateAction<string | null>>;
  agenda?: Agenda; // Agregar la propiedad agenda para editar
}> = ({ setMensajeExito, agenda }) => {
  const { register, handleSubmit, reset, control, setValue, errors } =
    useFormularioNuevaAgenda();
  const { opcionesMedicos, opcionesSucursales } =
    useCargarDropdownNuevaAgenda(); // Carga los datos de los dropdowns

  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (agenda) {
      // Filtrar las claves que no están en el esquema
      const schemaKeys = Object.keys(
        schema.innerType()
      ) as (keyof FormularioNuevaAgendaData)[];
      Object.entries(agenda).forEach(([key, value]) => {
        if (schemaKeys.includes(key as keyof FormularioNuevaAgendaData)) {
          setValue(key as keyof FormularioNuevaAgendaData, value);
        }
      });

      const cargarDatosFormulario = async () => {
        try {
          const medico = opcionesMedicos.find((m) => m.id === agenda.medicoId);

          const sucursal = opcionesSucursales.find(
            (s) => s.id === agenda.sucursalId
          );

          // Establecer los valores en el formulario

          if (medico) {
            setValue("medico", medico.id.toString());
          }

          if (sucursal) {
            setValue("sede", sucursal.id.toString());
          }

          setValue("fechaInicio", agenda.fechaInicio.split("T")[0]); // Extraer la fecha
          setValue("horarioInicio", agenda.fechaInicio.split("T")[1]); // Extraer la hora Inicio
          setValue("horarioFin", agenda.fechaFin.split("T")[1]); // Extraer la hora Fin
        } catch (error) {
          console.error("Error al cargar los datos del formulario:", error);
        }
      };

      cargarDatosFormulario();
    }
  }, [agenda, setValue, opcionesMedicos, opcionesSucursales]);
  // Función para manejar el envío del formulario

  const onSubmit = async (data: FormularioNuevaAgendaData) => {
    try {
      // Crear el modelo de Agenda
      const agendaActualizada: Agenda =  {
        ...agenda, 
        fechaInicio: `${data.fechaInicio}T${data.horarioInicio}`,
        fechaFin: `${data.fechaInicio}T${data.horarioFin}`,
        medicoId: parseInt(data.medico, 10),
        sucursalId: parseInt(data.sede, 10),
      };

      // Guardar la agenda // cambiar a ActualizarAgenda
     await actualizarAgenda(agenda!.id!, agendaActualizada); //TODO: Cambiar el nombre de la función a guardarTurno


      // Mostrar mensaje de éxito
      setMensajeExito("Agenda actualizada");

      // Limpiar el formulario
      setTimeout(() => setMensajeExito(null), 3000);
      setTimeout(() => navigate(`/agenda`), 4000);// Redirigir a la página de agenda      
      reset();
      //setNombreEditable(true); // Restablecer el estado de edición del nombre
    } catch (error) {
      console.error("Error al guardar agenda:", error);
      setMensajeExito(null); // Asegurarse de que no se muestre el mensaje de éxito en caso de error
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(87vh-60px)] mt-8 px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8"
    >
      <div className="flex justify-center items-start gap-24 flex-1">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">
              Medico <span className="label-asterisco">*</span>
            </label>
            <Controller
              name="medico"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Dropdown
                  options={opcionesMedicos.map((m) => m.nombre)}
                  placeholder="Seleccione un médico"
                  value={
                    opcionesMedicos.find((s) => s.id.toString() === field.value)
                      ?.nombre || ""
                  }
                  onChange={(value) => {
                    const medico = opcionesMedicos.find(
                      (m) => m.nombre === value
                    );
                    field.onChange(medico ? medico.id.toString() : "");
                  }}
                />
              )}
            />
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
                  options={opcionesSucursales.map((s) => s.nombre)}
                  placeholder="Seleccione una sede"
                  value={
                    opcionesSucursales.find(
                      (s) => s.id.toString() === field.value
                    )?.nombre || ""
                  }
                  onChange={(value) => {
                    const sucursal = opcionesSucursales.find(
                      (s) => s.nombre === value
                    );
                    field.onChange(sucursal ? sucursal.id.toString() : "");
                  }}
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
            {...register("fechaInicio")}
            type="date"
            className="input-style"
          />
          {errors.fechaInicio && (
            <p className="text-red-500 text-sm">{errors.fechaInicio.message}</p>
          )}
        </div>
        <div>
          <label className="label-general">
            Horario Inicial<span className="label-asterisco">*</span>
          </label>
          <input
            {...register("horarioInicio")}
            type="time"
            className="input-style"
          />
          {errors.horarioInicio && (
            <p className="text-red-500 text-sm">
              {errors.horarioInicio.message}
            </p>
          )}
        </div>
        <div>
          <label className="label-general">
            Horario Fin<span className="label-asterisco">*</span>
          </label>
          <input
            {...register("horarioFin")}
            type="time"
            className="input-style"
          />
          {errors.horarioFin && (
            <p className="text-red-500 text-sm">{errors.horarioFin.message}</p>
          )}
        </div>
        <div className="flex justify-end mt-8 mr-4 gap-4">
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

          <div>
            <BotonConIcono
              label="Guardar"
              type="submit"
              iconSrc={iconoPlus}
              className="boton-con-icono-rel flex-1"
            />
          </div>
        </div>
      </div>
      {/* Muestra el modal de eliminar **/}
      {mostrarModal && (
        <EliminarRegistro
          entidad={ENTITIES.AgendaMedica}
          id={agenda!.id!}
          confirmar={true} // Cambia a true para mostrar la confirmación
          onClose={() => setMostrarModal(false)}
          redireccionar="/agenda"
        />
      )}
    </div>
    </form>
  );
};

export default FormularioEditarAgenda;
