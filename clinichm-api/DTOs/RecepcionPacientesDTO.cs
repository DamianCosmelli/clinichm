using Microsoft.Identity.Client;

namespace clinichm_api.DTOs
{
    public class RecepcionPacientesDTO
    {
        public int PacienteId { get; set; }
        public int TratamientoId { get; set; }
        public int MedicoId { get; set; }
        public DateTime HoraIngreso { get; set; }
        public DateTime? HoraAnestesia { get; set; }
        public string? EstadoRecepcion { get; set; }
        public bool EsConsulta { get; set; }
        public int Piso { get; set; }
        public int SucursalId { get; set; }
        public bool EsRetoque { get; set; }
        public string? MotivoConsulta { get; set; }
    }

    public class RecepcionPacientesResponseDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public int TratamientoId { get; set; }
        public int MedicoId { get; set; }
        public DateTime HoraIngreso { get; set; }
        public DateTime? HoraAnestesia { get; set; }
        public string? EstadoRecepcion { get; set; }
        public bool EsConsulta { get; set; }
        public int Piso { get; set; }
        public int SucursalId { get; set; }
        public bool EsRetoque { get; set; }
        public string? MotivoConsulta { get; set; }
    }
        public class RecepcionCalendarResponseDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string? PacienteNombre { get; set; }
        public string? PacienteDNI { get; set; }
        public string? PacienteCelular { get; set; }
        public string? PacienteMail { get; set; }
        public int TratamientoId { get; set; }
        public string? TratamientoNombre { get; set; }
        public int MedicoId { get; set; }
        public string? MedicoNombre { get; set; }
        public DateTime HoraIngreso { get; set; }
        public DateTime? HoraAnestesia { get; set; }
        public string? EstadoRecepcion { get; set; }
        public bool EsConsulta { get; set; }
        public int Piso { get; set; }
        public int SucursalId { get; set; }
        public string? Sucursal { get; set; }
        public bool EsRetoque { get; set; }
        public string? MotivoConsulta { get; set; }
    }
}
