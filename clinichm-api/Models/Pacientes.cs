namespace clinichm_api.Models
{
    public class Pacientes
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
}
