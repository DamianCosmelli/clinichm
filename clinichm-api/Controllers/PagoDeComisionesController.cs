using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoDeComisionesController : ControllerBase
    {
        private readonly IPagoDeComisionesService _service;

        public PagoDeComisionesController(IPagoDeComisionesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PagoDeComisionesResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<PagoDeComisionesResponseDTO>> GetById(int id)
        {
            var pagoDeComisiones = await _service.GetByIdAsync(id);
            return pagoDeComisiones == null ? NotFound() : Ok(pagoDeComisiones);
        }

        [HttpPost]
        public async Task<ActionResult<PagoDeComisionesResponseDTO>> Create(PagoDeComisionesDTO dto)
        {
            var newPagoDeComisiones = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newPagoDeComisiones.Id }, newPagoDeComisiones);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PagoDeComisionesResponseDTO>> Update(int id, PagoDeComisionesDTO dto)
        {
            var updatePagoDeComisiones = await _service.UpdateAsync(id, dto);
            return updatePagoDeComisiones == null ? NotFound() : Ok(updatePagoDeComisiones);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
        
        [HttpGet("cierrecaja/{id}")]
        public async Task<ActionResult<PagoDeComisionesResponseDTO>> GetByIdCierreCaja(int id)
        {
            var pagoDeComisiones = await _service.GetByIdCajaAsync(id);
            return pagoDeComisiones == null ? NotFound() : Ok(pagoDeComisiones);
        }
    }
}
