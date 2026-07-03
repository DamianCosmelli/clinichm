using clinichm_api.DTOs;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Serilog;
using NuGet.Protocol;

namespace clinichm_api.Services
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly HttpClient _httpClient;
        private readonly string _whatsAppApiUrl;
        private readonly string _accessToken;

        public WhatsAppService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _whatsAppApiUrl = configuration["WhatsAppApi:BaseUrl"] ?? throw new InvalidOperationException("WhatsApp API URL no está configurada.");
            _accessToken = configuration["WhatsAppApi:AccessToken"] ?? throw new InvalidOperationException("WhatsApp Access Token no está configurado.");
        }

        public async Task<bool> SendMessageAsync(WhatsAppMessageDto message)
        {
            try 
            {
                var requestContent = new StringContent(
                    JsonSerializer.Serialize(message),
                    Encoding.UTF8,
                    "application/json"
                );

                var request = new HttpRequestMessage(HttpMethod.Post, $"{_whatsAppApiUrl}/sendMessage")
                {
                    Content = requestContent,
                    Headers =
                    {
                        { "Authorization", $"Bearer {_accessToken}" }
                    }
                };

                var response = await _httpClient.SendAsync(request);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al enviar mensaje WhatsApp", ex);
            }
        }

        public async Task<bool> ProcessMessageAsync(WPMessageResponseDTO messageDto)
        {
            try
            {
                // TODO: Procesar el mensaje
                Log.Information("WhatsApp - Message to Process: {message}", messageDto.ToJson());
                await Task.CompletedTask;
                return true;
            }
            catch (Exception ex)
            {
                
                throw new Exception("Error al procesar mensaje", ex);
            }
        }
    }
}
