using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface ISucursalService
    {
        Task<IEnumerable<SucursalResponseDTO>> GetAllAsync();
        Task<SucursalResponseDTO?> GetByIdAsync(int id);
        Task<SucursalResponseDTO> AddAsync(SucursalDTO sucursalDto);
        Task<SucursalResponseDTO> UpdateAsync(int id, SucursalDTO sucursalDto);
        Task<bool> DeleteAsync(int id);
    }
}
