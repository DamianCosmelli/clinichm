namespace clinichm_api.Models
{
    public class Sucursales
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string Ciudad { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
    }
}
