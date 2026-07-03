export interface Tratamiento {
  id: number;
  nombreTratamiento: string;
  descripcion: string;
  sucursalId?: number; // Opcional: siempre será 0 si se utiliza, y se eliminará en el futuro
  precioEfectivo: number;
  precioOtrosMediosDePago: number;
  comision: number;
  comisionEncargado: number;
  comisionEspecial: number; // Nuevo campo agregado
}
