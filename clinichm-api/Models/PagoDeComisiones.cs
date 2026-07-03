using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class PagoDeComisiones
    {
        [Key] // Define la clave primaria
        public int Id { get; set; }

        [Required]
        public int MedicoId { get; set; }

        [Required]
        public DateTime FechaDePago { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "El método de pago no puede tener más de 20 caracteres.")]
        public string MetodoDePago { get; set; } = "Efectivo";

    
        [Range(0, double.MaxValue, ErrorMessage = "El monto no puede ser negativo.")]
        public decimal Monto { get; set; }

        [Required]
        public int CierreDeCajaId { get; set; }
    }
}
