using System.ComponentModel.DataAnnotations;
namespace clinichm_api.Models
{
    public class UsuarioAudit
    {
        [Key]
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime? LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public string? Ip { get; set; }
        public string? Navegador { get; set; }
    }
}