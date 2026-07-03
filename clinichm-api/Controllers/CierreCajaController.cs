using Microsoft.AspNetCore.Mvc;
using clinichm_api.Services;
using clinichm_api.DTOs;
using clinichm_api.Data;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CierreCajaController : ControllerBase
    {
        private readonly ICierreCajaService _service;
        private readonly AppDbContext _context = null!;
        private readonly IExcelService _excelService;

        public CierreCajaController(ICierreCajaService service)
        {
            _service = service;
            _excelService = new ExcelServices(_context);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CierreCajaResponseDTO>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<CierreCajaResponseDTO>> GetById(int id)
        {
            var cierreCaja = await _service.GetByIdAsync(id);
            return cierreCaja == null ? NotFound() : Ok(cierreCaja);
        }

        [HttpPost]
        public async Task<ActionResult<CierreCajaResponseDTO>> Create(CierreCajaDTO dto)
        {
            var newCierreCaja = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newCierreCaja.Id }, newCierreCaja);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CierreCajaResponseDTO>> Update(int id, CierreCajaDTO dto)
        {
            var updateCierreCaja = await _service.UpdateAsync(id, dto);
            return updateCierreCaja == null ? NotFound() : Ok(updateCierreCaja);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpPost("procesar-cierre-diario")]
        public async Task<ActionResult<CierreCajaResponseDTO>> ProcesarCierreDiario(CierreCajaRequestDTO request)
        {
            var cierreCaja = await _service.ProcesarCierreDiarioAsync(request);
            return cierreCaja == null ? NotFound() : Ok(cierreCaja);
        }

        [HttpGet("cierres-del-mes")]
        public async Task<ActionResult<IEnumerable<CierreCajaResponseDTO>>> GetCierresDelMes(int idSucursal, int month, int year)
        {
            var cierres = await _service.GetCierresDelMesAsync(idSucursal, month, year);
            return Ok(cierres);
        }
        // Devuelve los datos de un cierre de caja específico junto con sus movimientos, productos y comisiones pagadas.
        [HttpGet("cierre-info/{id}")]
        public async Task<ActionResult<CierreCajaReporteDTO>> GetCierreAndMovimientos(int id)
        {
            var cierreAndMovimientos = await _service.GetCierreInfoAsync(id);
            return cierreAndMovimientos == null ? NotFound() : Ok(cierreAndMovimientos);
        }
        // Genera un archivo Excel con el reporte de cierre de caja.
        [HttpGet("reporte-cierre/{id}")]
        public IActionResult GetReporteCierre(int id)
        {
            var cierreInfo = _service.GetCierreInfoAsync(id);
            return _excelService.GenerarExcelReporteCierre(cierreInfo.Result);
        }
        // Genera un archivo Excel con el reporte de cierres de caja de todas las sedes.
        [HttpGet("reporte-central")]
        public IActionResult GetReporteCierreCentral([FromQuery] DateOnly fecha)
        {
            if (fecha == default)
            {
                return BadRequest("La fecha del cierre es obligatorias.");
            }

            var listadoCierres = _service.GetCierreXFechaAsync(fecha);
            return _excelService.GenerarExcelReporteCierreCentral(listadoCierres.Result);
        }
        // Cambia el método de pago de una comisión específica.
        [HttpPut("cambiar-metodo-pago-comision/{idPagoComision}")]
        public async Task<ActionResult<bool>> ChangeMetodoPagoComision(int idPagoComision)
        {
            var result = await _service.ChangeMetodoPagoComision(idPagoComision);
            return result ? Ok(true) : NotFound();
        }
    }
}
