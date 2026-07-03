using clinichm_api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface IAuditStockService
    {
        Task<IEnumerable<AuditStockResponseDTO>> GetAllAsync();
    }
}
