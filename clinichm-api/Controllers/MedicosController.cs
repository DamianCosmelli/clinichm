using Microsoft.AspNetCore.Mvc;
using clinichm_api.Models;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore; // Agregar esta línea
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using clinichm_api.DTOs;
using clinichm_api.Services;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicosController : ControllerBase
    {
        private readonly IMedicoService _service;

        public MedicosController(IMedicoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicoResponseDTO>> GetById(int id)
        {
            var medico = await _service.GetByIdAsync(id);
            return medico == null ? NotFound() : Ok(medico);
        }

        [HttpPost]
        public async Task<ActionResult> Create(MedicoDTO medicoDto)
        {
            var newMedico = await _service.AddAsync(medicoDto);
            return CreatedAtAction(nameof(GetAll), new {id = newMedico?.Id}, newMedico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, MedicoDTO medicoDto) 
        {
            var updateMedico = await _service.UpdateAsync(id, medicoDto);
            return updateMedico == null ? NotFound(): Ok(updateMedico);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
