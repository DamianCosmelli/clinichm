namespace clinichm_api.Models
{
    public class AgendaMedica
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public int MedicoId { get; set; }
        public int SucursalId { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
