import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const schema = z.object({
  empleado: z.string().min(1, "El empleado es obligatorio"),
  motivo: z.string().min(1, "El motivo es obligatorio"),
  total: z.string().regex(/^[0-9]*\.?[0-9]+$/, "El total debe ser un número válido"),
});

export const useFormularioRetiro = () => {
  const { register, handleSubmit, setValue, reset, control, formState: { errors }, clearErrors } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      empleado: '',
      motivo: '',
      total: '',
    },
  });

  const customRegister = (name: keyof typeof schema.shape) => {
    return {
      ...register(name, {
        onChange: () => {
          if (errors[name]) {
            clearErrors(name);
          }
        },
      }),
    };
  };

  return { register: customRegister, handleSubmit, setValue, reset, control,  errors, clearErrors };
};