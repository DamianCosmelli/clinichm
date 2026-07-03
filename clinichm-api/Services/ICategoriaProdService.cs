using clinichm_api.DTOs;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface ICategoriaProdService
    {
        Task<IEnumerable<CategoriaProdDTO>> GetAllAsync();
        Task<CategoriaProdDTO?> GetByIdAsync(int id);
        Task<CategoriaProdDTO?> AddAsync(CategoriaProdReqDTO categoriaDTO);
        Task<CategoriaProdDTO> UpdateAsync(int id, CategoriaProdReqDTO categoriaDTO);
        Task<bool> DeleteAsync(int id);
    }
}