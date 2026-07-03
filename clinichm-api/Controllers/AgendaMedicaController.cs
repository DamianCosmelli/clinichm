using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Drawing.Wordprocessing;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaMedicaController : ControllerBase
    {
        private readonly IAgendaMedicaService _service;

        public AgendaMedicaController(IAgendaMedicaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgendaMedicaResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<AgendaMedicaResponseDTO>> GetById(int id)
        {
            var agendaMedica = await _service.GetByIdAsync(id);
            return agendaMedica == null ? NotFound() : Ok(agendaMedica);
        }

        [HttpPost]
        public async Task<ActionResult<AgendaMedicaResponseDTO>> Create(AgendaMedicaDTO agendaMedicaDto)
        {
            var newAgenda = await _service.AddAsync(agendaMedicaDto);
            return CreatedAtAction(nameof(GetAll), new { id = newAgenda?.Id }, newAgenda);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AgendaMedicaResponseDTO>> Update(int id, AgendaMedicaDTO agendaMedicaDto)
        {
            var updateAgenda = await _service.UpdateAsync(id, agendaMedicaDto);
            return updateAgenda == null ? NotFound() : Ok(updateAgenda);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpGet("rango-fecha")]
        public async Task<ActionResult<IEnumerable<AgendaMedicaResponseXCalendarDTO>>> GetAgendaMedicaFehaRango([FromQuery] DateTime fechaDesde, [FromQuery] DateTime fechaHasta)
        {
            if (fechaDesde == default || fechaHasta == default)
            {
                return BadRequest("Las fechas fechaDesde y fechaHasta son obligatorias.");
            }
            if (fechaDesde > fechaHasta)
            {
                return BadRequest("La fechaDesde no puede ser mayor que la fechaHasta.");
            }
            if (fechaDesde.Date == fechaHasta.Date)
            {
                return BadRequest("Las fechas fechaDesde y fechaHasta no pueden ser iguales.");
            }
            var agendaMedica = await _service.GetAgendaMedicaFehaRangoAsync(fechaDesde, fechaHasta);
            return Ok(agendaMedica);
        }
           [HttpGet("medico-disponibles")]
        public async Task<ActionResult<IEnumerable<AgendaMedicaResponseDTO>>> GetAgendaMedicaMedicos([FromQuery] DateTime fechaDesde, [FromQuery] DateTime fechaHasta,
        [FromQuery] int hora, [FromQuery] int sucursalId)
        {
            if (fechaDesde == default || fechaHasta == default)
            {
                return BadRequest("Las fechas fechaDesde y fechaHasta son obligatorias.");
            }
            if (fechaDesde > fechaHasta)
            {
                return BadRequest("La fechaDesde no puede ser mayor que la fechaHasta.");
            }
            if (sucursalId <= 0)
            {
                return BadRequest("El id de la sucursal es obligatorio.");
            }
            if (hora == default)
            {
                return BadRequest("La hora es obligatoria.");
            }
            if (hora < 0 || hora > 23)
            {
                return BadRequest("La hora debe estar en el rango de 0 a 23");
            }
            var agendaMedica = await _service.GetAgendaMedicaFehaRangoHoraYSucAsync(fechaDesde, fechaHasta, hora, sucursalId);
            return Ok(agendaMedica);
        }
        
    }

}
