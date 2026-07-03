using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecepcionPacientesController : ControllerBase
    {
        private readonly IRecepcionPacientesService _service;

        public RecepcionPacientesController(IRecepcionPacientesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecepcionPacientesResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<RecepcionPacientesResponseDTO>> GetById(int id)
        {
            var recepcionPacientes = await _service.GetByIdAsync(id);
            return recepcionPacientes == null ? NotFound() : Ok(recepcionPacientes);
        }

        [HttpPost]
        public async Task<ActionResult<RecepcionPacientesResponseDTO>> Create(RecepcionPacientesDTO dto)
        {
            var newRecepcionPacientes = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newRecepcionPacientes.Id }, newRecepcionPacientes);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RecepcionPacientesResponseDTO>> Update(int id, RecepcionPacientesDTO dto)
        {
            var updateRecepcionPacientes = await _service.UpdateAsync(id, dto);
            return updateRecepcionPacientes == null ? NotFound() : Ok(updateRecepcionPacientes);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpGet("paciente-fecha")]
        public async Task<ActionResult<IEnumerable<RecepcionCalendarResponseDTO>>> GetRecepcionXDia([FromQuery] DateTime fecha)
        {
            if (fecha == default)
            {
                return BadRequest("La fecha es obligatoria.");
            }

            var pacientesDia = await _service.GetRecepcionXFecha(fecha);
            return Ok(pacientesDia);
        }
        [HttpGet("paciente/{Id}")]
        public async Task<ActionResult<IEnumerable<RecepcionCalendarResponseDTO>>> GetRecepcionXPacienteId(int Id)
        {
            if (Id<=0)
            {
                return BadRequest("El pacienteId es obligatorio.");
             }

            var pacientesDia = await _service.GetRecepcionXPacienteId(Id);
            return Ok(pacientesDia);
        }
    }
}
