import { useEffect, useState } from 'react';
import { ListaEmpleados } from '../services/empleadosService';

interface Empleado {
  id: string;
  nombre: string;
}

const useCargarDatosRetiro = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [horario, setHorario] = useState<string>('');

  useEffect(() => {
    // Obtener lista de empleados
    const fetchEmpleados = async () => {
      try {
        const empleadosData = await ListaEmpleados();
        const empleadosFormateados = empleadosData.map(empleado => ({
          id: empleado.id,
          nombre: `${empleado.nombre} ${empleado.apellido}`
        }));
        setEmpleados(empleadosFormateados);
        //setEmpleados(empleadosData);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };

    // Obtener horario actual
    const obtenerHorarioActual = () => {
      const ahora = new Date();
      const horarioActual = ahora.toISOString(); // Formato ISO 8601 completo
      setHorario(horarioActual);
    };

    fetchEmpleados();
    obtenerHorarioActual();
  }, []);

  return { empleados, horario };
};

export default useCargarDatosRetiro;