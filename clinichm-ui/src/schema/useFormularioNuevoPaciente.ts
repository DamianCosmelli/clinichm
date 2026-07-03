import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const schema = z.object({
  nombreApellido: z.string().min(1, "El nombre y apellido son obligatorios"),
  celular: z.string().optional(),
  email: z.string().optional(),
  dni: z.string().min(1, "El DNI es obligatorio"),
  localidad: z.string().optional(),
  direccion: z.string().optional(),
  codigoPostal: z.string().optional(),
  medioPublicidad: z.string().optional(),
  fechaNacimiento: z.string().optional().refine(
    (fecha) => !fecha || new Date(fecha) <= new Date(),
    { message: "La fecha de nacimiento no puede ser mayor a la fecha actual" }
  ),
  soloConsulto: z.boolean().default(false), // Asegurar que el valor predeterminado sea false
});

export const useFormularioNuevoPaciente = () => {
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreApellido: '',
      celular: '',
      email: '',
      dni: '',
      localidad: '',
      direccion: '',
      codigoPostal: '',
      medioPublicidad: '',
      fechaNacimiento: '',
      soloConsulto: false, // Valor predeterminado
    },
  });

  return { register, handleSubmit, reset, control, setValue, errors };
};
