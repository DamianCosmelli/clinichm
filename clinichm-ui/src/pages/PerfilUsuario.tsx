import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import { ListaUsuarios, ObtenerPasswordUsuario } from '../services/usuariosService';
import { ListaRoles } from '../services/rolesService';
import { ListaSucursales } from '../services/sucursalesService';
import { ObtenerUsuarioAudit } from '../services/usuarioAuditService';
import BotonConIcono from '../components/common/BotonConIcono';
import EliminarRegistro from '../components/common/EliminarRegistro';
import DatosAcceso from '../components/Usuarios/DatosAcceso';
import DatosLaborales from '../components/Usuarios/DatosLaborales';
import HistorialSesiones from '../components/Usuarios/HistorialSesiones';
import iconoEliminar from '../assets/iconoEliminar.svg'; // Importar iconoEliminar
import iconoEditar from '../assets/iconoEditar.svg'; // Importar iconoEditar
import Loading from './common/Loading';


const PerfilUsuario: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<{
    nombre: string;
    apellido: string;
    userName: string;
    celular: string;
    rol: string;
    sucursal: string;
    password: string;
  } | null>(null);
  const [auditorias, setAuditorias] = useState<
    { ip: string; navegador: string; ultimoAcceso: string; estado: string }[]
  >([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarios = await ListaUsuarios();
        const roles = await ListaRoles();
        const sucursales = await ListaSucursales();

        const usuarioEncontrado = usuarios.find((u) => u.id === Number(id));
        if (usuarioEncontrado) {
          const password = await ObtenerPasswordUsuario(usuarioEncontrado.id);
          const rol = roles.find((r) => r.id === usuarioEncontrado.rolId)?.nombre || 'N/A';
          const sucursal = sucursales.find((s) => s.id === usuarioEncontrado.sucursalID)?.nombre || 'N/A';

          setUsuario({
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            userName: usuarioEncontrado.userName,
            celular: usuarioEncontrado.celular,
            rol,
            sucursal,
            password,
          });
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    const fetchAuditorias = async () => {
      try {
        const auditoriasData = await ObtenerUsuarioAudit(Number(id));
        const formattedAuditorias = auditoriasData.map((audit) => ({
          ip: audit.ip || 'N/A',
          navegador: audit.navegador || 'N/A',
          ultimoAcceso: audit.loginTime
            ? new Date(audit.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A',
          estado: audit.sesion,
        }));
        setAuditorias(formattedAuditorias);
      } catch (error) {
        console.error('Error al obtener las auditorías:', error);
      }
    };

    fetchUsuario();
    fetchAuditorias();
  }, [id]);

  const handleEliminar = () => {
    setMostrarModal(true);
  };

    if (!usuario) {
    return( <Loading/>); // Manejar el caso donde no hay paciente
  }

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/usuarios" className="text-navegacion">Usuarios</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Perfil</span>
        </div>
        {/* Título */}
        <div className="relative flex items-center gap-4">
          <span className="text-subtitulo mb-4 -mt-4">Perfil</span>
        </div>
      </div>

      {/* Contenedor adicional */}
      <div className="mt-10 w-full h-[calc(100vh-180px)] p-4 bg-[#FBFBFB] rounded-lg border-2 border-[#D69E41] flex flex-col justify-start items-start gap-6 overflow-auto">
        {usuario && (
          <>
            <div className="relative w-full">
              <div className="text-4xl text-[#111111] font-poppins">
                {usuario.nombre} {usuario.apellido}
              </div>
              {/* Botones de acción */}
              <div className="absolute top-0 right-33 z-10">
                <BotonConIcono
                  label="Eliminar"
                  iconSrc={iconoEliminar}
                  className="boton-eliminar"
                  onClick={handleEliminar} // Usar la función handleEliminar
                />
                </div>
               <div className="absolute top-0 right-1 z-10">
                <BotonConIcono
                  label="Editar"
                  iconSrc={iconoEditar}
                  className="boton-editar"
                  onClick={() => navigate(`/editar-usuario/${id}`)} // Redirigir a la página de edición
                />
              </div>
            </div>
            <div className="w-full h-full flex justify-start items-start gap-6">
              <DatosAcceso
                userName={usuario.userName}
                password={usuario.password}
                celular={usuario.celular}
                mostrarPassword={mostrarPassword}
                setMostrarPassword={setMostrarPassword}
              />
              <DatosLaborales rol={usuario.rol} sucursal={usuario.sucursal} />
            </div>
            <HistorialSesiones auditorias={auditorias} />
          </>
        )}
      </div>

      {/* Modal de eliminación */}
      {mostrarModal && (
        <EliminarRegistro
          entidad="Usuario" // Entidad a eliminar
          id={Number(id)} // ID del usuario
          confirmar={true} // Mostrar confirmación
          redireccionar="/usuarios" // Redirigir a la página de usuarios
          onClose={() => setMostrarModal(false)} // Cerrar el modal
        />
      )}
    </div>
  );
};

export default PerfilUsuario;
