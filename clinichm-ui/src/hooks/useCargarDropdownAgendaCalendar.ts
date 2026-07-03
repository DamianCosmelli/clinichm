import { useState, useEffect } from 'react';
import { ListaMedicos } from '../services/medicosService';
import { ListaSucursales } from '../services/sucursalesService';


export const useCargarDropdownAgendaCalendar = () => {

  const [opcionesMedicos, setOpcionesMedicos] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesSucursales, setOpcionesSucursales] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        const medicos = await ListaMedicos();
        const medicosConNombre = medicos
          .map((medico) => ({
            id: medico.id,
            nombre: `${medico.nombre} ${medico.apellido}`,
          }))
          .filter(medico => medico.id !== 1); // Filtrar el médico con id 1 - Equipo  medico
        setOpcionesMedicos(medicosConNombre);

        const sucursales = await ListaSucursales();
        setOpcionesSucursales(sucursales);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    cargarDatos();
  }, []);

  return {opcionesMedicos, opcionesSucursales };
};
