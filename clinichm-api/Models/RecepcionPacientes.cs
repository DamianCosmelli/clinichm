using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class RecepcionPacientes
    {
        [Key] // Clave primaria
        public int Id { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del paciente debe ser un número positivo.")]
        public int PacienteId { get; set; }

        [Required(ErrorMessage = "El ID del tratamiento es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del tratamiento debe ser un número positivo.")]
        public int TratamientoId { get; set; }

        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del médico debe ser un número positivo.")]
        public int MedicoId { get; set; }

        [Required(ErrorMessage = "La hora de ingreso es obligatoria.")]
        public DateTime HoraIngreso { get; set; }

        public DateTime? HoraAnestesia { get; set; }

        [Required(ErrorMessage = "El estado de recepción es obligatorio.")]
        public string? EstadoRecepcion { get; set; }

        [Required(ErrorMessage = "Debe indicar si es una consulta.")]
        public bool EsConsulta { get; set; }

        [Range(0, 100, ErrorMessage = "El piso debe estar entre 0 y 100.")]
        public int Piso { get; set; }

        [Required(ErrorMessage = "El ID de sucursal es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID de sucursal debe ser un número positivo.")]
        public int SucursalId { get; set; }

        public bool EsRetoque { get; set; }
        
        public string? MotivoConsulta { get; set; }
    }
}
