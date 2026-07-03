using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IPagoDeComisionesService
    {
        Task<IEnumerable<PagoDeComisionesResponseDTO>> GetAllAsync();
        Task<PagoDeComisionesResponseDTO?> GetByIdAsync(int id);
        Task<PagoDeComisionesResponseDTO> AddAsync(PagoDeComisionesDTO dto);
        Task<PagoDeComisionesResponseDTO> UpdateAsync(int id, PagoDeComisionesDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<PagoDeComisionesResponseDTO>> GetByIdCajaAsync(int id);
    }
}
