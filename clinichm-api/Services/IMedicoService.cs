using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IMedicoService
    {
        Task<IEnumerable<MedicoResponseDTO>> GetAllAsync();
        Task<MedicoResponseDTO?> GetByIdAsync(int id);
        Task<MedicoResponseDTO?> AddAsync(MedicoDTO medicoDto);
        Task<MedicoResponseDTO?> UpdateAsync(int id, MedicoDTO medicoDto);
        Task<bool> DeleteAsync(int id);
    }
}
