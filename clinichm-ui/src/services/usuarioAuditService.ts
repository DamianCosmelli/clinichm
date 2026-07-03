import { ENDPOINTS } from '../api/endpoints';
import { UsuarioAudit } from '../models/UsuarioAudit';
import { apiService } from '../api/apiService';

export const ObtenerUsuarioAudit = async (usuarioId: number): Promise<UsuarioAudit[]> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIO_AUDIT}/${usuarioId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la auditoría del usuario');
    }

    const data = await response.json();

    return data.map((audit: UsuarioAudit) => ({
      id: audit.id,
      usuarioId: audit.usuarioId,
      loginTime: audit.loginTime,
      logoutTime: audit.logoutTime,
      ip: audit.ip,
      navegador: audit.navegador,
      sesion: audit.sesion,
    }));
  } catch (error) {
    console.error('Error al obtener la auditoría del usuario:', error);
    throw error;
  }
};
