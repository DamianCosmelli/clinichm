import { ENDPOINTS } from '../api/endpoints';
import { Empleado } from '../models/Empleado';
import { apiService } from '../api/apiService';

export const ListaEmpleados = async (): Promise<Empleado[]> => {
  try {
    const response = await apiService(ENDPOINTS.EMPLEADOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los empleados');
    }

    const data = await response.json();

    return data.map((empleado: Empleado) => ({
      id: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
    }));
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw error;
  }
};

export const obtenerEmpleadoPorId = async (empleadoId: number): Promise<Empleado> => {
  try {
    const response = await apiService(`${ENDPOINTS.EMPLEADOS}/${empleadoId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener empleado: ${errorText}`);
    }
    const data = await response.json();
    return data as Empleado;
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    throw error;
  }
};

export const crearEmpleado = async (empleado: Partial<Empleado>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.EMPLEADOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado),
    });

    if (!response.ok) {
      throw new Error('Error al crear el empleado');
    }
  } catch (error) {
    console.error('Error al crear el empleado:', error);
    throw error;
  }
};

export const actualizarEmpleado = async (empleadoId: number, empleado: Partial<Empleado>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.EMPLEADOS}/${empleadoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el empleado');
    }
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    throw error;
  }
};
