import { ENDPOINTS } from '../api/endpoints';
import { Role } from '../models/Role';
import { apiService } from '../api/apiService';

export const ListaRolesComision = async (): Promise<Role[]> => {
  try {
    const response = await apiService(ENDPOINTS.ROLE_COMISION, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los roles de comisión');
    }

    const data = await response.json();

    return data.map((role: Role) => ({
      id: role.id,
      role: role.role,
    }));
  } catch (error) {
    console.error('Error al obtener los roles de comisión:', error);
    throw error;
  }
};
