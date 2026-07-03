using clinichm_api.DTOs;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface IWhatsAppService
    {
        Task<bool> SendMessageAsync(WhatsAppMessageDto message);
        Task<bool> ProcessMessageAsync(WPMessageResponseDTO messageDto);
    }
    
}
