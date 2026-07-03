export interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  sucursalId: number; // Corregido: sucursalId
  roleId?: number; // Hacer roleId opcional

}
