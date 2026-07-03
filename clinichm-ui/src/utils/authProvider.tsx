import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, User } from "./authContext";
import { ROLES, RoleValues } from "./roles";
import { buscarUsuario, logoutUsuario } from "../services/usuariosService";
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": RoleValues;
  Sucursal: string;
  UsuarioId: string; 
  exp: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    // Función para verificar si el token ha expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      return decoded.exp < currentTime;
    } catch (err) {
      console.error("Error decoding token time:", err);
      return true; // Si hay error al decodificar, considerar como expirado
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const setUserAsync = async () => {
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          let usuarioData;
          try {
            usuarioData = await buscarUsuario(Number(decoded["UsuarioId"]));
          } catch {
            usuarioData = {
              id: 0,
              userName: '',
              nombre: '',
              apellido: '',
              password: '',
              rolId: 0,
              celular: '',
              sucursalID: 0,
            };
          }
          const parsedUser: User = {
            name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            sucursal: decoded["Sucursal"],
            usuarioId: decoded["UsuarioId"],
            usuarioData,
          };
          setUser(parsedUser);

          // Configurar timeout para desloguear cuando expire el token
          const expirationTime = (decoded.exp * 1000) - Date.now();
          if (expirationTime > 0) {
            setTimeout(() => {
              logout();
            }, expirationTime);
          }

        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    setUserAsync();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (token: string) => {

    // Verificar si el token ya está expirado antes de guardarlo
    if (isTokenExpired(token)) {
      logout();
      return;
    }

    localStorage.setItem("token", token);
    const decoded: DecodedToken = jwtDecode(token);
    let usuarioData;
    try {
      usuarioData = await buscarUsuario(Number(decoded["UsuarioId"]));
    } catch {
      usuarioData = {
        id: 0,
        userName: '',
        nombre: '',
        apellido: '',
        password: '',
        rolId: 0,
        celular: '',
        sucursalID: 0,
      };
    }
    const parsedUser: User = {
      name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      sucursal: decoded["Sucursal"],
      usuarioId: decoded["UsuarioId"],
      usuarioData,
    };
    setUser(parsedUser);

    // Redirección automática según el rol
    let redirectPath = '/';
    switch (parsedUser.role) {
      case ROLES.ADMIN:
        redirectPath = '/ajustes';
        break;
      case ROLES.TURNOS:
        redirectPath = '/turnos';
        break;
      case ROLES.CAJA:
        redirectPath = '/caja';
        break;
      case ROLES.RECEPCION:
        redirectPath = '/recepcion';
        break;
      case ROLES.STOCK:
        redirectPath = '/stock';
        break;
      default:
        redirectPath = '/';
    }
    navigate(redirectPath);

    // Configurar timeout para desloguear cuando expire el token
    const expirationTime = (decoded.exp * 1000) - Date.now();
    if (expirationTime > 0) {
      setTimeout(() => {
        logout();
      }, expirationTime);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    logoutUsuario(user!.usuarioId);
    setUser(null);   
  };

  const isAuthorized = (allowedRoles: RoleValues[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
