namespace clinichm_api.Models
{
    public class Turnos
    {
        public int Id { get; set; }
        public DateTime FechaHora { get; set; }
        public int MedicoId { get; set; }
        public int SucursalId { get; set; }
        public int PacienteId { get; set; }
        public int TratamientoId { get; set; }
        public int UsuarioRegistroId { get; set; }
        public bool? Confirmado { get; set; }
        public DateTime? FechaHoraConfirmacion { get; set; }
        public bool? Reprogramado { get; set; }
        public int? NuevoTurnoId { get; set; }
        public bool Asistio { get; set; }
        public bool Cancelado { get; set; }
        public bool NoEncontrado { get; set; } // cuando el numero de telefono no existe
    }
}
