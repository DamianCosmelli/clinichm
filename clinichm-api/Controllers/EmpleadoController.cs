using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly IEmpleadoService _empleadoService;

        public EmpleadoController(IEmpleadoService empleadoService)
        {
            _empleadoService = empleadoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpleadoResponseDTO>>> GetAll() => Ok(await _empleadoService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<EmpleadoResponseDTO>> GetById(int id)
        {
            var empleado = await _empleadoService.GetByIdAsync(id);
            return empleado == null ? NotFound() : Ok(empleado);
        }

        [HttpPost]
        public async Task<ActionResult> Create(EmpleadoDTO empleadoDto)
        {
            var newEpleado = await _empleadoService.AddAsync(empleadoDto);
            return CreatedAtAction(nameof(GetAll), new {id = newEpleado.Id},newEpleado);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmpleadoResponseDTO>> Update(int id, EmpleadoDTO empleadoDto)
        {
            var updateEmpledo = await _empleadoService.UpdateAsync(id, empleadoDto);
            return updateEmpledo == null ? NotFound(): Ok(updateEmpledo);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _empleadoService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
