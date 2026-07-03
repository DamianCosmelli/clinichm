using Microsoft.AspNetCore.Mvc;
using clinichm_api.Controllers;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;
using clinichm_api.Tests;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace clinichm_api.Tests
{
    public class WhatsAppWebhookControllerTests
    {
        private readonly WhatsAppWebhookController _controller;
        private readonly WhatsAppService _whatsAppService;

        private HttpClient CreateHttpClient()
        {
            var handler = new HttpClientHandlerStub();
            return new HttpClient(handler);
        }

        public WhatsAppWebhookControllerTests()
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
        _controller = new WhatsAppWebhookController(_whatsAppService, configuration);
        }

        [Fact]
        public async Task ReceiveMessage_ShouldReturnOk_WhenValidMessage()
        {
                        // Arrange: Leer el JSON de prueba
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
            
            // Act
            var result = await _controller.ReceiveMessage(webhookDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task ReceiveMessage_ShouldThrowBadHttpRequestException_WhenMessageIsNull()
        {
            await Assert.ThrowsAsync<BadHttpRequestException>(async () => 
                await _controller.ReceiveMessage(null!));
        }

        [Fact]
        public void VerifyWebhook_ShouldReturnOk_WhenValidRequest()
        {
            // Act
            var phone = "1155555555";
            var result = _controller.VerifyWebhook("subscribe", phone, "fake-verify-token");

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(phone, okResult.Value);
        }   

                [Fact]
        public void VerifyWebhook_ShouldReturnNotOk_WhenValidRequest()
        {
            // Act
            var phone = "1155555555";
            var result = _controller.VerifyWebhook("subscribe", phone, "fake-verify-ERROR-token") as UnauthorizedResult;

            var notOkResult = Assert.IsType<UnauthorizedResult>(result);
            Assert.NotNull(result);
            Assert.Equal(401, result.StatusCode);
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