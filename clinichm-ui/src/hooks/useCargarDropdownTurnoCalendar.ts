import { useState, useEffect } from 'react';
import { ListaMedicos } from '../services/medicosService';
import { ListaSucursales } from '../services/sucursalesService';
import { ListaEstadosTurno } from '../services/estadoTurnosService'; // Cambiar el nombre a ListaUsuarios


export const useCargarDropdownTurnoCalendar = () => {

  const [opcionesEstadoTurno, setOpcionesEstadoTurno] = useState<{ id: number; estado: string }[]>([]);
  const [opcionesMedicos, setOpcionesMedicos] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesSucursales, setOpcionesSucursales] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        const estadoTurno = await ListaEstadosTurno(); // Usar el tipo definido
        setOpcionesEstadoTurno(estadoTurno);

        const medicos = await ListaMedicos();
        const medicosConNombre = medicos.map((medico) => ({
          id: medico.id,
          nombre: `${medico.nombre} ${medico.apellido}`,
        }));
        setOpcionesMedicos(medicosConNombre);

        const sucursales = await ListaSucursales();
        setOpcionesSucursales(sucursales);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    cargarDatos();
  }, []);

  return {opcionesEstadoTurno, opcionesMedicos, opcionesSucursales };
};
