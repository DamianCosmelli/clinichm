using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnosController : ControllerBase
    {
        private readonly ITurnoService _service;

        public TurnosController(ITurnoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TurnoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<TurnoResponseDTO>> GetById(int id)
        {
            var turno = await _service.GetByIdAsync(id);
            return turno == null ? NotFound() : Ok(turno);
        }

        [HttpGet("duplicados/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<TurnoDuplicadoDTO>>> GetTurnosDuplicados(int pacienteId)
        {
            var turnosDuplicados = await _service.GetTurnosDuplicadosAsync(pacienteId);
            return Ok(turnosDuplicados);
        }

        [HttpPost]
        public async Task<ActionResult<TurnoResponseDTO>> Create(TurnoDTO turnoDto)
        {
            var newTurno = await _service.AddAsync(turnoDto);
            return CreatedAtAction(nameof(GetAll), new {id = newTurno.Id}, newTurno);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TurnoResponseDTO>> Update(int id, TurnoDTO turnoDto)
        {
            var updateTurno = await _service.UpdateAsync(id, turnoDto);
            return updateTurno == null ? NotFound(): Ok(updateTurno);
        }
            

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    
        [HttpGet("ausentes")]
        public async Task<ActionResult<IEnumerable<TurnoDTO>>> GetTurnosAusentes()
        {
            var turnosAusentes = await _service.GetTurnosAusentesAsync();
            return Ok(turnosAusentes);
        }

        
        [HttpGet("turnos-afectados")]
        public async Task<ActionResult<IEnumerable<TurnoResponseXCalendarDTO>>> GetTurnosAfectadosPorCambioAgenda()
        {
            var turnosAfectados = await _service.GetTurnosAfectadosPorCambioAgendaAsync();
            return Ok(turnosAfectados);
        }

        [HttpGet("rango-fecha")]
        public async Task<ActionResult<IEnumerable<TurnoResponseXCalendarDTO>>> GetTurnosRangoFecha([FromQuery] DateTime fechaDesde, [FromQuery] DateTime fechaHasta)
        {
            if (fechaDesde == default || fechaHasta == default)
            {
                return BadRequest("Las fechas fechaDesde y fechaHasta son obligatorias.");
            }
            if (fechaDesde > fechaHasta)
            {
                return BadRequest("La fechaDesde no puede ser mayor que la fechaHasta.");
            }
            
            
            var turnosRangoFecha = await _service.GetTurnosRangoFecha(fechaDesde, fechaHasta);
            return Ok(turnosRangoFecha);
        }

        // Endpoint para alternar el campo ConResolucion de TurnosAfectados por TurnoId
        [HttpPut("turnos-afectados/{turnoId}/con-resolucion")]
        public async Task<ActionResult> UpdateConResolucionTurnoAfectado(int turnoId)
        {
            var actualizado = await _service.UpdateConResolucionTurnoAfectadoAsync(turnoId);
            if (!actualizado)
                return NotFound();
            return NoContent();
        }
    }
}
