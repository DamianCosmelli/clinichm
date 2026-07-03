import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaTratamiento = z.object({
  nombreTratamiento: z.string().min(1, "El nombre del tratamiento es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  sucursalId: z.optional(z.number()), // Opcional
  precioEfectivo: z.number().min(0, "El precio en efectivo debe ser mayor o igual a 0"),
  precioOtrosMediosDePago: z.number().min(0, "El precio con otros medios de pago debe ser mayor o igual a 0"),
  comision: z.number().min(0, "La comisión debe ser mayor o igual a 0"),
  comisionEncargado: z.number().min(0, "La comisión del encargado debe ser mayor o igual a 0"),
  comisionEspecial: z.number().min(0, "La comisión especial debe ser mayor o igual a 0"), // Nuevo campo agregado
});

export const useFormularioNuevoTratamiento = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaTratamiento),
    defaultValues: {
      nombreTratamiento: "",
      descripcion: "",
      sucursalId: undefined, // Opcional
      precioEfectivo: 0,
      precioOtrosMediosDePago: 0,
      comision: 0,
      comisionEncargado: 0,
      comisionEspecial: 0, // Nuevo campo agregado
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors };
};
