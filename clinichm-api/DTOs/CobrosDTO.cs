namespace clinichm_api.DTOs
{

    public class CobrosDTO
    {   //Referido a tabla MovimientoCaja
        public int IdPaciente { get; set; }
        public int IdSucursal { get; set; }
        public int IdMedico { get; set; }
        public decimal CotizacionDolar { get; set; }
        public string? NumeroFactura { get; set; }
        public List<PagoMedioDePagoDTO>? MediosDePago { get; set; }
        public DateTime FechaHora { get; set; }
        public string? HoraAcreditacion { get; set; }
        public decimal Vuelto { get; set; }

        //Tabla CobroTratamientos
        public List<PagoTratamientoDTO>? Tratamientos { get; set; }
        public List<PagoProductoDTO>? Productos { get; set; }

        //Tabla Voucher
        public decimal Total { get; set; }
        public decimal Voucher { get; set; }
        public string? Notas { get; set; }
    }

    public class CobrosRespDto
    {
        public int Id { get; set; }
        public string? Resultado { get; set; }
    }


    public class PagoTratamientoDTO
    {
        public int TratamientoId { get; set; }
        public string? Nombre { get; set; }
        public decimal? Precio { get; set; }
        public Boolean conComision { get; set; }
    }

    public class PagoProductoDTO
    {
        public int ProductoId { get; set; }
        public string? Nombre { get; set; }
        public decimal Cantidad { get; set; }
    }

    public class PagoMedioDePagoDTO
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public decimal Monto { get; set; }
    }
}
