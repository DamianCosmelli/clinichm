using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class MedicoTratamiento
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MedicoId { get; set; }

        [Required]
        public int TratamientoId { get; set; }
    }
}
