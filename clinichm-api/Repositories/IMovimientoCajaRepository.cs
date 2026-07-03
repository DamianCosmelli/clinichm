using clinichm_api.DTOs;
using clinichm_api.Models;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public interface IMovimientoCajaRepository : IRepository<MovimientoCaja>
    {
        Task<MovimientosYComisionesDTO> GetMovimientosYComisionesHoy(int sucursal);
    }
}