using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace clinichm_api.Services.Implements
{
    public class AuditStockService : IAuditStockService
    {
        private readonly IRepository<AuditStock> _auditStockRepository;

        public AuditStockService(IRepository<AuditStock> repository)
        {
            _auditStockRepository = repository;
        }

        public async Task<IEnumerable<AuditStockResponseDTO>> GetAllAsync()
        {
            var audits = await _auditStockRepository.GetAllAsync();
            return audits.Select(a => new AuditStockResponseDTO
            {
                Id = a.Id,
                Fecha = a.Fecha,
                IdRegistro = a.IdRegistro,
                CantPrevia = a.CantPrevia,
                CantNueva = a.CantNueva,
                TipoMovimiento = a.TipoMovimiento,
                UsuarioId = a.UsuarioId
            }).ToList();
        }
    }
}
