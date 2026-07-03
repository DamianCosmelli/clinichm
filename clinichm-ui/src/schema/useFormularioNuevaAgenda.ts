import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const schema = z.object({
  medico: z.string().min(1, "El medico es obligatorio"),
  fechaInicio: z.string().min(1, "La fecha es obligatoria"),
  horarioInicio: z.string().min(1, "El horario de inicio es obligatorio"),
  horarioFin: z.string().min(1, "El horario de fin es obligatorio"),
  sede: z.string().min(1, "La sede es obligatoria"),
  fechaFinal: z.string().optional(),
}).refine(
  (data) => {
    if (!data.fechaFinal) return true;
    const inicio = new Date(data.fechaInicio);
    const final = new Date(data.fechaFinal);
    return !isNaN(inicio.getTime()) && !isNaN(final.getTime()) && final > inicio;
  },
  {
    message: "La fecha final debe ser mayor a la fecha inicial",
    path: ["fechaFinal"],
  }).refine(
  (data) => {
    if (!data.horarioInicio || !data.horarioFin) return true;
    
    const [horaInicio, minutoInicio] = data.horarioInicio.split(':').map(Number);
    const [horaFin, minutoFin] = data.horarioFin.split(':').map(Number);
    
    // Comparar horas y minutos
    if (horaInicio > horaFin) return false;
    if (horaInicio === horaFin && minutoInicio >= minutoFin) return false;
    
    return true;
  },
  {
    message: "La hora final debe ser mayor que la hora inicial",
    path: ["horarioFin"],
  }
);

export const useFormularioNuevaAgenda = () => {
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      medico: '',
      fechaInicio: '',
      fechaFinal: '',
      horarioInicio: '',
      horarioFin: '',
      sede: '',
    },
  });

  return { register, handleSubmit, reset, setValue, control, errors };
};
