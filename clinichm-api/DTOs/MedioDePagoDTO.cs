namespace clinichm_api.DTOs
{
    public class MedioDePagoDTO
    {
        public string MedioPago { get; set; } = null!;
    }

    public class MedioDePagoResponseDTO
    {
        public int Id { get; set; }
        public string MedioPago { get; set; } = null!;
    }
}
