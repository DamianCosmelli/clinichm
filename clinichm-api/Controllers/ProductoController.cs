using clinichm_api.DTOs;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clinichm_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductoController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDTO>>> GetAll() => Ok(await _productoService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDTO>> GetById(int id)
        {
            var producto = await _productoService.GetByIdAsync(id);
            return producto == null ? NotFound() : Ok(producto);
        }

        [HttpPost]
        public async Task<ActionResult> Create(ProductoDTO productoDto)
        {
            var newProducto = await _productoService.AddAsync(productoDto);
            return CreatedAtAction(nameof(GetAll), new { id = newProducto!.Id }, newProducto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductoDTO>> Update(int id, ProductoDTO productoDto)
        {
            var updatedProducto = await _productoService.UpdateAsync(id, productoDto);
            return updatedProducto == null ? NotFound() : Ok(updatedProducto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _productoService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}