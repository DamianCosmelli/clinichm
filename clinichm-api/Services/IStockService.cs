using clinichm_api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface IStockService
    {
        Task<IEnumerable<StockResponseDTO>> GetAllAsync();
        Task<StockResponseDTO?> GetByIdAsync(int id);
        Task<StockResponseDTO> AddAsync(StockDTO stockDTO);
        Task<StockResponseDTO> UpdateAsync(int id, StockDTO stockDTO);
        Task<bool> DeleteAsync(int id);
    }
}
