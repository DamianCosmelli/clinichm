using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface ITratamientoService
    {
        Task<IEnumerable<TratamientoResponseDTO>> GetAllAsync();
        Task<TratamientoResponseDTO?> GetByIdAsync(int id);
        Task<TratamientoResponseDTO> AddAsync(TratamientoDTO tratamientoDto);
        Task<TratamientoResponseDTO> UpdateAsync(int id, TratamientoDTO tratamientoDto);
        Task<bool> DeleteAsync(int id);
    }
}
