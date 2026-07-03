using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class AuditStock
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "La fecha es obligatoria.")]
        public DateTime Fecha { get; set; }

        [Required(ErrorMessage = "El Id de registro es obligatorio.")]
        public int IdRegistro { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "La cantidad previa no puede ser negativa.")]
        public decimal CantPrevia { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "La cantidad nueva no puede ser negativa.")]
        public decimal CantNueva { get; set; }

        [Required(ErrorMessage = "El tipo de movimiento es obligatorio.")]
       
        public string? TipoMovimiento { get; set; }

        [Required(ErrorMessage = "El usuario es obligatorio.")]
        public int UsuarioId { get; set; }
    }
}
