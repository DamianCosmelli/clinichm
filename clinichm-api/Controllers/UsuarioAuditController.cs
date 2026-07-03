using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioAuditController : ControllerBase
    {
        private readonly IUsuarioAuditService _usuarioAuditService;

        public UsuarioAuditController(IUsuarioAuditService usuarioAuditService)
        {
            _usuarioAuditService = usuarioAuditService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioAuditDTO>>> GetAll() => Ok(await _usuarioAuditService.GetAllAsync());

        [HttpGet("{UsuarioId}")]
        public async Task<ActionResult<IEnumerable<UsuarioAuditRespDTO>>> GetSessionByUsuarioId(int UsuarioId) => Ok(await _usuarioAuditService.GetSessionByUserIdAsync(UsuarioId));
     

    }
}
