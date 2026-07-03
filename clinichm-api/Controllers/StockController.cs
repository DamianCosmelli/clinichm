using Microsoft.AspNetCore.Mvc;
using clinichm_api.DTOs;
using clinichm_api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using clinichm_api.Data;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;
        private readonly IExcelService _excelService;

        public StockController(IStockService stockService, IExcelService excelService)
        {
            _stockService = stockService;
            _excelService = excelService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockResponseDTO>>> GetAll() => Ok(await _stockService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<StockResponseDTO>> GetById(int id)
        {
            var stock = await _stockService.GetByIdAsync(id);
            return stock == null ? NotFound() : Ok(stock);
        }

        [HttpPost]
        public async Task<ActionResult> Create(StockDTO dto)
        {
            var newStock = await _stockService.AddAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = newStock.Id }, newStock);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StockResponseDTO>> Update(int id, StockDTO dto)
        {
            var updated = await _stockService.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _stockService.DeleteAsync(id) ? NoContent() : NotFound();

        // Genera un archivo Excel con el reporte de cierres de caja de todas las sedes.
        [HttpGet("reporte")]
        public IActionResult GetReporteCierreCentral()
        {
            var listadoStock = _stockService.GetAllAsync();
            if (listadoStock == null)
                return NotFound("No se encontraron registros de stock.");
            return _excelService.GenerarExcelReporteStock(listadoStock.Result);
            
        }
    }
}
