using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IEstadoTurnoService
    {
        Task<IEnumerable<EstadoTurnoResponseDTO>> GetAllAsync();
        Task<EstadoTurnoResponseDTO?> GetByIdAsync(int id);
        Task<EstadoTurnoResponseDTO?> AddAsync(EstadoTurnoDTO estadoTurnoDto);
        Task<EstadoTurnoResponseDTO?> UpdateAsync(int id, EstadoTurnoDTO estadoTurnoDto);
        Task<bool> DeleteAsync(int id);
    }
}
