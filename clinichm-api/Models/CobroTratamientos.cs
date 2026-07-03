namespace clinichm_api.Models
{
    public class CobroTratamientos
    {
        public int Id { get; set; }
        public int TratamientoId { get; set; }
        public decimal? Precio { get; set; }
        public Boolean conComision { get; set; }
        public int MovId { get; set; }
        public int? IdCierreCaja { get; set; } 
        public int MedicoId { get; set; } 
    }
}