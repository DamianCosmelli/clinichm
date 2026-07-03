import { useContext, useState } from "react";
import "../../styles/formularioNuevoTurno.css"; // Importar los estilos
import BotonConIcono from "../common/BotonConIcono"; // Importar el componente de botón con ícono
//import logoDb3 from '../../assets/logo-db-3.png'; // Importar el logo
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; // Importar íconos de Heroicons v1
import { AuthContext } from "../../utils/authContext";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import React from "react";
import InfoPass from "./infoPass";
import ErrorPass from "./errorPass";
import { cambiarPassUsuario } from "../../services/usuariosService";
import PasswordResetNotification from "./PasswordResetNotification";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import PasswordResetNotificationError from "./PasswordResetNotificationError";

interface PasswordResetProps {
  onClose: () => void;
}

const PasswordResetForm: React.FC<PasswordResetProps> = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [username] = useState(user!.name); // Campo de solo lectura
  const [passwordActual, setPasswordActual] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [exitoCambio, setExitoCambio] = useState(false);
  const [errorCambio, setErrorCambio] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const togglePasswordActualisibility = () =>
    setShowPasswordActual(!showPasswordActual);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword(!showRepeatPassword);

  const handleCloseNotification = () => {
    setExitoCambio(false);
    onClose(); // Cierra ambos modales
    navigate("/pacientes"); //redirije a pacientes que es comun a todos los roles
  };

  const handlerChangePass = async () => {
    const change = await cambiarPassUsuario(username, passwordActual, password);
    if (change) {
      setExitoCambio(true);
      //onClose(); // Cerrar el modal al cambiar la contraseña
    } else {
      //alert('Error al cambiar la contraseña. Por favor, inténtelo de nuevo.');
      //onClose(); // Cerrar el modal en caso de error
      setErrorCambio(true);
    }
  };

  // Validar contraseñas en cada cambio relevante
  React.useEffect(() => {
    if (
      passwordActual.length < 6 ||
      password.length < 6 ||
      repeatPassword.length < 6 ||
      passwordActual === password ||
      password !== repeatPassword
    ) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [passwordActual, password, repeatPassword]);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <img
          src={iconoCerrar}
          alt="Cerrar"
          className="iconSize cursor-pointer absolute top-2 right-2"
          onClick={onClose}
        />
        <div className="flex h-130 flex-col justify-center items-center gap-3">
          {/* <div className="w-15 h-[61px] p-2.5 bg-[#272626] rounded-full flex justify-center items-center">
          <img src={logoDb3} alt="Logo" className="w-[39.68px] h-[41px]" />
        </div>*/}
          <div className="w-[418px] px-2 flex flex-col justify-center items-center">
            <div className="text-[#111111] text-2xl font-medium font-poppins leading-[33.6px] break-words text-center">
              Cambiar contraseña
            </div>
          </div>
          <div className="ml-8 flex flex-col justify-start items-start ">
            <label className="label-general">Usuario</label>
            <div className="input-style input-readonly ">
              <span>{username}</span>
            </div>
          </div>
          <div className="w-[418px] flex flex-col justify-start items-start">
            <label className="label-general">
              Contraseña Actual
              <span className="label-asterisco">*</span>
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPasswordActual ? "text" : "password"}
                value={passwordActual}
                //onChange={(e) => setPasswordActual(e.target.value)}
                className={`${
                  passwordActual.length > 0 && passwordActual.length < 6
                    ? "input-style-red"
                    : "input-style"
                }`}
                placeholder="Ingresar contraseña actual"
                style={{ paddingRight: "2rem" }}
                maxLength={12} // Limitar a 12 caracteres
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9!@#$%]/g, ""); // Permite letras, números y caracteres especiales comunes
                  setPasswordActual(input.value);
                }}
              />
              <span
                onClick={togglePasswordActualisibility}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPasswordActual ? (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOffIcon className="w-5 h-5 text-gray-500" />
                )}
              </span>
            </div>
            <InfoPass />
          </div>
          <div className="w-[418px] flex flex-col justify-start items-start">
            <label className="label-general">
              Contraseña Nueva
              <span className="label-asterisco">*</span>
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                //onChange={(e) => setPassword(e.target.value)}
                className={`${
                  password.length > 0 && password.length < 6
                    ? "input-style-red"
                    : "input-style"
                }`}
                placeholder="Ingresar contraseña nueva"
                style={{ paddingRight: "2rem" }}
                maxLength={12} // Limitar a 12 caracteres
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9!@#$%]/g, ""); // Permite letras, números y caracteres especiales comunes
                  setPassword(input.value);
                }}
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOffIcon className="w-5 h-5 text-gray-500" />
                )}
              </span>
            </div>
            {passwordActual && passwordActual === password ? (
              <ErrorPass message="La nueva contraseña no puede ser igual a al actual" />
            ) : (
              <InfoPass />
            )}
          </div>
          <div className="w-[418px] flex flex-col justify-start items-start">
            <label className="label-general">
              Repetir contraseña
              <span className="label-asterisco">*</span>
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                //onChange={(e) => setRepeatPassword(e.target.value)}
                className={`${
                  repeatPassword.length > 0 && repeatPassword.length < 6
                    ? "input-style-red"
                    : "input-style"
                }`}
                placeholder="Repetir contraseña nueva"
                style={{ paddingRight: "2rem" }}
                maxLength={12} // Limitar a 12 caracteres
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9!@#$%]/g, ""); // Permite letras, números y caracteres especiales comunes
                  setRepeatPassword(input.value);
                }}
              />
              <span
                onClick={toggleRepeatPasswordVisibility}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showRepeatPassword ? (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOffIcon className="w-5 h-5 text-gray-500" />
                )}
              </span>
            </div>
            {repeatPassword && repeatPassword != password ? (
              <ErrorPass message="No coicide con la nueva contraseña" />
            ) : (
              <InfoPass />
            )}
          </div>

          <div className="w-[418px] flex justify-center items-center">
            <BotonConIcono
              label="Continuar"
              className={`justify-center mt-20 ml-8.5 w-105 h-12 px-4 py-2.5 bg-[#D69E41] text-[#111111] text-base font-semibold font-poppins leading-[22.4px] 
              ${isValid ? "" : "cursor-not-allowed opacity-50"}`}
              type="submit"
              onClick={isValid ? handlerChangePass : undefined}
            />
          </div>
        </div>
      </div>
      {/* Modal de notificación superpuesto */}
      {exitoCambio && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full max-w-md mx-4">
            {" "}
            {/* Contenedor con ancho máximo y margen */}
            <PasswordResetNotification onClose={handleCloseNotification} />
          </div>
        </div>
      )}
       {errorCambio && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full max-w-md mx-4">
            {" "}
            {/* Contenedor con ancho máximo y margen */}
            <PasswordResetNotificationError onClose={handleCloseNotification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordResetForm;
