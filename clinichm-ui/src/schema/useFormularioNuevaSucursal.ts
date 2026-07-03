import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaSucursal = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  codigoPostal: z.string()
    .min(1, "El código postal es obligatorio")
    .regex(/^\d+$/, "El código postal debe contener solo números"),
});

export const useFormularioNuevaSucursal = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaSucursal),
    defaultValues: {
      nombre: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors };
};
