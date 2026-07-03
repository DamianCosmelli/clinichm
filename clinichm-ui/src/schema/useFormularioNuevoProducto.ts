import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaProducto = z.object({
  nombre: z.string().min(1, "El nombre del producto es obligatorio"),
  categoriaProdId: z.number().min(1, "Debe seleccionar una categoría"),
  noAutoDescontable: z.string().optional(), // Cambiar a tipo string
});

export const useFormularioNuevoProducto = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaProducto),
    defaultValues: {
      nombre: "",
      categoriaProdId: 0,
      noAutoDescontable: "false", // Cambiar a cadena para coincidir con el esquema
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors };
};
