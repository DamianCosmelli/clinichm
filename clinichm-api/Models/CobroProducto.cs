namespace clinichm_api.Models
{
    public class CobroProductos
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public string? Nombre { get; set; }
        public decimal Cantidad { get; set; }
        public int MovId { get; set; }
        public int? IdCierreCaja { get; set; } 
        public int MedicoId { get; set; }
    }
}