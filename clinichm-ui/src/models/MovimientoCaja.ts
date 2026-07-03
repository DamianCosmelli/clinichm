export interface MovimientoCaja {
  idMedico: number;
  idPaciente: number;
  idTratamiento: number;
  idProducto: number;
  cantidadProducto: number;
  numeroFactura?: string | null; // Permitir null
  idMedioPago: number;
  monto: number;
  tipoMovimiento: string;
  fechaHora: string;
  fechaHoraTransf?: string | null; // Permitir null además de undefined
  idSucursal: number;
  idCierreCaja: number;
  idEmpleado?: number | null | string; // Permitir null además de undefined
  descripcionRetiro?: string;
  cotizacionDolar: number; // Nueva propiedad
  voucher?: number | null; // Permitir null
  notas?: string; // Campo opcional para notas del movimiento
  id?: number; // ID del movimiento
}
