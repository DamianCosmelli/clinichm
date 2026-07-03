using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IMedicoTratamientoService
    {
        Task<IEnumerable<MedicoTratamientoResponseDTO>> GetAllAsync();
        Task<MedicoTratamientoResponseDTO?> GetByIdAsync(int id);
        Task<MedicoTratamientoResponseDTO> AddAsync(MedicoTratamientoDTO dto);
        Task<MedicoTratamientoResponseDTO> UpdateAsync(int id, MedicoTratamientoDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
