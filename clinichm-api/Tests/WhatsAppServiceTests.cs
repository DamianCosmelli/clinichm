using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace clinichm_api.Tests
{
    public class WhatsAppServiceTests
    {
        private readonly WhatsAppService _whatsAppService;
        private HttpClient CreateHttpClient()
        {
            var handler = new HttpClientHandlerStub();
            return new HttpClient(handler);
        }

        public WhatsAppServiceTests() 
        {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "WhatsAppApi:PhoneNumberId", "1155555555" },
            { "WhatsAppApi:BaseUrl", "https://graph.facebook.com/v13.0/{PhoneNumberId}/messages" },
            { "WhatsAppApi:AccessToken", "fake-token" },
            { "WhatsAppApi:VerifyToken", "fake-verify-token" }
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        
       _whatsAppService = new WhatsAppService(CreateHttpClient(), configuration);
        }

        [Fact]
        public async Task SendMessageAsync_ReturnsTrue_WhenMessageIsSent()
        {
            // Arrange
            var message = new WhatsAppMessageDto
            {
                PhoneNumber = "1234567890",
                Message = "Hello, World!"
            };

            // Act
            var result = await _whatsAppService.SendMessageAsync(message);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task SendMessageAsync_ReturnsFalse_WhenMessageFailsToSend()
        {
            // Arrange
            var message = new WhatsAppMessageDto
            {
                PhoneNumber = "0000000000",
                Message = "This will fail"
            };

            // Act
            var result = await _whatsAppService.SendMessageAsync(message);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ProcessMessageAsync_ShouldCompleteWithoutError()
        {
            // Arrange: Leer el JSON de prueba || Tests/Mocks
            string filePath =Path.Combine("Mocks", "WhatsAppMessageResponse.json");
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("El archivo JSON de prueba no existe.");
            }

            string jsonContent = await File.ReadAllTextAsync(filePath);
            var webhookDto = JsonSerializer.Deserialize<WhatsAppWebhookResponseDto>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (webhookDto?.Changes == null || webhookDto.Changes.Count == 0 ||
                webhookDto.Changes[0].Value?.Messages == null || webhookDto.Changes[0].Value?.Messages.Count == 0)
            {
                throw new InvalidOperationException("El JSON de prueba no contiene mensajes válidos.");
            }
            
            // Extraer el primer mensaje del JSON
            var messageDto = new WPMessageResponseDTO
            {
                From = webhookDto.Changes[0].Value?.Messages[0].From,
                Id = webhookDto.Changes[0].Value?.Messages[0].Id,
                Timestamp = webhookDto.Changes[0].Value?.Messages[0].Timestamp,
                Text = webhookDto.Changes[0].Value?.Messages[0].Text?.Body
            };

            await _whatsAppService.ProcessMessageAsync(messageDto);
            Assert.True(true);
        }

        private class HttpClientHandlerStub : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                if (request.Content == null)
                {
                    return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest));
                }

                var content = request.Content.ReadAsStringAsync().Result;
                if (content.Contains("0000000000"))
                {
                    return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest));
                }
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK));
            }
        }
    }
}
