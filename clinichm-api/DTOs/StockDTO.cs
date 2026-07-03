namespace clinichm_api.DTOs
{
    public class StockDTO
    {
        public int ProductoId { get; set; }
        public string? Lote { get; set; }
        public DateOnly Vencimiento { get; set; }
        public decimal CantidadIngreso { get; set; }
        public decimal CantidadExistente { get; set; }
        public DateOnly FechaIngreso { get; set; }
        public string? Deposito { get; set; }
        public string? TipoOperacion { get; set; }
    }

    public class StockResponseDTO
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public string? Lote { get; set; }
        public DateOnly Vencimiento { get; set; }
        public decimal CantidadIngreso { get; set; }
        public decimal CantidadExistente { get; set; }
        public DateOnly FechaIngreso { get; set; }
        public string? Deposito { get; set; }
        public string? TipoOperacion { get; set; }
    }
}
