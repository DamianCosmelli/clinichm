using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.AspNetCore.Http.HttpResults;

namespace clinichm_api.Repositories
{
    public class AgendaMedicaRepository : Repository<AgendaMedica>, IAgendaMedicaRepository
    {
        private readonly AppDbContext _context;

        public AgendaMedicaRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AgendaMedica>> GetAgendaMedicaFehaRangoAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _context.AgendaMedica
                .Where(a => a.FechaInicio >= fechaInicio && a.FechaFin <= fechaFin)
                .ToListAsync(); 
        }
    }
}