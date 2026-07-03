namespace clinichm_api.DTOs
{
    public class EmpleadoDTO
    {
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? DNI { get; set; }
    }

    public class EmpleadoResponseDTO
    {
        public int Id {get; set;}
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? DNI { get; set; }
    }
}
