import { Link, useNavigate } from "react-router-dom";
import iconoChevronRight from "../assets/icon-chevron-right-rounded.svg";
import Dropdown from "../components/common/Dropdown";
import BotonConIcono from "../components/common/BotonConIcono";
import iconoPlus from "../assets/icon-plus-line.svg";
import useCargarDatosRetiro from "../hooks/useCargarDatosRetiro";
import { useState, useContext } from "react";
import { crearMovimientoCaja } from "../services/MovimientoCajaService";
import { MovimientoCaja } from "../models/MovimientoCaja";
import iconCheck from "../assets/icon-check.svg";
import { useFormularioRetiro } from "../schema/useFormularioRetiro";
import { Controller } from "react-hook-form";
import { AuthContext } from '../utils/authContext'; // Importar el contexto de autenticación


interface FormularioRetiro {
  empleado: string;
  motivo: string;
  total: string;
}

const Retiro: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegación
  const { empleados, horario } = useCargarDatosRetiro();
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  //const [registradoPor, setRegistradoPor] = useState<string>("");
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    errors,
    setValue,
    control,
    clearErrors,
  } = useFormularioRetiro();

  const onSubmit = async (data: FormularioRetiro) => {
    const empleado = empleados.find((e) => e.nombre === data.empleado);

    if (!empleado) {
      console.error("Empleado no seleccionado o no válido");
      return;
    }

    const movimiento: MovimientoCaja = {
      idMedico: 0,
      idPaciente: 0,
      idTratamiento: 0,
      idProducto: 0,
      cantidadProducto: 0,
      cotizacionDolar: 0,
      numeroFactura: "",
      idMedioPago: 1,
      monto: parseFloat(data.total),
      tipoMovimiento: "Retiro",
      fechaHora: horario,
      fechaHoraTransf: "",
      idSucursal: user!.usuarioData.sucursalID, //Sucursal asignada del usuario logueado
      idCierreCaja: 0,
      idEmpleado: empleado.id,
      descripcionRetiro: data.motivo,
      voucher: 0,
    };

    try {
      await crearMovimientoCaja(movimiento);
      setMensajeExito("Retiro guardado");

      reset();

      setTimeout(() => {
        setMensajeExito(null);
      }, 3000);
       setTimeout(() => {
        navigate("/caja"); 
        }, 1000); // Recarga la página para mostrar los ultimos cobros
    } catch (error) {
      console.error("Error al guardar el movimiento:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      {mensajeExito && (
        <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A] mr-7 mt-4">
          <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
          <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
            {mensajeExito}
          </span>
        </div>
      )}
      <div className="flex flex-col px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/caja" className="text-navegacion">
            Caja
          </Link>
          <img
            src={iconoChevronRight}
            alt="chevron right"
            className="w-4 h-4"
          />
          <span className="text-navegacion">Retiro</span>
        </div>
        {/* Título */}
        <div className="relative flex justify-between items-center mt-4">
          <span className="text-subtitulo">Retiro</span>
        </div>
        {/* Contenedor debajo del título */}
        <div className="flex flex-col p-6 mt-16 justify-center items-center self-stretch rounded-lg border-2 border-[var(--Brand-D69E41,#D69E41)] bg-[var(--Neutral-FBFBFB,#FBFBFB)] h-[400px]">
          {/* Contenido adicional dentro del contenedor */}
          <div className="self-start text-[#111111] text-[20px] font-poppins font-semibold leading-[28px] break-words mt-[-80px] mb-25">
            Datos para caja
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center md:flex-row md:justify-between mt-[-80px] gap-16"
          >
            {/* Columna izquierda con tres inputs */}
            <div className="flex flex-col items-center gap-4">
              {/* Dropdown para Empleado */}
              <div className="flex flex-col">
                 <label className="label-general">Empleado</label>
                <Controller
                  name="empleado"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Dropdown
                      options={empleados.map((e) => e.nombre)}
                      value={field.value}
                      placeholder="Seleccione el empleado"
                      onChange={(value) => {
                        setValue("empleado", value);
                        clearErrors("empleado");
                      }}
                    />
                  )}
                />
                {errors.empleado && (
                  <span className="text-red-500 text-sm">
                    {errors.empleado.message}
                  </span>
                )}
              </div>

              {/* Input para Motivo */}
              <div className="flex flex-col">
                <label className="label-general">Motivo</label>
                <input
                  type="text"
                  className="input-style"
                  placeholder="Ingrese el motivo"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^a-zñA-ZÑ\s]/g, ""); // Eliminar caracteres no alfabéticos
                  }}
                  {...register("motivo")}
                />
                {errors.motivo && (
                  <span className="text-red-500 text-sm">
                    {errors.motivo.message}
                  </span>
                )}
              </div>
            </div>

            {/* Columna derecha con dos inputs */}
            <div className="flex flex-col items-center gap-4 mt-8">
              {/* Input Sucursdal (Toma el del usuario logeado) */}
              <div className="flex flex-col">
                <label className="label-general">Sucursal</label>
                <input
                  type="text"
                  className="input-style input-readonly"
                  value={user?.sucursal}
                  readOnly
                />
              </div>

              {/* Input para Total con asterisco */}
              <div className="flex flex-col">
                <label className="label-general">
                  Total<span className="label-asterisco">*</span>
                </label>
                <input
                  type="text"
                  className="input-style"
                  placeholder="Ingrese el total"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value
                      .replace(/[^0-9.]/g, '')            // Elimina todo excepto números y punto
                      .replace(/(\..*?)\..*/g, '$1');     // Permite solo un punto decimal
                  }}
                  {...register("total")}
                />
                {errors.total && (
                  <span className="text-red-500 text-sm">
                    {errors.total.message}
                  </span>
                )}
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-center mt-4 ml-75">
                <BotonConIcono
                  label="Guardar"
                  iconSrc={iconoPlus}
                  className="btn-guardar"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Retiro;
