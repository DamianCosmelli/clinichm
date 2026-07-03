using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace clinichm_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaProdController : ControllerBase
    {
        private readonly ICategoriaProdService _service;

        public CategoriaProdController(ICategoriaProdService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaProdDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaProdDTO>> GetById(int id)
        {
            var categoria = await _service.GetByIdAsync(id);
            return categoria == null ? NotFound() : Ok(categoria);
        }

        [HttpPost]
        public async Task<ActionResult> Create(CategoriaProdReqDTO categoriaDto)
        {
            var newCategoria = await _service.AddAsync(categoriaDto);
            return CreatedAtAction(nameof(GetById), new { id = newCategoria!.Id }, newCategoria);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoriaProdDTO>> Update(int id, CategoriaProdReqDTO categoriaDto)
        {
            var updatedCategoria = await _service.UpdateAsync(id, categoriaDto);
            return updatedCategoria == null ? NotFound() : Ok(updatedCategoria);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}