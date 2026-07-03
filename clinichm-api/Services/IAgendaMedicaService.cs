using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IAgendaMedicaService
    {
        Task<IEnumerable<AgendaMedicaResponseDTO>> GetAllAsync();
        Task<AgendaMedicaResponseDTO?> GetByIdAsync(int id);
        Task<AgendaMedicaResponseDTO?> AddAsync(AgendaMedicaDTO agendaMedicaDto);
        Task<AgendaMedicaResponseDTO?> UpdateAsync(int id, AgendaMedicaDTO agendaMedicaDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<AgendaMedicaResponseXCalendarDTO>> GetAgendaMedicaFehaRangoAsync(DateTime fechaInicio, DateTime fechaFin);
        Task<IEnumerable<AgendaMedicaResponseDTO>> GetAgendaMedicaFehaRangoHoraYSucAsync(DateTime fechaInicio, 
        DateTime fechaFin,int hora, int sucursalId);
    }
}
