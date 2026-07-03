using System.ComponentModel.DataAnnotations.Schema;
namespace clinichm_api.Models
{

[NotMapped]
    public class WhatsAppMessage
    {
        public string PhoneNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
    }
}
