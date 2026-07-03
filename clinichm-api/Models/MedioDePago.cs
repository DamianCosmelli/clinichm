
using System.ComponentModel.DataAnnotations;
namespace clinichm_api.Models
{
    public class MedioDePago
    {
        [Key] // Define la clave primaria
        public int Id { get; set; }

        [StringLength(20, ErrorMessage = "El medio de pago no puede tener más de 20 caracteres.")]
        public string MedioPago { get; set; } = null!;
    }
}
