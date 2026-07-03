using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El id de categoria es obligatorio.")]
        public int CategoriaProdId { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; } = null!;

        public Boolean NoAutoDescontable { get; set; } = false;
        

    }
}
                