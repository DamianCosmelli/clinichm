import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormularioNuevoTratamiento } from "../../schema/useFormularioNuevoTratamiento";

import { crearTratamiento } from "../../services/tratamientosService";
import { Tratamiento } from "../../models/Tratamiento"; // Importar correctamente el modelo Tratamiento
import BotonConIcono from "../common/BotonConIcono";
import iconoGuardar from "../../assets/icon-plus-line.svg";

interface FormularioNuevoTratamientoProps {
  setMensajeExito: (mensaje: string | null) => void;
}

interface FormularioTratamientoData {
  nombreTratamiento: string;
  descripcion: string;
  sucursalId?: number; // Cambiar a opcional y tipo número para ser compatible
  precioEfectivo: number | ""; // Permitir vacío
  precioOtrosMediosDePago: number | ""; // Permitir vacío
  comision: number | ""; // Permitir vacío
  comisionEncargado: number | ""; // Permitir vacío
  comisionEspecial: number | ""; // Permitir vacío
}

const FormularioNuevoTratamiento: React.FC<FormularioNuevoTratamientoProps> = ({ setMensajeExito }) => {
  const { register, handleSubmit, errors } = useFormularioNuevoTratamiento();
  const navigate = useNavigate();
  
  
  

  const onSubmit = async (data: FormularioTratamientoData) => {
    try {
      const nuevoTratamiento: Partial<Tratamiento> = {
        ...data,
        sucursalId: data.sucursalId ? 0 : undefined, // Opcional: guardar 0 si está presente
        precioEfectivo: data.precioEfectivo || 0,
        precioOtrosMediosDePago: data.precioOtrosMediosDePago || 0,
        comision: data.comision || 0,
        comisionEncargado: data.comisionEncargado || 0,
        comisionEspecial: data.comisionEspecial || 0,
      };

      await crearTratamiento(nuevoTratamiento);

      setMensajeExito("Tratamiento creado");
      setTimeout(() => {
        setMensajeExito(null);
        navigate("/ajustes?tab=Tratamientos");
      }, 2000);
    } catch (error) {
      console.error("Error al crear el tratamiento:", error);
    }
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    input.value = input.value.replace(/[^0-9.]/g, ""); // Permitir solo números y punto decimal
  };

  return (
    // <div className="w-full px-6 py-24 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] mt-12">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[calc(100vh-150px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="label-general">
              Nombre del Tratamiento <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("nombreTratamiento")}
              type="text"
              placeholder="Nombre del Tratamiento"
              className="input-style"
            />
            {errors.nombreTratamiento && <p className="text-red-500 text-sm">{errors.nombreTratamiento.message}</p>}
          </div>
          <div>
            <label className="label-general">
              Descripción <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("descripcion")}
              type="text"
              placeholder="Descripción"
              className="input-style"
            />
            {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
          </div>
      
          <div>
            <label className="label-general">
              Precio Efectivo <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("precioEfectivo", { valueAsNumber: true })}
              type="text"
              placeholder="Precio Efectivo"
              className="input-style"
              onInput={handleNumericInput}
            />
            {errors.precioEfectivo && <p className="text-red-500 text-sm">{errors.precioEfectivo.message}</p>}
          </div>

            <div>
            <label className="label-general">
              Precio Otros Medios de Pago <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("precioOtrosMediosDePago", { valueAsNumber: true })}
              type="text"
              placeholder="Precio Otros Medios de Pago"
              className="input-style"
              onInput={handleNumericInput}
            />
            {errors.precioOtrosMediosDePago && <p className="text-red-500 text-sm">{errors.precioOtrosMediosDePago.message}</p>}
          </div>
        </div>
        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
        
          <div>
            <label className="label-general">
              Comisión <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("comision", { valueAsNumber: true })}
              type="text"
              placeholder="Comisión"
              className="input-style"
              onInput={handleNumericInput}
            />
            {errors.comision && <p className="text-red-500 text-sm">{errors.comision.message}</p>}
          </div>
          <div>
            <label className="label-general">
              Comisión Encargado <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("comisionEncargado", { valueAsNumber: true })}
              type="text"
              placeholder="Comisión Encargado"
              className="input-style"
              onInput={handleNumericInput}
            />
            {errors.comisionEncargado && <p className="text-red-500 text-sm">{errors.comisionEncargado.message}</p>}
          </div>
          <div>
            <label className="label-general">
              Comisión Especial <span className="label-asterisco">*</span>
            </label>
            <input
              {...register("comisionEspecial", { valueAsNumber: true })}
              type="text"
              placeholder="Comisión Especial"
              className="input-style"
              onInput={handleNumericInput}
            />
            {errors.comisionEspecial && <p className="text-red-500 text-sm">{errors.comisionEspecial.message}</p>}
          </div>
            <div className="flex items-end justify-end gap-2 mt-18 ml-3">
              <BotonConIcono
                label="Crear Tratamiento"
                type="submit"
                iconSrc={iconoGuardar}
                className="bg-[#D69E41] text-white hover:bg-opacity-90 "
              />
            </div>
        </div>
      </div>
      
    </form>
    // </div>
  );
};

export default FormularioNuevoTratamiento;
