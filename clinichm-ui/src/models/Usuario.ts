export interface Usuario {
  id: number;
  userName: string;
  nombre: string;
  apellido: string;
  password?: string; // Agregar la propiedad opcional password
  rolId: number;
  celular: string;
  sucursalID: number; // Cambiar sucursalId a sucursalID
}
