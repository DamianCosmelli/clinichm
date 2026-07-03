using clinichm_api.DTOs;
using clinichm_api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface IStockRepository : IRepository<Stock>
    {
       Task<string> DescontarStockAsync(int productoId, decimal cantidadADescontar, int sucursalId);
    }
}