using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public class TurnoRepository : Repository<Turnos>, ITurnoRepository
    {
        private readonly AppDbContext _context;

        public TurnoRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Turnos>> GetTurnosAusentesAsync()
        {
            var today = DateTime.Today;
            var reportTime = new DateTime(today.Year, today.Month, today.Day, 18, 0, 0);

            return await _context.Turnos
                .Where(t => t.Asistio == false && t.FechaHora.Date == today && t.FechaHora <= reportTime)
                .ToListAsync();
        }

        // Consulta los turnos afectados por un cambio de agenda en un día específico
        public Task<List<Turnos>> GetTurnosAfectadosCambioAgendaDiaAsync(int medicoId, DateTime fechaInicio)
        {
            var fecha = fechaInicio.Date;

            return _context.Turnos
                .Where(t =>
                    t.MedicoId == medicoId &&
                    t.FechaHora.Date == fecha
                ).ToListAsync();
        }

        public Task<List<Turnos>> GetTurnosAfectadosCambioAgendaHoraAsync(int medicoId, DateTime fechaInicio, DateTime fechaFin)
        {
            var fecha = fechaInicio.Date;

            var horaInicio = fechaInicio.TimeOfDay;
            var horaFin = fechaFin.TimeOfDay;

            var turnosAfec = _context.Turnos
                .Where(t =>
                    t.MedicoId == medicoId &&
                    t.FechaHora.Date == fecha &&
                 (t.FechaHora.TimeOfDay < horaInicio || t.FechaHora.TimeOfDay > horaFin))
                .ToListAsync();

            return turnosAfec;
        }



        public async Task<IEnumerable<Turnos>> GetTurnosRangoFecha(DateTime fechaDesde, DateTime fechaHasta)
        {
            return await _context.Turnos
                .Where(t => t.FechaHora.Date >= fechaDesde.Date && t.FechaHora.Date < fechaHasta.Date)
                .ToListAsync();
        }
    }
}