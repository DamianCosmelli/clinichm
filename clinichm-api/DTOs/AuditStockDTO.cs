namespace clinichm_api.DTOs
{
    public class AuditStockDTO
    {
        public DateTime Fecha { get; set; }
        public int IdRegistro { get; set; }
        public decimal CantPrevia { get; set; }
        public decimal CantNueva { get; set; }
        public string? TipoMovimiento { get; set; }
        public int UsuarioId { get; set; }
    }

    public class AuditStockResponseDTO
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int IdRegistro { get; set; }
        public decimal CantPrevia { get; set; }
        public decimal CantNueva { get; set; }
        public string? TipoMovimiento { get; set; }
        public int UsuarioId { get; set; }
    }
}
