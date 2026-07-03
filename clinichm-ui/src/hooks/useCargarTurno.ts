import { useState, useEffect } from 'react';
import { obtenerTurnobyId } from '../services/turnosService'; // Asegúrate de que esta función exista en tus endpoints
import { Turno } from '../models/Turno';

const useCargarTurno = (id: number): Turno | null => {
  const [turno, setTurno] = useState<Turno | null>(null);

  useEffect(() => {
    const cargarTurno = async () => {
      try {
        const data = await obtenerTurnobyId(id);
        setTurno(data);
      } catch (error) {
        console.error('Error al cargar el turno:', error);
      }
    };

    if (id) {
      cargarTurno();
    }
  }, [id]);

  return turno;
};

export default useCargarTurno;