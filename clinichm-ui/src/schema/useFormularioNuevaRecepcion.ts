import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const schema = z.object({
  dni: z.string().min(1, "El DNI es obligatorio").max(8, "El DNI debe tener 8 caracteres"),
  nombreApellido: z.string().min(1, "El nombre y apellido son obligatorios"),
  celular: z.string().optional(),
  email: z.string().optional(),
  direccion: z.string().optional(),
  codigoPostal: z.string().optional(),
  horaLlegada: z.string().optional(),
  fecha: z.string().optional().refine(
    (fecha) => !fecha || new Date(fecha) >= new Date(new Date().toISOString().split("T")[0]),
    { message: "La fecha no puede ser anterior a hoy" }
  ),
  sede: z.string().optional(),
  motivo: z.string().optional(),
  tratamiento: z.string().optional(),
  medico: z.string().optional(),
  metodoCaptacion: z.string().optional(),
  piso: z.string().optional(), // Agregar el campo piso
});

export const useFormularioNuevaRecepcion = () => {
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dni: '',
      nombreApellido: '',
      celular: '',
      email: '',
      direccion: '',
      codigoPostal: '',
      horaLlegada: '',
      fecha: '',
      sede: '',
      motivo: '',
      tratamiento: '',
      medico: '',
      metodoCaptacion: '',
      piso: '', // Agregar el valor por defecto para piso
    },
  });

  return { register, handleSubmit, reset, control, setValue, watch, errors };
};
