using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface ICierreCajaService
    {
        Task<IEnumerable<CierreCajaResponseDTO>> GetAllAsync();
        Task<CierreCajaResponseDTO?> GetByIdAsync(int id);
        Task<CierreCajaResponseDTO> AddAsync(CierreCajaDTO dto);
        Task<CierreCajaResponseDTO> UpdateAsync(int id, CierreCajaDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<CierreCajaResponseDTO> ProcesarCierreDiarioAsync(CierreCajaRequestDTO request);
        Task<CierreCajaMesResponseDTO> GetCierresDelMesAsync(int idSucursal, int month, int year);
        Task<CierreCajaReporteDTO> GetCierreInfoAsync(int idCierreCaja);
        Task<List<CierreCajaReporteDTO>> GetCierreXFechaAsync(DateOnly fechaCierre);
        Task<Boolean> ChangeMetodoPagoComision(int IdPagoComision);
    }
}
