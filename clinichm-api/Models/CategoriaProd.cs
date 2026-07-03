using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class CategoriaProd
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        public string Nombre { get; set; } = null!;

    }
}