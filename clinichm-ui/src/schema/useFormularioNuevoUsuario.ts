import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schema = z.object({
  nombreApellido: z.string().min(1, "El nombre y apellido es obligatorio"),
  userName: z.string()
    .min(1, "El nombre de usuario es obligatorio")
    .regex(/^[a-z0-9]+$/, "Solo se permiten letras minúsculas y números"), // Actualización: solo minúsculas y números
  password: z
    .string()
    .min(6, "La contraseña debe tener mínimo 6 y máximo 12 caracteres")
    .max(12, "La contraseña debe tener mínimo 6 y máximo 12 caracteres")
    .regex(/^[a-zA-Z0-9!@#$%]+$/, "La contraseña solo puede contener letras, números y caracteres especiales !@#$%"), // Actualización: solo minúsculas y números
  celular: z
    .string()
    .min(1, "El celular es obligatorio")
    .regex(/^\d{1,11}$/, "El celular debe contener solo números y tener un máximo de 11 dígitos"), // Actualización: solo números, máximo 11
  rolId: z.string().min(1, "El rol es obligatorio"),
  sucursalID: z.string().min(1, "La sucursal es obligatoria"),
});

export const useFormularioNuevoUsuario = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreApellido: "",
      userName: "",
      password: "",
      celular: "",
      rolId: "",
      sucursalID: "",
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors }; // Incluir formState y errors
};
