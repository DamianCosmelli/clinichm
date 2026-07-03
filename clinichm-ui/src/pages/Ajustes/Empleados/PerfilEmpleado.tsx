import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import iconoChevronRight from '../../../assets/icon-chevron-right-rounded.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import EliminarRegistro from '../../../components/common/EliminarRegistro';
import Loading from '../../common/Loading';
import { obtenerEmpleadoPorId } from '../../../services/empleadosService';
import iconoEliminar from '../../../assets/iconoEliminar.svg';
import iconoEditar from '../../../assets/iconoEditar.svg';

const PerfilEmpleado: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<{
    nombre: string;
    apellido: string;
    dni: string;
  } | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const empleadoData = await obtenerEmpleadoPorId(Number(id));
        if (empleadoData) {
          setEmpleado({
            nombre: empleadoData.nombre,
            apellido: empleadoData.apellido,
            dni: empleadoData.dni,
          });
        }
      } catch (error) {
        console.error('Error al obtener el empleado:', error);
      }
    };

    fetchEmpleado();
  }, [id]);

  const handleEliminar = () => {
    setMostrarModal(true);
  };

  if (!empleado) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/ajustes?tab=Empleados" className="text-navegacion">Empleados</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Perfil</span>
        </div>
        {/* Título */}
        <div className="relative flex items-center gap-4">
          <span className="text-subtitulo mb-4 -mt-4">Perfil</span>
        </div>
      </div>

      {/* Contenedor adicional */}
      <div className="mt-14 w-full h-100 p-4 bg-[#FBFBFB] rounded-lg border-2 border-[#D69E41] flex flex-col justify-start items-start gap-6 overflow-auto">
        <div className="relative w-full">
          <div className="text-4xl text-[#111111] font-poppins mt-2">
            {empleado.nombre} {empleado.apellido}
          </div>
          {/* Botones de acción */}
          <div className="absolute top-0 right-33 z-10 mt-2">
            <BotonConIcono
              label="Eliminar"
              iconSrc={iconoEliminar}
              className="boton-eliminar"
              onClick={handleEliminar}
            />
          </div>
          <div className="absolute top-0 right-1 z-10 mt-2">
            <BotonConIcono
              label="Editar"
              iconSrc={iconoEditar}
              className="boton-editar"
              onClick={() => navigate(`/editar-empleado/${id}`)}
            />
          </div>
        </div>
        <div className="w-full flex justify-start items-start gap-6 mt-4">
          {/* Contenedor de Datos */}
          <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
            <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
              Datos del empleado
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="label-titulo">Nombre:</span>
                <span className="label-valor">{empleado.nombre}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="label-titulo">Apellido:</span>
                <span className="label-valor">{empleado.apellido}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="label-titulo">Documento:</span>
                <span className="label-valor">{empleado.dni}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de eliminación */}
      {mostrarModal && (
        <EliminarRegistro
          entidad="Empleado"
          id={Number(id)}
          confirmar={true}
          redireccionar="/ajustes?tab=Empleados"
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default PerfilEmpleado;
