using System.ComponentModel.DataAnnotations;
namespace clinichm_api.Models
{
    public class RoleComision
    {
        [Key] 
        public int Id { get; set; }

        [StringLength(20, ErrorMessage = "El role no puede tener más de 20 caracteres.")]

        public string Role { get; set; } = null!;
    }
}
