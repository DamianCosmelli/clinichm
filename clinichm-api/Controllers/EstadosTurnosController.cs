using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadosTurnosController : ControllerBase
    {
        private readonly IEstadoTurnoService _service;

        public EstadosTurnosController(IEstadoTurnoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EstadoTurnoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<EstadoTurnoResponseDTO>> GetById(int id)
        {
            var estadoTurno = await _service.GetByIdAsync(id);
            return estadoTurno == null ? NotFound() : Ok(estadoTurno);
        }

        [HttpPost]
        public async Task<ActionResult<EstadoTurnoResponseDTO>> Create(EstadoTurnoDTO estadoTurnoDto)
        {
            var newEstadoTurno = await _service.AddAsync(estadoTurnoDto);
            return CreatedAtAction(nameof(GetAll), new{id = newEstadoTurno?.Id} ,newEstadoTurno);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EstadoTurnoResponseDTO>> Update(int id, EstadoTurnoDTO estadoTurnoDto)
        {
            var updateEstadoTurno =  await _service.UpdateAsync(id, estadoTurnoDto);
            return updateEstadoTurno == null ? NotFound() : Ok(updateEstadoTurno);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
