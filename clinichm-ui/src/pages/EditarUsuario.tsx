import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormularioNuevoUsuario from '../components/Usuarios/FormularioNuevoUsuario';
import { actualizarUsuario, ListaUsuarios, ObtenerPasswordUsuario } from '../services/usuariosService';
import iconoChevronRight from '../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../assets/icon-check.svg';
import { z } from 'zod';
import { schema } from '../schema/useFormularioNuevoUsuario';

type FormularioNuevoUsuarioData = z.infer<typeof schema>;

const EditarUsuario: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<{
    userName: string;
    nombreApellido: string;
    password: string;
    celular: string;
    rolId: string;
    sucursalID: string;
  } | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarios = await ListaUsuarios();
        const usuarioEncontrado = usuarios.find((u) => u.id === Number(id));
        if (usuarioEncontrado) {
          // Obtener la contraseña desde el endpoint
          const password = await ObtenerPasswordUsuario(Number(id));
          setUsuario({
            userName: usuarioEncontrado.userName,
            nombreApellido: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}`,
            password: password || '', // Asignar la contraseña obtenida
            celular: usuarioEncontrado.celular,
            rolId: usuarioEncontrado.rolId.toString(),
            sucursalID: usuarioEncontrado.sucursalID.toString(),
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleFormSubmit = async (data: FormularioNuevoUsuarioData) => {
    try {
      await actualizarUsuario(Number(id), {
        userName: data.userName,
        nombre: data.nombreApellido.split(' ')[0] || '',
        apellido: data.nombreApellido.split(' ').slice(1).join(' ') || '',
        password: data.password,
        rolId: parseInt(data.rolId, 10),
        celular: data.celular || '', // Manejar el caso en que celular sea undefined
        sucursalID: parseInt(data.sucursalID, 10),
      });
      setMensajeExito('Usuario modificado'); // Mensaje consistente con FormularioNuevoUsuario
      setTimeout(() => {
        setMensajeExito(null);
        navigate(`/perfil-usuario/${id}`); // Redirigir al perfil del usuario
      }, 3000); // Redirigir después de 3 segundos
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setMensajeExito('Error al actualizar el usuario'); // Mostrar mensaje de error
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/usuarios" className="text-navegacion">Usuarios</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <Link to={`/perfil-usuario/${id}`} className="text-navegacion">Perfil</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Editar usuario</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Usuario modificado
              </span>
            </div>
          )}
        </div>
      </div>

      {usuario ? (
        <FormularioNuevoUsuario
          setMensajeExito={setMensajeExito}
          initialValues={usuario} // Pasar los valores iniciales al formulario
          handleFormSubmit={handleFormSubmit} // Manejar la actualización
        />
      ) : (
        <div className="text-center mt-10">Cargando datos del usuario...</div> // Mostrar un mensaje de carga
      )}
    </div>
  );
};

export default EditarUsuario;
