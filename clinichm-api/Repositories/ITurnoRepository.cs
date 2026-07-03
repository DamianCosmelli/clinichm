using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface ITurnoRepository : IRepository<Turnos>
    {
        Task<IEnumerable<Turnos>> GetTurnosAusentesAsync();
      
        Task<List<Turnos>> GetTurnosAfectadosCambioAgendaDiaAsync(int medicoId, DateTime fechaInicio);
        Task<List<Turnos>> GetTurnosAfectadosCambioAgendaHoraAsync(int medicoId, DateTime fechaInicio, DateTime fechaFin);
        Task<IEnumerable<Turnos>> GetTurnosRangoFecha(DateTime fechaDesde, DateTime fechaHasta);
    }
}
