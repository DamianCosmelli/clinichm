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
    public class RolController : ControllerBase
    {
        private readonly IRolService _service;

        public RolController(IRolService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<RolResponseDTO>> GetById(int id)
        {
            var rol = await _service.GetByIdAsync(id);
            return rol == null ? NotFound() : Ok(rol);
        }

        [HttpPost]
        public async Task<ActionResult> Create(RolDTO rolDto)
        {
            var newRol = await _service.AddAsync(rolDto);
            return CreatedAtAction(nameof(GetAll), new { id = newRol!.Id }, newRol);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RolResponseDTO>> Update(int id, RolDTO rolDto)
        {
            var updatedRol = await _service.UpdateAsync(id, rolDto);
           return updatedRol == null ? NotFound() : Ok(updatedRol);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
