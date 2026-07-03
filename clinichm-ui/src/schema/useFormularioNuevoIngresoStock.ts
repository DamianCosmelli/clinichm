import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaNuevoIngresoStock = z.object({
  productoId: z.string().min(1, "El producto es obligatorio"),
  lote: z.string().min(1, "El lote es obligatorio"),
  vencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
  cantidadIngreso: z.string().min(1, "La cantidad es obligatoria"),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es obligatoria"),
  deposito: z.string().min(1, "El depósito es obligatorio"),
});

export const useFormularioNuevoIngresoStock = () => {
  const { register, handleSubmit, setValue, reset, control, watch, formState } = useForm({
    resolver: zodResolver(schemaNuevoIngresoStock),
    defaultValues: {
      productoId: "",
      lote: "",
      vencimiento: "",
      cantidadIngreso: "",
      fechaIngreso: "",
      deposito: "",
    },
  });

  return { register, handleSubmit, setValue, reset, control, watch, formState, errors: formState.errors };
};
