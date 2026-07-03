using clinichm_api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface IPacienteService
    {
        Task<IEnumerable<PacienteResponseDTO>> GetAllAsync();
        Task<PacienteResponseDTO?> GetByIdAsync(int id);
        Task<PacienteResponseDTO> AddAsync(PacienteDTO pacienteDto);
        Task<PacienteResponseDTO> UpdateAsync(int id, PacienteDTO pacienteDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<PacientesPorMedicoDTO>> GetPacientesPorMedicoAsync();
        Task<PacienteResponseDTO?> GetByDNIAsync(string dni);
        Task<IEnumerable<PacienteResponseDTO>> GetPacientesSoloConsultoAsync();
        Task<IEnumerable<PacienteUltVisitaRespDTO>> GetPacientesSinVisitaEnUltimosMesesAsync(int meses = 1);
    }
}
