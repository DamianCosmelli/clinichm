// interfaces.ts
export interface Resumen {
  id: number;
  fechaHora: string;
  montoEfectivo: number;
  montoTarjetaCredito: number;
  montoDebito: number;
  montoTransferencia: number;
  montoDolar: number;
  totalEfectivo: number;
  totalCuentaClinichm: number;
  totalRetiro: number;
  totalVuelto: number;
  totalSinCargo: number;
  totalVoucher: number;
  cantVoucher: number;
  idSucursal: number;
  sucursal: string;
  mensaje: string;
}

export interface Movimiento {
  id: number;
  fechaHora: string;
  sucursal: string;
  medico: string;
  paciente: string;
  pacienteDNI: string;
  tipoMovimiento: string;
  medioPago: string;
  monto: number;
  numeroFactura: string;
  fechaHoraTransf: string | null;
  empleado: string | null;
  descripcionRetiro: string | null;
  notas?: string | null;
}

export interface Producto {
  fecha: string;
  medico: string;
  producto: string;
  cantProd: number;
}

export interface Comision {
  id: number;
  medico: string;
  fechaDePago: string;
  metodoDePago: string;
  monto: number;
}

export interface CierreCajaInfo {
  resumen: Resumen;
  movimientos: Movimiento[];
  productos: Producto[];
  comisiones: Comision[];
}