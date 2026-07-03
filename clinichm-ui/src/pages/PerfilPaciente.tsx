import React from 'react';
import { Link} from 'react-router-dom'; // Importar useNavigate
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import ContenedorDatosPacientes from '../components/Pacientes/ContenedorDatosPacientes';
import useCargarPaciente from '../hooks/useCargarPaciente';
import Loading from './common/Loading';

const PerfilPaciente: React.FC = () => {
  const paciente = useCargarPaciente(); // Usar el hook unificado
 
  if (!paciente) {
    return( <Loading/>); // Manejar el caso donde no hay paciente
  }

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/pacientes" className="text-navegacion">Pacientes</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Perfil</span>
        </div>
        {/* Título */}
        <div className="relative flex items-center gap-4">
          <span className="text-subtitulo mb-4 -mt-4">Perfil</span>
        </div>
      </div>

      {/* Espaciado adicional para bajar el contenedor */}
      <div className="mt-10 mr-2">
        <div className="relative">
          <ContenedorDatosPacientes paciente={paciente} />
        </div>
      </div>
    </div>
  );
};

export default PerfilPaciente;
