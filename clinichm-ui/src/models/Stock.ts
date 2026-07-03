export interface Stock {
  id: number;
  productoId: number;
  lote: string;
  vencimiento: string;
  cantidadIngreso: number;
  cantidadExistente: number;
  fechaIngreso: string;
  deposito: string;
  tipoOperacion?: string;
}
