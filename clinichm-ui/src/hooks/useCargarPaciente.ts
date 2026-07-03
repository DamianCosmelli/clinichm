import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buscarPacientePorDNI } from '../services/pacientesService';
import { Paciente } from '../models/Paciente';

const useCargarPaciente = (dni?: string) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const dniToUse = dni || (location.state as { dni?: string } | undefined)?.dni;

        if (!dniToUse) {
          console.error('No se recibió el DNI.');
          navigate('/pacientes');
          return;
        }

        const pacienteEncontrado = await buscarPacientePorDNI(dniToUse);
        if (pacienteEncontrado) {
          setPaciente(pacienteEncontrado);
        } else {
          console.error('No se encontró el paciente con el DNI proporcionado.');
          navigate('/pacientes');
        }
      } catch (error) {
        console.error('Error al cargar el paciente:', error);
        navigate('/pacientes');
      }
    };

    cargarPaciente();
  }, [dni, location.state, navigate]);

  return paciente;
};

export default useCargarPaciente;
