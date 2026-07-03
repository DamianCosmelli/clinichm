namespace clinichm_api.DTOs
{
    public class SucursalDTO
    {
        public string Nombre { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string Ciudad { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
    }

        public class SucursalResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string Ciudad { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
    }
}
