import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import iconoAcciones from '../../../assets/iconoAcciones.svg';
import TableListados from '../../../components/common/TableListados';
import iconoPlus from '../../../assets/icon-plus-line.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import useCargarDatosMedicos from '../../../hooks/useCargarDatosMedicos'; // Hook para cargar datos de médicos
import { Medico } from '../../../models/Medico'; // Importar el modelo Medico
import { Sucursal } from '../../../models/Sucursal'; // Importar el modelo Sucursal
import { Role } from '../../../models/Role'; // Importar el modelo Role
import Loading from '../../common/Loading'; // Asegúrate de importar el componente de Loading

const Medicos: React.FC = () => {
  const navigate = useNavigate();
  const { medicos, sucursales, roles } = useCargarDatosMedicos();
  const [filtro, setFiltro] = useState({
    sede: '',
    profesional: '',
    rol: '',
    buscar: '',
  });

  // Mostrar pantalla de carga si no hay datos
  const isLoading = !medicos.length || !sucursales.length || !roles.length;

  if (isLoading) {
    return <Loading />;
  }

  const medicosFiltrados = medicos
    .filter((medico) => medico.id !== 1) // Excluir el médico con id 1 (Equipo Medico)
    .filter((medico: Medico) => {
      const sucursal = sucursales.find((sucursal: Sucursal) => sucursal.id === medico.sucursalId)?.nombre || '';
      const role = medico.roleId ? roles.find((role: Role) => role.id === medico.roleId)?.role || 'Sin rol asignado' : 'Sin rol asignado'; // Manejar médicos sin roleId

      const filtroSede = !filtro.sede || sucursal === filtro.sede;
      const filtroRol = !filtro.rol || role === filtro.rol;
      const filtroBuscar =
        !filtro.buscar ||
        `${medico.nombre} ${medico.apellido}`.toLowerCase().includes(filtro.buscar.toLowerCase());

      return filtroSede && filtroRol && filtroBuscar;
    })
    .reverse(); // Mostrar primero los últimos agregados

  const headers = ['Profesional', 'Sede', 'Rol de comisión', ''];
  const rows = medicosFiltrados.map((medico: Medico) => {
    const sucursal = sucursales.find((sucursal: Sucursal) => sucursal.id === medico.sucursalId)?.nombre || 'N/A';
    const role = medico.roleId ? roles.find((role: Role) => role.id === medico.roleId)?.role || 'Sin rol asignado' : 'Sin rol asignado'; // Manejar médicos sin roleId

    return {
      Profesional: `${medico.nombre} ${medico.apellido}`,
      Sede: sucursal,
      'Rol de comisión': role, // Mostrar el nombre del role o "Sin rol asignado"

      "": (
        <img
          src={iconoAcciones}
          alt="Acciones"
          title="Ver perfil" // Tooltip para el ícono de acciones
          className="cursor-pointer w-5 h-5"
          onClick={() => navigate(`/perfil-medico/${medico.id}`)}
        />
      ),
    };
  });

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="w-full mt-8">
        <span className="text-subtitulo mb-4">Médicos</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nuevo profesional"
            iconSrc={iconoPlus}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/crear-medico')} // Navegar a la página de creación de médico
          />
        </div>
        <div className="dropdown-container mt-8 justify-between ">
          <div className="dropdown-caja mt-4">
            <select
              className="dropdown-select"
              value={filtro.sede}
              onChange={(e) => setFiltro({ ...filtro, sede: e.target.value })}
            >
              <option value="">Sedes</option>
              {sucursales.map((sucursal: Sucursal) => (
                <option key={sucursal.id} value={sucursal.nombre}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-caja mt-4">
            <select
              className="dropdown-select"
              value={filtro.rol}
              onChange={(e) => setFiltro({ ...filtro, rol: e.target.value })}
            >
              <option value="">Roles</option>
              {roles.map((role: Role) => (
                <option key={role.id} value={role.role}>
                  {role.role}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-caja mt-4">
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
        <div className="mt-8 overflow-auto max-h-[40vh]"> {/* Habilitar scroll */}
          <TableListados headers={headers} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default Medicos;
