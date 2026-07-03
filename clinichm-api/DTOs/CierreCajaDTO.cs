namespace clinichm_api.DTOs
{
    public class CierreCajaDTO
    {
        public DateTime FechaHora { get; set; }
        public decimal MontoEfectivo { get; set; }
        public decimal MontoTarjetaCredito { get; set; }
        public decimal MontoDebito { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoDolar { get; set; }
        public decimal TotalEfectivo { get; set; }
        public decimal TotalCuentaClinichm { get; set; }
        public decimal TotalRetiro { get; set; }
        public decimal TotalVuelto { get; set; }
        public decimal TotalSinCargo { get; set; }
        public int IdSucursal { get; set; }
        public decimal TotalVoucher { get; set; }
        public int CantVoucher { get; set; }
    }

    public class CierreCajaResponseDTO
    {
        public int Id { get; set; }
        public DateTime FechaHora { get; set; }
        public decimal MontoEfectivo { get; set; }
        public decimal MontoTarjetaCredito { get; set; }
        public decimal MontoDebito { get; set; }
        public decimal MontoTransferencia { get; set; }
        public decimal MontoDolar { get; set; }
        public decimal TotalEfectivo { get; set; }
        public decimal TotalCuentaClinichm { get; set; }
        public decimal TotalRetiro { get; set; }
        public decimal TotalVuelto { get; set; }
        public decimal TotalSinCargo { get; set; }
        public decimal TotalVoucher { get; set; }
        public int CantVoucher { get; set; }
        public int IdSucursal { get; set; }
        public string? Sucursal { get; set; }

        private string _mensaje = "Cierre Ejecutado";

        public string Mensaje
        {
            get => _mensaje;
            set => _mensaje = string.IsNullOrWhiteSpace(value) ? "Cierre Ejecutado" : value;
        }
    }

    public class CierreCajaRequestDTO
    {
        public int IdSucursal { get; set; }
        public DateTime FechaHora { get; set; }


    }

    public class CierreCajaMesResponseDTO
    {
        public CierreCajaResponseDTO? Resumen { get; set; }
        public List<CierreCajaResponseDTO>? Detalle { get; set; }
    }
    public class CierreCajaReporteDTO
    {
        public CierreCajaResponseDTO? Resumen { get; set; }
        public List<MovimientoCajaResporteDTO>? Movimientos { get; set; }
        public List<CierreCajaProdDTO>? Productos { get; set; }
        public List<CierreCajaPagoDeComisionesDTO>? Comisiones { get; set; }
    }

    public class CierreCajaProdDTO
    {
        public DateTime Fecha { get; set; }
        public string? Medico { get; set; }
        public string? Producto { get; set; }
        public decimal CantProd { get; set; }
    }

        public class CierreCajaPagoDeComisionesDTO
    {
        public int Id { get; set; }
        public string? Medico { get; set; }
        public DateTime FechaDePago { get; set; }
        public string MetodoDePago { get; set; } = "Efectivo";
        public decimal Monto { get; set; }
    }
}
