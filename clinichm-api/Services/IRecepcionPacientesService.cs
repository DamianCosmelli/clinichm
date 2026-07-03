using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IRecepcionPacientesService
    {
        Task<IEnumerable<RecepcionPacientesResponseDTO>> GetAllAsync();
        Task<RecepcionPacientesResponseDTO?> GetByIdAsync(int id);
        Task<RecepcionPacientesResponseDTO> AddAsync(RecepcionPacientesDTO dto);
        Task<RecepcionPacientesResponseDTO> UpdateAsync(int id, RecepcionPacientesDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<RecepcionCalendarResponseDTO>> GetRecepcionXFecha(DateTime fecha);
        Task<IEnumerable<RecepcionCalendarResponseDTO>> GetRecepcionXPacienteId(int pacienteId);
    }
}
