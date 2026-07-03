namespace clinichm_api.DTOs
{
    public class PagoDeComisionesDTO
    {
        public int MedicoId { get; set; }
        public DateTime FechaDePago { get; set; }
        public string MetodoDePago { get; set; } = "Efectivo";
        public decimal Monto { get; set; }
        public int CierreDeCajaId { get; set; }
    }

    public class PagoDeComisionesResponseDTO
    {
        public int Id { get; set; }
        public int MedicoId { get; set; }
        public DateTime FechaDePago { get; set; }
        public string MetodoDePago { get; set; } = "Efectivo";
        public decimal Monto { get; set; }
        public int CierreDeCajaId { get; set; }
    }
}
