

using System.Collections.Generic;
using clinichm_api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace clinichm_api.Services
{
    public interface IExcelService
    {
        FileContentResult GenerarExcelModelo(string modelo);
        Task<(int, List<object>)> CargarMasivoExcel(string modelo, IFormFile file);
        FileContentResult GenerarExcelReporteCierre(CierreCajaReporteDTO reporte);
        FileContentResult GenerarExcelReporteCierreCentral(List<CierreCajaReporteDTO> reportes);
        FileContentResult GenerarExcelReporteStock(IEnumerable<StockResponseDTO> stock);

        FileContentResult GenerarExcelMovientosYcomisiones(MovimientosYComisionesDTO movYcom);
    }
}