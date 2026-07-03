import { useState, useEffect } from 'react';
import { ListaUsuarios } from '../services/usuariosService';
import { ListaSucursales } from '../services/sucursalesService';
import { ListaRoles } from '../services/rolesService';
import { ObtenerUsuarioAudit } from '../services/usuarioAuditService';
import { Usuario } from '../models/Usuario';
import { Sucursal } from '../models/Sucursal';
import { Rol } from '../models/Rol';

const useCargarDatosUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [sesiones, setSesiones] = useState<{ [key: number]: { fechaHora: string; estado: string }[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosData, sucursalesData, rolesData] = await Promise.all([
          ListaUsuarios(),
          ListaSucursales(),
          ListaRoles(),
        ]);
        setUsuarios(usuariosData);
        setSucursales(sucursalesData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const sesionesPorUsuario: { [key: number]: { fechaHora: string; estado: string }[] } = {};
        for (const usuario of usuarios) {
          const auditorias = await ObtenerUsuarioAudit(usuario.id);
          sesionesPorUsuario[usuario.id] = auditorias.map((audit) => ({
            fechaHora: audit.loginTime
              ? `${new Date(audit.loginTime).toLocaleDateString()} - ${new Date(audit.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} `
              : 'N/A',
            estado: audit.sesion,
          }));
        }
        setSesiones(sesionesPorUsuario);
      } catch (error) {
        console.error('Error al obtener las sesiones:', error);
      }
    };

    if (usuarios.length > 0) {
      fetchSesiones();
    }
  }, [usuarios]);

  return { usuarios, sucursales, roles, sesiones };
};

export default useCargarDatosUsuarios;
