using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditStockController : ControllerBase
    {
        private readonly IAuditStockService _auditStockService;

        public AuditStockController(IAuditStockService auditStockService)
        {
            _auditStockService = auditStockService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditStockResponseDTO>>> GetAll()
        {
            var result = await _auditStockService.GetAllAsync();
            return Ok(result);
        }
    }
}
