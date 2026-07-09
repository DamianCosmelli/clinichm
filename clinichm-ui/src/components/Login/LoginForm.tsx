import React, { useState, useContext } from 'react';
import BotonConIcono from '../common/BotonConIcono';
// Importa los iconos de ojo
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { AuthContext } from '../../utils/authContext';
import { loginUsuario } from '../../services/usuariosService';
import iconoInfo from '../../assets/iconoInfo.svg'; 
import iconoError from '../../assets/triang_Error.svg'; 
import logo from "../../assets/logo-db-3.png"; 
//import icon_asteriscos from "../../assets/icon-asteriscos.svg"

const LoginForm: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failLogin, setFailLogin] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    // Petición al backend para autenticar y obtener el token
    const loginToken = await loginUsuario(usuario, password);
    
    if (loginToken) {
      await login(loginToken); // Espera a que el login termine antes de navegar
    } 
  else {
      // Aquí podrías mostrar un mensaje de error
      setFailLogin(true);
      console.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="w-[680px] h-[420px] px-4 py-8 bg-[#FBFBFB] rounded-lg outline-1 outline-[#7A7979] outline-offset-[-1px] flex flex-col gap-4">
      <div className="text-center text-[#111111] text-2xl font-poppins font-medium leading-[33.6px] break-words pt-4">
        Iniciar sesión
      </div>

      <div className="flex flex-row flex-1 items-center justify-center gap-8 pb-8">
        <div className="flex-1 flex justify-center items-center">
          <div className="w-44 h-44 bg-black rounded-full flex justify-center items-center">
            <img
              className="w-30 h-auto"
              src={logo}
              alt="Logo"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-6">
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div className="label-general">
                Usuario
              </div>
            </div>
            <div className="w-[418px] flex flex-col gap-1.5">
              <input
                className="input-style"
                placeholder="Ingresar usuario"
                style={{ width: 385 }}
                value={usuario}
                spellCheck={false}
                autoComplete="username"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
                  setUsuario(input.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && usuario.trim() && password.trim()) {
                    handleLogin();
                  }
                }}
              />
            </div>
          </div>

          <div className="w-[418px] flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div className="label-general">
                Contraseña
              </div>
              <span className="label-asterisco">*</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center relative">
                <input
                  className={`${password.length > 0 && password.length < 6 ? 'input-style-red' : 'input-style'}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresar contraseña"
                  value={password}
                  spellCheck={false}
                  autoComplete="current-password"
                  maxLength={12}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^a-zA-Z0-9!@#$%]/g, "");
                    setPassword(input.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && usuario.trim() && password.trim()) {
                      handleLogin();
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {failLogin ?
              (<div className="ml-4 flex items-center gap-1">
                <img
                  src={iconoError}
                  alt="info"
                  className="mr-1 w-[14px] h-[14px]"
                />
                <span className="text-red-800 text-sm font-poppins font-normal leading-[19.6px]">
                  Usuario o contraseña incorrectas.
                </span>
              </div>
                ) : (
              <div className="ml-4 flex items-center gap-1">
                <img
                  src={iconoInfo}
                  alt="info"
                  className="mr-1 w-[14px] h-[14px]"
                />
                <span className="text-[#5E5D5D] text-sm font-poppins font-normal leading-[19.6px]" title='Letras (mayúsculas y minúsculas), números y caracteres especiales !@#$%'>
                  Debe tener entre 6 y 12 caracteres.
                </span>
              </div>)}
            </div>
          </div>

          <div className="w-[418px] flex justify-center items-center mt-6">
            <BotonConIcono
              label="Continuar"
              type="button"
              className="ml-2 flex-1 w-100 justify-center"
              onClick={handleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
