namespace clinichm_api.Models
{
    public class EstadosTurnos
    {
        public int Id { get; set; } 
        public string Estado { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string? Color { get; set; } // Color en formato hexadecimal
    }
}
