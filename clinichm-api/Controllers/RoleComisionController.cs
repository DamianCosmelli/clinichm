using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleComisionController : ControllerBase
    {
        private readonly IRoleComisionService _service;

        public RoleComisionController(IRoleComisionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleComisionResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleComisionResponseDTO>> GetById(int id)
        {
            var roleComision = await _service.GetByIdAsync(id);
            return roleComision == null ? NotFound() : Ok(roleComision);
        }

        [HttpPost]
        public async Task<ActionResult<RoleComisionResponseDTO>> Create(RoleComisionDTO dto)
        {
            var newRoleComision = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newRoleComision.Id }, newRoleComision);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RoleComisionResponseDTO>> Update(int id, RoleComisionDTO dto)
        {
            var updateRoleComision = await _service.UpdateAsync(id, dto);
            return updateRoleComision == null ? NotFound() : Ok(updateRoleComision);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
