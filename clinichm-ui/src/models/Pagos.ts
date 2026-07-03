export interface Pago {
  idPaciente: number | null;
  idSucursal: number;
  idMedico: number;
  tratamientos: {
    tratamientoId: number;
    nombre?: string| undefined;
    precio?: number;
    conComision: boolean;
  }[];
  productos: {
    productoId: number;
    nombre?: string;
    cantidad: number;
  }[];
  mediosDePago: {
    id: number;
    nombre?: string;
    monto: number;
  }[];
  cotizacionDolar: number | null;
  horaAcreditacion: string | null;
  total: number | undefined;
  vuelto: number | undefined;
  numeroFactura: string;
  voucher: number | undefined;
  fechaHora: string;
  notas?: string; // Campo opcional para notas del pago
}
