import { useState, useEffect } from 'react';
import { Agenda } from '../models/Agenda';
import { obtenerAgendabyId } from '../services/agendaService';

const useCargarAgenda = (id: number): Agenda | null => {
  const [turno, setAgenda] = useState<Agenda | null>(null);

  useEffect(() => {
    const cargarAgenda = async () => {
      try {
        const data = await obtenerAgendabyId(id);
        setAgenda(data);
      } catch (error) {
        console.error('Error al cargar el agenda:', error);
      }
    };

    if (id) {
      cargarAgenda();
    }
  }, [id]);

  return turno;
};

export default useCargarAgenda;