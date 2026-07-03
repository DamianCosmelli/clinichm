using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TratamientosController : ControllerBase
    {
        private readonly ITratamientoService _service;

        public TratamientosController(ITratamientoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TratamientoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<TratamientoResponseDTO>> GetById(int id)
        {
            var tratamiento = await _service.GetByIdAsync(id);
            return tratamiento == null ? NotFound() : Ok(tratamiento);
        }

        [HttpPost]
        public async Task<ActionResult<TratamientoResponseDTO>> Create(TratamientoDTO tratamientoDto)
        {
            var newTratamiento = await _service.AddAsync(tratamientoDto);
            return CreatedAtAction(nameof(GetAll), new {id = newTratamiento.Id}, newTratamiento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TratamientoResponseDTO>> Update(int id, TratamientoDTO tratamientoDto)
        {
            var updateTratamiento = await _service.UpdateAsync(id, tratamientoDto);
            return updateTratamiento == null ? NotFound() : Ok(updateTratamiento);
        }
            

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
