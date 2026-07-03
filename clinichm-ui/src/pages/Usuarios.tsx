import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoBuscar from '../assets/iconoBuscar.svg';
import iconoAcciones from '../assets/iconoAcciones.svg';
import TableListados from '../components/common/TableListados';
import iconoPlus from '../assets/icon-plus-line.svg';
import BotonConIcono from '../components/common/BotonConIcono';
import useCargarDatosUsuarios from '../hooks/useCargarDatosUsuarios'; // Importar el hook personalizado
import Loading from './common/Loading'; 

const Usuarios: React.FC = () => {
  const navigate = useNavigate();
  const { usuarios, sucursales, roles, sesiones } = useCargarDatosUsuarios(); // Usar el hook
  const [filtro, setFiltro] = useState({
    sede: '',
    rol: '',
    sesion: '',
    buscar: '',
  });

  // Mostrar pantalla de carga si no hay datos
  const isLoading = !usuarios.length || !sucursales.length || !roles.length;

  if (isLoading) {
    return <Loading />;
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const sucursal = sucursales.find((sucursal) => sucursal.id === usuario.sucursalID)?.nombre || '';
    const rol = roles.find((rol) => rol.id === usuario.rolId)?.nombre || '';
    const sesionesUsuario = sesiones[usuario.id] || [];

    const filtroSede = !filtro.sede || sucursal === filtro.sede;
    const filtroRol = !filtro.rol || rol === filtro.rol;
    const filtroSesion = !filtro.sesion || sesionesUsuario.some((sesion) => sesion.estado === filtro.sesion);
    const filtroBuscar =
      !filtro.buscar ||
      `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(filtro.buscar.toLowerCase());

    return filtroSede && filtroRol && filtroSesion && filtroBuscar;
  });

  const headers = ['Usuario', 'Sede', 'Rol', 'Sesiones', ''];
  const rows = usuariosFiltrados.map((usuario) => {
    const sucursal = sucursales.find((sucursal) => sucursal.id === usuario.sucursalID)?.nombre || 'N/A';
    const rol = roles.find((rol) => rol.id === usuario.rolId)?.nombre || 'N/A';
    const ultimaSesion = sesiones[usuario.id]
      ?.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())[0]?.fechaHora || 'Sin registro'; // Ordenar por fecha y obtener la última

    return {
      Usuario: `${usuario.nombre} ${usuario.apellido}`,
      Sede: sucursal,
      Rol: rol,
      Sesiones: ultimaSesion, // Mostrar solo la última sesión
      "": (
        <img
          src={iconoAcciones}
          alt="Acciones"
          title='Ver perfil' // Tooltip para el ícono de acciones
          className="cursor-pointer w-5 h-5"
          onClick={() => navigate(`/perfil-usuario/${usuario.id}`)}
        />
      ),
    };
  });

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="w-full">
        <span className="text-subtitulo mb-4">Usuarios</span>
        <div className="flex justify-end "> {/* Reducir el margen inferior */}
          <BotonConIcono
            label="Nuevo usuario"
            iconSrc={iconoPlus}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-8"
            onClick={() => navigate('/nuevo-usuario')} // Navegar a la página de creación de usuario
          />
        </div>
        <div className="dropdown-container mt-4">
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.sede}
              onChange={(e) => setFiltro({ ...filtro, sede: e.target.value })}
            >
              <option value="">Sedes</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.nombre}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.rol}
              onChange={(e) => setFiltro({ ...filtro, rol: e.target.value })}
            >
              <option value="">Roles</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-caja">
            <select
              className="dropdown-select"
              value={filtro.sesion}
              onChange={(e) => setFiltro({ ...filtro, sesion: e.target.value })}
            >
              <option value="">Sesiones</option>
              <option value="Activa">Activa</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          <div className="dropdown-caja">
            <div className="relative">
              <input
                type="text"
                className="dropdown-select pr-10"
                placeholder="Buscar"
                value={filtro.buscar}
                onChange={(e) => setFiltro({ ...filtro, buscar: e.target.value })}
              />
              <img
                src={iconoBuscar}
                alt="Buscar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-[400px] overflow-y-auto mt-10">
          <TableListados headers={headers} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
