import { ENDPOINTS } from '../api/endpoints';
import { Usuario } from '../models/Usuario';
import { apiService } from '../api/apiService';

export const ListaUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await apiService(ENDPOINTS.USUARIOS, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    const usuarios: Usuario[] = await response.json(); // Utilizar directamente el modelo Usuario
    return usuarios.map((usuario: Usuario) => ({
      id: usuario.id,
      userName: usuario.userName,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rolId: usuario.rolId,
      celular: usuario.celular,
      sucursalID: usuario.sucursalID, // Asegurarse de mapear sucursalID correctamente
    }));
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

export const ObtenerPasswordUsuario = async (id?: number, userName?: string): Promise<string> => {
  try {
    const params = new URLSearchParams();
    if (id) params.append('id', id.toString());
    if (userName) params.append('username', userName);

    const response = await apiService(`${ENDPOINTS.USUARIO_CONSULTAR_PASS}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la contraseña del usuario');
    }

    const data = await response.json();
    return data.password; // Asumimos que el endpoint devuelve un objeto con la propiedad "password"
  } catch (error) {
    console.error('Error al obtener la contraseña del usuario:', error);
    throw error;
  }
};

export const crearUsuario = async (usuario: Partial<Usuario>): Promise<void> => {
  try {
    const response = await apiService(ENDPOINTS.USUARIOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      throw new Error('Error al crear el usuario');
    }
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};

export const actualizarUsuario = async (id: number, usuario: Partial<Usuario>): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIOS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el usuario');
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};
export const buscarUsuario = async (id: number): Promise<Usuario> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIOS}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el usuario');
    }
    const usuario: Usuario = await response.json();
    return usuario; // Retornar el usuario encontrado

  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

export const loginUsuario = async (usuario: string, pass:string): Promise<string> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIOS}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userName": usuario,
          "password": pass
        }),
    });

    if (!response.ok) {
      //throw new Error('Error al crear el usuario');
      return ''; // Retornar una cadena vacía en caso de error
    } 
    
    const data = await response.json();
    return data.token; // Retornar los datos del usuario autenticado
    
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};
export const logoutUsuario = async (usuarioId: string): Promise<void> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIOS}/logout/${usuarioId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al crear el usuario');
    } 
    
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};
export const cambiarPassUsuario = async (usuario: string, oldPass:string, newPass: string): Promise<boolean> => {
  try {
    const response = await apiService(`${ENDPOINTS.USUARIOS}/cambiarpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "userName": usuario,
          "oldPassword": oldPass,
          "newPassword": newPass
        }),
    });

    if (!response.ok) {
      return false; 
    } 
    return true; 
    
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};
