import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const schema = z.object({
  nombreApellido: z.string().min(1, "El nombre y apellido es obligatorio"),
  //documento: z.string().min(1, "El documento es obligatorio"), // Ahora obligatorio
  documento: z.string().optional(), // Se ha cambiado a opcional
  celular: z.string().min(1, "El celular es obligatorio"), // Ahora obligatorio
  tratamiento: z.string().min(1, "El tratamiento es obligatorio"),
  turnoAsignadoPor: z.string().min(1, "El turno asignado por es obligatorio"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  horario: z.string().min(1, "El horario es obligatorio"),
  profesionalOEquipo: z.string().min(1, "El profesional o equipo es obligatorio"),
  sede: z.string().min(1, "La sede es obligatoria"),
  estadoTurno: z.string().optional(),
});

export const useFormularioNuevoTurno = () => {
  const { register, handleSubmit, setValue, reset, control,watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreApellido: '',
      documento: '',
      celular: '',
      tratamiento: '',
      turnoAsignadoPor: '',
      fecha: '',
      horario: '',
      profesionalOEquipo: '',
      sede: '',
      estadoTurno: '',
    },
  });

  return { register, handleSubmit,setValue, reset, control, watch, errors };
};
