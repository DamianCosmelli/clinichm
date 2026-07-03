namespace clinichm_api.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public string? Nombre { get; set; } = null!;

        public string? Apellido { get; set; } = null!;
        public string? DNI { get; set; }
    }
}
