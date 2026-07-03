using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicoTratamientoController : ControllerBase
    {
        private readonly IMedicoTratamientoService _service;

        public MedicoTratamientoController(IMedicoTratamientoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicoTratamientoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicoTratamientoResponseDTO>> GetById(int id)
        {
            var medicoTratamiento = await _service.GetByIdAsync(id);
            return medicoTratamiento == null ? NotFound() : Ok(medicoTratamiento);
        }

        [HttpPost]
        public async Task<ActionResult<MedicoTratamientoResponseDTO>> Create(MedicoTratamientoDTO dto)
        {
            var newMedicoTratamiento = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newMedicoTratamiento.Id }, newMedicoTratamiento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MedicoTratamientoResponseDTO>> Update(int id, MedicoTratamientoDTO dto)
        {
            var updateMedicoTratamiento = await _service.UpdateAsync(id, dto);
            return updateMedicoTratamiento == null ? NotFound() : Ok(updateMedicoTratamiento);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
