using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class Stock
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El ProductoId es obligatorio.")]
        public int ProductoId { get; set; }

        [Required(ErrorMessage = "El lote es obligatorio.")]
        public string? Lote { get; set; }

        [Required(ErrorMessage = "La fecha de vencimiento es obligatoria.")]
        public DateOnly Vencimiento { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "La cantidad de ingreso no puede ser negativa.")]
        public decimal CantidadIngreso { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "La cantidad existente no puede ser negativa.")]
        public decimal CantidadExistente { get; set; }

        [Required(ErrorMessage = "La fecha de ingreso es obligatoria.")]
        public DateOnly FechaIngreso { get; set; }

        [Required(ErrorMessage = "El depósito es obligatorio.")]

        public string? Deposito { get; set; }
        public string? TipoOperacion { get; set; }
    }
}
