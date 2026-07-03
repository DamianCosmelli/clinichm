using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface ITurnoService
    {
        Task<IEnumerable<TurnoResponseDTO>> GetAllAsync();
        Task<TurnoResponseDTO?> GetByIdAsync(int id);
        Task<TurnoResponseDTO> AddAsync(TurnoDTO turnoDto);
        Task<TurnoResponseDTO> UpdateAsync(int id, TurnoDTO turnoDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<TurnoDuplicadoDTO>> GetTurnosDuplicadosAsync(int pacienteId);
        Task<IEnumerable<TurnoResponseDTO>> GetTurnosAusentesAsync();
        Task<IEnumerable<TurnoResponseXCalendarDTO>> GetTurnosAfectadosPorCambioAgendaAsync();
        Task<IEnumerable<TurnoResponseXCalendarDTO>> GetTurnosRangoFecha(DateTime fechaDesde, DateTime fechaHasta);
        Task<bool> UpdateConResolucionTurnoAfectadoAsync(int turnoId);
    }
}
