using clinichm_api.DTOs;
using clinichm_api.Models;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface IAgendaMedicaRepository : IRepository<AgendaMedica>
    {
        Task<IEnumerable<AgendaMedica>> GetAgendaMedicaFehaRangoAsync(DateTime fechaInicio, DateTime fechaFin);
    }
}