export interface PagoDeComisiones {
  id: number;
  medicoId: number;
  fechaDePago: string; // Usar string para fechas en JSON
  metodoDePago: string;
  monto: number;
  cierreDeCajaId: number;
}
