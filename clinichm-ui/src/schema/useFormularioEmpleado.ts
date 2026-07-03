import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaEmpleado = z.object({
  nombreApellido: z.string().min(1, "El nombre y apellido son obligatorios"),
  dni: z.string()
    .min(1, "El DNI es obligatorio")
    .regex(/^\d+$/, "El DNI debe contener solo números"),
});

export const useFormularioEmpleado = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaEmpleado),
    defaultValues: {
      nombreApellido: "",
      dni: "",
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors };
};
