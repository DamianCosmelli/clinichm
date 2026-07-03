import { createContext } from "react";
import { RoleValues } from "./roles";
import { Usuario } from "../models/Usuario";

export interface User {
  name: string;
  role: RoleValues;
  sucursal: string;
  usuarioId: string;
  usuarioData: Usuario;
}

export interface AuthContextProps {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthorized: (allowedRoles: RoleValues[]) => boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthorized: () => false
});