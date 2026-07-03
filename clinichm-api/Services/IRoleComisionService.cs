using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IRoleComisionService
    {
        Task<IEnumerable<RoleComisionResponseDTO>> GetAllAsync();
        Task<RoleComisionResponseDTO?> GetByIdAsync(int id);
        Task<RoleComisionResponseDTO> AddAsync(RoleComisionDTO dto);
        Task<RoleComisionResponseDTO> UpdateAsync(int id, RoleComisionDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
