namespace clinichm_api.DTOs
{
    public class EstadoTurnoDTO
    {
        public string Estado { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string Color { get; set; } = null!;
    }
        public class EstadoTurnoResponseDTO
    {
        public int Id { get; set; } 
        public string Estado { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string? Color { get; set; }
    }
}
