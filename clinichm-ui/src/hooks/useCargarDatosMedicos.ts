import { useState, useEffect } from 'react';
import { ListaMedicos } from '../services/medicosService';
import { ListaSucursales } from '../services/sucursalesService';
import { ListaRolesComision } from '../services/rolesComisionService'; // Usar el servicio correcto
import { Medico } from '../models/Medico';
import { Sucursal } from '../models/Sucursal';
import { Role } from '../models/Role'; // Importar el modelo Role

const useCargarDatosMedicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicosData, sucursalesData, rolesData] = await Promise.all([
          ListaMedicos(),
          ListaSucursales(),
          ListaRolesComision(),
        ]);

      
        setMedicos(medicosData);
        setSucursales(sucursalesData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  return { medicos, sucursales, roles };
};

export default useCargarDatosMedicos;
