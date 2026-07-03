using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientoCajaController : ControllerBase
    {
        private readonly IMovimientoCajaService _service;
        private readonly ICobrosService _cobroService;
        private readonly AppDbContext _context = null!;
        private readonly IExcelService _excelService;

        public MovimientoCajaController(IMovimientoCajaService service, ICobrosService cobroService)
        {
            _service = service;
            _cobroService = cobroService;
            _excelService = new ExcelServices(_context);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoCajaResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoCajaResponseDTO>> GetById(int id)
        {
            var movimientoCaja = await _service.GetByIdAsync(id);
            return movimientoCaja == null ? NotFound() : Ok(movimientoCaja);
        }

        [HttpPost]
        public async Task<ActionResult<MovimientoCajaResponseDTO>> Create(MovimientoCajaDTO movimientoCajaDto)
        {
            var newMovimiento = await _service.AddAsync(movimientoCajaDto);
            return CreatedAtAction(nameof(GetAll), new { id = newMovimiento.Id }, newMovimiento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MovimientoCajaResponseDTO>> Update(int id, MovimientoCajaDTO movimientoCajaDto)
        {
            var updateMovimiento = await _service.UpdateAsync(id, movimientoCajaDto);
            return updateMovimiento == null ? NotFound() : Ok(updateMovimiento);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpPost("procesar-pago")]
        public async Task<ActionResult<CobrosRespDto>> ProcesarPago(CobrosDTO cobro)
        {
            var newCobro = await _cobroService.ProcesarCobro(cobro);
            return CreatedAtAction(nameof(GetAll), new { id = newCobro.Id }, newCobro);
        }

        // si se pasa sucarsal = 0 trae todas las sucursales
        [HttpGet("hoy")]
        public IActionResult MovimientosyComisiones([FromQuery] int sucursal=0)
        {
            var movYcom = _service.MovimientosyComisiones(sucursal);
            return _excelService.GenerarExcelMovientosYcomisiones(movYcom.Result);
        }
    }
}
