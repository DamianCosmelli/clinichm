using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IMovimientoCajaService
    {
        Task<IEnumerable<MovimientoCajaResponseDTO>> GetAllAsync();
        Task<MovimientoCajaResponseDTO?> GetByIdAsync(int id);
        Task<MovimientoCajaResponseDTO> AddAsync(MovimientoCajaDTO movimientoCajaDto);
        Task<MovimientoCajaResponseDTO> UpdateAsync(int id, MovimientoCajaDTO movimientoCajaDto);
        Task<bool> DeleteAsync(int id);
        Task<MovimientosYComisionesDTO> MovimientosyComisiones(int sucursal);
    }
}
