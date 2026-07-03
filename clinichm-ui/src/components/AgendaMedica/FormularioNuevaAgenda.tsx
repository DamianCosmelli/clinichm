import Dropdown from "../common/Dropdown";
import BotonConIcono from "../common/BotonConIcono";
import iconoPlus from "../../assets/icon-plus-line.svg";
import { z } from "zod";
import { useCargarDropdownNuevaAgenda } from "../../hooks/useCargarDropdownNuevaAgenda"; // Importar el hook
import { guardarAgenda } from "../../services/agendaService"; // Importar la función de guardar agenda
import {
  schema,
  useFormularioNuevaAgenda,
} from "../../schema/useFormularioNuevaAgenda";
import { Controller } from "react-hook-form";
import { useState } from "react";

type FormularioNuevaAgendaData = z.infer<typeof schema>;

const FormularioNuevaAgenda: React.FC<{
  setMensajeExito: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setMensajeExito }) => {
  const { register, handleSubmit, reset, control, errors } =
    useFormularioNuevaAgenda();
  const { opcionesMedicos, opcionesSucursales } =
    useCargarDropdownNuevaAgenda(); // Carga los datos de los dropdowns
  const [usarRango, setUsarRango] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // manejo de multiple agenda
  const crearAgendas = (data: FormularioNuevaAgendaData) => {
    const agendas = [];

    if (!usarRango || !data.fechaFinal) {
      // Caso 1: No hay rango de fechas - crear una sola agenda
      agendas.push({
        fechaInicio: `${data.fechaInicio}T${data.horarioInicio}`,
        fechaFin: `${data.fechaInicio}T${data.horarioFin}`,
        medicoId: parseInt(data.medico, 10),
        sucursalId: parseInt(data.sede, 10),
      });
    } else {
      // Caso 2: Hay rango de fechas - crear una agenda por cada día
      const fechaInicio = new Date(data.fechaInicio);
      const fechaFin = new Date(data.fechaFinal);
      
      // Validar fechas
      if (fechaFin < fechaInicio) {
        throw new Error('La fecha final no puede ser anterior a la fecha inicial');
      }
      
      // Calcular días de diferencia
      const diffTime = fechaFin.getTime() - fechaInicio.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Crear agenda para cada día
      for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(fechaInicio);
        currentDate.setDate(fechaInicio.getDate() + i);

        // Obtener día de la semana (0: lunes, 6: domingo)
            const dayOfWeek = currentDate.getDay();
            
        // Saltar domingos
        if (dayOfWeek === 6) continue;
        
        const dateStr = currentDate.toISOString().split('T')[0];

        // Para sábados usar horario fin a las 14:00, de lo contrario usar el horario normal
        const horarioFin = dayOfWeek === 5 ? '14:00' : data.horarioFin;
        
        agendas.push({
          fechaInicio: `${dateStr}T${data.horarioInicio}`,
          fechaFin: `${dateStr}T${horarioFin}`,
          medicoId: parseInt(data.medico, 10),
          sucursalId: parseInt(data.sede, 10),
        });
      }
    }

    return agendas;
  };

  const onSubmit = async (data: FormularioNuevaAgendaData) => {
    setGuardando(true);
    try {
       // Crear las agendas (una o varias según el caso)
       const agendas = crearAgendas(data);

       // Guardar cada agenda
       for (const agenda of agendas) {
         await guardarAgenda(agenda);
       }

      // Mostrar mensaje de éxito
      //setMensajeExito("Agenda registrada");

      // Mostrar mensaje de éxito
      setMensajeExito(
        agendas.length > 1 
          ? `Se crearon ${agendas.length} agendas correctamente` 
          : "Agenda registrada correctamente"
      );


      // Limpiar el formulario
      setTimeout(() => setMensajeExito(null), 3000);
      reset();
      //setNombreEditable(true); // Restablecer el estado de edición del nombre
    } catch (error) {
      console.error("Error al guardar agenda:", error);
      setMensajeExito(null); // Asegurarse de que no se muestre el mensaje de éxito en caso de error
    }finally {
      setGuardando(false);
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
                      ?.nombre|| ""
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
          <div className="mt-5">
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
          
          {/* Subir la columna derecha */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
            <label className="label-general">
              {usarRango ? "Fecha Incial" : "Fecha"} <span className="label-asterisco">*</span>
            </label>
            <input {...register("fechaInicio")} type="date" className={usarRango ? "input-horario" : "input-style"} />
            {errors.fechaInicio && (
              <p className="text-red-500 text-sm">{errors.fechaInicio.message}</p>
            )}
            {/* Checkbox para usar rango de fecha */}
            <label className="flex items-center ml-5 mt-1 gap-1 text-sm font-medium text-gray-700">
              <input type="checkbox" 
              className="form-checkbox" 
              checked={usarRango}
              onChange={() => {
                setUsarRango(!usarRango);
                if (!usarRango) {
                  reset({ fechaFinal: "" });
                }
              }}
              />
              Usar rango de fecha
            </label>
            </div>

            {usarRango && (
              <div className="flex-1 min-w-[200px]">
              <label className="label-general">
              Fecha Final<span className="label-asterisco">*</span>
            </label>
            <input {...register("fechaFinal")} type="date" className="input-horario" />
            {errors.fechaFinal && (
              <p className="text-red-500 text-sm">{errors.fechaFinal.message}</p>
            )}
            </div>)}

            

          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="label-general">
                Horario Inicial<span className="label-asterisco">*</span>
              </label>
              <input
                {...register("horarioInicio")}
                type="time"
                className="input-horario"
              />
              {errors.horarioInicio && (
                <p className="text-red-500 text-sm">
                  {errors.horarioInicio.message}
                </p>
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="label-general">
                Horario Fin<span className="label-asterisco">*</span>
              </label>
              <input
                {...register("horarioFin")}
                type="time"
                className="input-horario"
              />
              {errors.horarioFin && (
                <p className="text-red-500 text-sm">
                  {errors.horarioFin.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-8 mr-4">
            <BotonConIcono
              label="Agendar"
              type="submit"
              iconSrc={iconoPlus}
              className={`boton-con-icono ${guardando ? 'opacity-50 cursor-not-allowed' : ''}`}             
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioNuevaAgenda;
