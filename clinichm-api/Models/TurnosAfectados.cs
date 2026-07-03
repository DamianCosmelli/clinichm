namespace clinichm_api.Models
{
    public class TurnosAfectados
    {
        public int Id { get; set; }
        public int TurnoId { get; set; }
        public Boolean ConResolucion { get; set; } = false;
        public String? Accion { get; set; }

    }
}