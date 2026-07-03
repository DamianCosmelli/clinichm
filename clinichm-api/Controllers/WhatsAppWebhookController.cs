using clinichm_api.DTOs;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Serilog;
using NuGet.Protocol;

namespace clinichm_api.Controllers
{
    [ApiController]
    [Route("api/webhook")] 
    public class WhatsAppWebhookController : ControllerBase
    {
        private readonly IWhatsAppService _whatsAppService;
        private readonly string _verifyToken;

        public WhatsAppWebhookController(IWhatsAppService whatsAppService, IConfiguration configuration)
        {
            _whatsAppService = whatsAppService;
            _verifyToken = configuration["WhatsAppApi:VerifyToken"] ?? throw new InvalidOperationException("WhatsApp Access Token no está configurado.");
        }

        [HttpGet]
        public IActionResult VerifyWebhook([FromQuery(Name = "hub.mode")] string hub_mode, 
                                   [FromQuery(Name = "hub.challenge")] string hub_challenge, 
                                   [FromQuery(Name = "hub.verify_token")] string hub_verify_token)
        {
            if (hub_mode == "subscribe" && hub_verify_token == _verifyToken)
            {
                return Ok(hub_challenge);
            }
            
            return Unauthorized();
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveMessage([FromBody] WhatsAppWebhookResponseDto messageDto)
        {
            if (messageDto == null)
            {
                throw new BadHttpRequestException("Invalid message format");
            }
            
            Log.Information("WhatsApp - Received message: {message}", messageDto.ToJson());

            var message = new WPMessageResponseDTO{
                From = messageDto.Changes[0].Value?.Messages[0].From,
                Id=messageDto.Changes[0].Value?.Messages[0].Id,
                Timestamp=messageDto.Changes[0].Value?.Messages[0].Timestamp,
                Text=messageDto.Changes[0].Value?.Messages[0].Text?.Body
            };

            await _whatsAppService.ProcessMessageAsync(message);

            return Ok(new { status = "Received" });
        }
    }
}