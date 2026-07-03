using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface ITurnosAfectadosService
    {
        Task<IEnumerable<TurnosAfectadosDTO>> GetAllAsync();
        Task<TurnosAfectadosDTO?> GetByIdAsync(int id);
        Task<TurnosAfectadosDTO> AddAsync(TurnosAfectadosReqDTO turnoAfectadoDto);
        Task<TurnosAfectadosDTO> UpdateAsync(TurnosAfectadosReqDTO turnoAfectadoDto);
        Task<bool> DeleteAsync(int id);
       
    }
}