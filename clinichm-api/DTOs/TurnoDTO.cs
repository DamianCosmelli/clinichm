namespace clinichm_api.DTOs
{
    public class TurnoDTO
    {

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
        public bool Asistio { get; set; } = false;
        public bool Cancelado { get; set; } = false;
        public bool NoEncontrado { get; set; } = false; // cuando el numero de telefono no existe
    }

    public class TurnoResponseDTO
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
        public List<TurnoDuplicadoDTO> TurnosDuplicados { get; set; } = null!;

    }

    public class TurnoDuplicadoDTO
    {
        public int Id { get; set; }
        public DateTime fecha { get; set; }
        public int TratamientoId { get; set; }
        public int MedicoId { get; set; }
    }

    public class ConteoDiarioTurnosDTO
    {
        public int MedicoId { get; set; }
        public bool Asistio { get; set; }
        public int Conteo { get; set; }
    }

    public class ConteoMensualTurnosDTO
    {
        public string? Periodo { get; set; }
        public bool Asistio { get; set; }
        public int Conteo { get; set; }
    }
    
    public class TurnoResponseXCalendarDTO
    {
        public int Id { get; set; }
        public DateTime FechaHora { get; set; }
        public int MedicoId { get; set; }
        public string MedicoNombre { get; set; } = null!;
        public int SucursalId { get; set; }
        public string SucursalNombre { get; set; } = null!;
        public int PacienteId { get; set; }
        public string PacienteNombre { get; set; } = null!;
        public string PacienteCelular { get; set; } = null!;
        public string PacienteEmail { get; set; } = null!;
        public int TratamientoId { get; set; }
        public string TratamientoNombre { get; set; } = null!;
        public int UsuarioRegistroId { get; set; }
        public bool? Confirmado { get; set; }
        public DateTime? FechaHoraConfirmacion { get; set; }
        public bool? Reprogramado { get; set; }
        public int? NuevoTurnoId { get; set; }
        public bool Asistio { get; set; }
        public bool Cancelado { get; set; }
        public bool NoEncontrado { get; set; } // cuando el numero de telefono no existe
        public List<TurnoDuplicadoDTO> TurnosDuplicados { get; set; } = null!;

    }

}
