using clinichm_api.DTOs;
using clinichm_api.Models;
using DocumentFormat.OpenXml.Office2010.Excel;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface ICierreCajaRepository : IRepository<CierreCaja>
    {
        Task<CierreCajaResponseDTO> ProcesarCierreDiarioAsync(CierreCajaRequestDTO request);
        Task<CierreCajaMesResponseDTO> GetCierresDelMesAsync(int idSucursal, int month, int year);
        Task<CierreCajaReporteDTO> GetCierreInfoAsync(int idCierreCaja);
        Task<List<CierreCajaReporteDTO>> GetCierreXFechaAsync(DateOnly fechaCierre);
        Task<Boolean> ChangeMetodoPagoComision(int IdPagoComision);
    }
}
