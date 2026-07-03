using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedioDePagoController : ControllerBase
    {
        private readonly IMedioDePagoService _service;

        public MedioDePagoController(IMedioDePagoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedioDePagoResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<MedioDePagoResponseDTO>> GetById(int id)
        {
            var medioDePago = await _service.GetByIdAsync(id);
            return medioDePago == null ? NotFound() : Ok(medioDePago);
        }

        [HttpPost]
        public async Task<ActionResult<MedioDePagoResponseDTO>> Create(MedioDePagoDTO dto)
        {
            var newMedioDePago= await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new {id= newMedioDePago.Id}, newMedioDePago);
        }                                   

        [HttpPut("{id}")]
        public async Task<ActionResult<MedioDePagoResponseDTO>> Update(int id, MedioDePagoDTO dto) 
        {
            var updateMedioPago = await _service.UpdateAsync(id, dto);

            return updateMedioPago == null ? NotFound() : Ok(updateMedioPago);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
