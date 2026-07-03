using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacientesController : ControllerBase
    {
        private readonly IPacienteService _service;

        public PacientesController(IPacienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteResponseDTO>> GetById(int id)
        {
            var paciente = await _service.GetByIdAsync(id);
            return paciente == null ? NotFound() : Ok(paciente);
        }

        [HttpPost("buscar-por-dni")]
        public async Task<ActionResult<PacienteResponseDTO>> GetByDNI([FromBody] PacienteDNIDTO pacienteDniDto)
        {
            var paciente = await _service.GetByDNIAsync(pacienteDniDto.DNI);
            return paciente == null ? NotFound() : Ok(paciente);
        }

        [HttpPost]
        public async Task<ActionResult<PacienteResponseDTO>> Create(PacienteDTO pacienteDto)
        {
            var newPaciente = await _service.AddAsync(pacienteDto);
            return CreatedAtAction(nameof(GetAll), new {id = newPaciente.Id}, newPaciente);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PacienteResponseDTO>> Update(int id, PacienteDTO pacienteDto)
        {
            var updatePaciente = await _service.UpdateAsync(id, pacienteDto);
            return updatePaciente == null ? NoContent() : Ok(updatePaciente);
        }
            

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpGet("por-medico")]
        public async Task<ActionResult<IEnumerable<PacientesPorMedicoDTO>>> GetPacientesPorMedico()
        {
            var pacientesPorMedico = await _service.GetPacientesPorMedicoAsync();
            return Ok(pacientesPorMedico);
        }

        [HttpGet("solo-consulto")]
        public async Task<ActionResult<IEnumerable<PacienteResponseDTO>>> GetPacientesSoloConsulto()
        {
            var pacientesSoloConsulto = await _service.GetPacientesSoloConsultoAsync();
            return Ok(pacientesSoloConsulto);
        }

        [HttpGet("sin-visita-en-ultimos-meses/{meses}")]
        public async Task<ActionResult<IEnumerable<PacienteUltVisitaRespDTO>>> GetPacientesSinVisitaEnUltimosMeses(int meses)
        {
            var pacientesSinVisita = await _service.GetPacientesSinVisitaEnUltimosMesesAsync(meses);
            return Ok(pacientesSinVisita);
        }
    }
}
