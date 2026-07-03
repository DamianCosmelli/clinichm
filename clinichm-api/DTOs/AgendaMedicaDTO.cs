namespace clinichm_api.DTOs
{
    public class AgendaMedicaDTO
    {
        public DateTime FechaInicio { get; set; }
        public int MedicoId { get; set; }
        public int SucursalId { get; set; }
        public DateTime FechaFin { get; set; }
    }

    public class AgendaMedicaResponseDTO
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public int MedicoId { get; set; }
        public int SucursalId { get; set; }
        public DateTime FechaFin { get; set; }
    }
    public class AgendaMedicaResponseXCalendarDTO
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public int MedicoId { get; set; }
        public int SucursalId { get; set; }
        public DateTime FechaFin { get; set; }
        public string? MedicoNombre { get; set; }
        public string? SucursalNombre { get; set; }
    }
}
