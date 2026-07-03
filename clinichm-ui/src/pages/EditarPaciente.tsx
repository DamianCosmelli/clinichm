import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormularioNuevoPaciente from '../components/Pacientes/FormularioNuevoPaciente';
import useCargarPaciente from '../hooks/useCargarPaciente';
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg';

const EditarPaciente: React.FC = () => {
  const paciente = useCargarPaciente(); // Usar el hook unificado
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/pacientes" className="text-navegacion">Pacientes</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <Link
            to="/perfilPaciente"
            state={{ dni: paciente?.dni }} // Pasar el DNI en el estado
            className="text-navegacion"
          >
            Perfil
          </Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Editar</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Paciente guardado
              </span>
            </div>
          )}
        </div>
      </div>

      {paciente ? (
        <FormularioNuevoPaciente
          setMensajeExito={setMensajeExito} // Pasar el setter del mensaje de éxito
          paciente={paciente} // Pasar los datos del paciente al formulario
        />
      ) : (
        <div>Cargando datos del paciente...</div>
      )}
    </div>
  );
};

export default EditarPaciente;
