export interface CierreCaja {
  id: number;
  fechaHora: string; // Fecha y hora del cierre
  montoEfectivo: number; // Monto en efectivo
  montoTarjetaCredito: number; // Monto con tarjeta de crédito
  montoDebito: number; // Monto con tarjeta de débito
  montoTransferencia: number; // Monto por transferencia
  montoDolar: number; // Monto en dólares
  totalEfectivo: number; // Total en efectivo
  totalCuentaClinichm: number; // Total en cuenta Clinichm
  idSucursal: number; // ID de la sucursal
  totalRetiro: number; // Total en retiro
}
