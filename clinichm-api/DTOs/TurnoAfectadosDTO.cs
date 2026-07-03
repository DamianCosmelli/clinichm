namespace clinichm_api.DTOs
{
    public class TurnosAfectadosDTO
    {
        public int Id { get; set; }
        public int TurnoId { get; set; }
        public Boolean ConResolucion { get; set; }
        public String? Accion { get; set; }
    }
    public class TurnosAfectadosReqDTO
    {
        public int TurnoId { get; set; }
        public Boolean ConResolucion { get; set; }
        public String? Accion { get; set; }
    }
}