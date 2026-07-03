import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import iconoChevronRight from '../../../assets/icon-chevron-right-rounded.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import EliminarRegistro from '../../../components/common/EliminarRegistro';
import Loading from '../../common/Loading';
import { MedicoById } from '../../../services/medicoByIdService';
import { ListaSucursales } from '../../../services/sucursalesService';
import { ListaRolesComision } from '../../../services/rolesComisionService'; // Importar el servicio de roles
import iconoEliminar from '../../../assets/iconoEliminar.svg';
import iconoEditar from '../../../assets/iconoEditar.svg';

const PerfilMedico: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medico, setMedico] = useState<{
    nombre: string;
    apellido: string;
    matricula: string;
    sucursal: string;
    roleComision: string;
  } | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const medicoData = await MedicoById(Number(id));
        const sucursales = await ListaSucursales();
        const roles = await ListaRolesComision(); // Obtener lista de roles

        const sucursalNombre = sucursales.find((s) => s.id === medicoData.sucursalId)?.nombre || 'N/A';
        const roleComisionNombre = roles.find((r) => r.id === medicoData.roleId)?.role || 'Sin rol asignado';

        if (medicoData) {
          setMedico({
            nombre: medicoData.nombre,
            apellido: medicoData.apellido,
            matricula: medicoData.matricula || 'N/A',
            sucursal: sucursalNombre,
            roleComision: roleComisionNombre, // Asignar el nombre del rol de comisión
          });
        }
      } catch (error) {
        console.error('Error al obtener el médico:', error);
      }
    };

    fetchMedico();
  }, [id]);

  const handleEliminar = () => {
    setMostrarModal(true);
  };

  if (!medico) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/ajustes?tab=Medicos" className="text-navegacion">Médicos</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Perfil</span>
        </div>
        {/* Título */}
        <div className="relative flex items-center gap-4">
          <span className="text-subtitulo mb-4 -mt-4">Perfil profesional</span>
        </div>
      </div>

      {/* Contenedor adicional */}
      <div className="mt-14 w-full h-100 p-4 bg-[#FBFBFB] rounded-lg border-2 border-[#D69E41] flex flex-col justify-start items-start gap-6 overflow-auto">
        <div className="relative w-full">
          <div className="text-4xl text-[#111111] font-poppins mt-2">
            {medico.nombre} {medico.apellido}
          </div>
          {/* Botones de acción */}
          <div className="absolute top-0 right-33 z-10v mt-2">
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
              onClick={() => navigate(`/editar-medico/${id}`)} // Actualizar la ruta
            />
          </div>
        </div>
        <div className="w-full flex justify-start items-start gap-6 mt-4">
          {/* Contenedor de Datos Personales */}
          <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
            <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
              Datos personales
            </div>
            <div className="w-full flex justify-start items-start gap-24">
              <div className="w-[152px] flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-start items-center">
                  <div className="label-titulo">Matrícula</div>
                </div>
                <div className="label-valor">{medico.matricula}</div>
              </div>
              <div className="w-[152px] flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-start items-center">
                  <div className="label-titulo">Rol de Comisión</div>
                </div>
                <div className="label-valor">{medico.roleComision}</div>
              </div>
            </div>
          </div>
          {/* Contenedor de Datos Laborales */}
          <div className="w-[267px] h-full px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-4">
            <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
              Datos laborales
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Sede</div>
              </div>
              <div className="label-valor">{medico.sucursal}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de eliminación */}
      {mostrarModal && (
        <EliminarRegistro
          entidad="Medicos" // Asegurarse de que la entidad sea "Médico"
          id={Number(id)} // ID del médico
          confirmar={true} // Mostrar confirmación
          redireccionar="/ajustes?tab=Medicos" // Redirigir a la página de ajustes en la solapa médicos
          onClose={() => setMostrarModal(false)} // Cerrar el modal
        />
      )}
    </div>
  );
};

export default PerfilMedico;
