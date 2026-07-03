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
    public class SucursalesController : ControllerBase
    {
        private readonly ISucursalService _service;

        public SucursalesController(ISucursalService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SucursalResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<SucursalResponseDTO>> GetById(int id)
        {
            var sucursal = await _service.GetByIdAsync(id);
            return sucursal == null ? NotFound() : Ok(sucursal);
        }

        [HttpPost]
        public async Task<ActionResult> Create(SucursalDTO sucursalDto)
        {
            var newSucursal = await _service.AddAsync(sucursalDto);
            return CreatedAtAction(nameof(GetAll), new {id = newSucursal.Id}, newSucursal );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SucursalResponseDTO>> Update(int id, SucursalDTO sucursalDto)
        {
            var updateSucursal = await _service.UpdateAsync(id, sucursalDto);
            return updateSucursal == null ? NotFound() : Ok(updateSucursal);
        }
            

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
