using clinichm_api.DTOs;
using clinichm_api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface IPacienteRepository : IRepository<Pacientes>
    {
        Task<IEnumerable<PacientesPorMedicoDTO>> GetPacientesPorMedicoAsync();
        Task<PacienteResponseDTO?> GetByDNIAsync(string dni);
        Task<IEnumerable<PacienteResponseDTO>> GetPacientesSoloConsultoAsync();
        Task<IEnumerable<PacienteUltVisitaRespDTO>> GetPacientesSinVisitaEnUltimosMesesAsync(int meses = 1);
    }
}
