using clinichm_api.Models;

namespace clinichm_api.DTOs
{
    public class PacienteDTO
    {
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Celular { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
        public string MedioPublicidad { get; set; } = null!;
        public bool SoloConsulto { get; set; }
        public string? FechaDeRecontacto { get; set; }
        public DateOnly? FechaNac { get; set; }
    }

    public class PacienteResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Celular { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
        public string MedioPublicidad { get; set; } = null!;
        public bool SoloConsulto { get; set; }
        public string? FechaDeRecontacto { get; set; }
        public DateOnly? FechaNac { get; set; }
    }

    public class PacientesPorMedicoDTO
    {
        public int MedicoId { get; set; }
        public List<PacienteResponseDTO> Pacientes { get; set; } = null!;
    }

    public class PacienteDNIDTO
    {
        public string DNI { get; set; } = null!;
    }

    public class PacienteUltVisitaRespDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Celular { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string CodigoPostal { get; set; } = null!;
        public string MedioPublicidad { get; set; } = null!;
        public DateTime HoraIngreso { get; set; }
    }
}
