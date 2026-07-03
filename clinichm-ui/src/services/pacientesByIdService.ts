import { ENDPOINTS } from '../api/endpoints';
import { apiService } from '../api/apiService';

export const PacienteById = async (pacienteId: number) => {
  try {

    const response = await apiService(ENDPOINTS.PACIENTES + `/${pacienteId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener paciente`);
    }

    const paciente: { id: number; nombre: string; apellido: string; celular: string; email:string;} = await response.json();
 
    return {
      id: paciente.id,
      nombre: `${paciente.nombre} ${paciente.apellido}`,
      celular: paciente.celular,
      email: paciente.email,

    };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    throw error;
  }
};


