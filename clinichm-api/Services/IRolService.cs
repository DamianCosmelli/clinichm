using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IRolService
    {
        Task<IEnumerable<RolResponseDTO>> GetAllAsync();
        Task<RolResponseDTO?> GetByIdAsync(int id);
        Task<RolResponseDTO?> AddAsync(RolDTO rolDTO);
        Task<RolResponseDTO> UpdateAsync(int id, RolDTO rolDTO);
        Task<bool> DeleteAsync(int id);
    }
}