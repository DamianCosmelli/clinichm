import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaMedico = z.object({
  nombreApellido: z.string().min(1, "El nombre y apellido es obligatorio"),
  matricula: z.string()
    .min(1, "La matrícula es obligatoria")
   ,
  rolId: z.string().min(1, "El rol es obligatorio"),
  sucursalID: z.string().min(1, "La sucursal es obligatoria"),
});

export const useFormularioNuevoMedico = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaMedico),
    defaultValues: {
      nombreApellido: "",
      matricula: "",
      rolId: "",
      sucursalID: "",
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors }; // Incluir formState y errors
};
