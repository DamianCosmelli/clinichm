using clinichm_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using clinichm_api.Data;
using System.Collections;
using Serilog;
using Microsoft.EntityFrameworkCore;
using clinichm_api.Services;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImportDataController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IExcelService _excelService;

        public ImportDataController(AppDbContext context)
        {
            _context = context;
            _excelService = new ExcelServices(_context);
        }


        // Genera un archivo Excel con la estructura del modelo especificado.

        [HttpGet("modelexcel/{modelo}")]
        public IActionResult GenerarExcelModelo(string modelo)
        {
            return _excelService.GenerarExcelModelo(modelo);
        }

        /// Carga datos masivamente desde un archivo Excel y los guarda en la base de datos.
        [HttpPost("import/{modelo}")]
        public async Task<IActionResult> CargarMasivo(string modelo, IFormFile file)
        {
            var datos = await _excelService.CargarMasivoExcel(modelo, file);
            return Ok(new { message = $"{datos.Item1} registros cargados en {modelo} con éxito.", Error = datos.Item2 });
        }          
    } 
}
