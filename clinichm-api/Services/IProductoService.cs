using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IProductoService
    {
        Task<IEnumerable<ProductoDTO>> GetAllAsync();
        Task<ProductoDTO?> GetByIdAsync(int id);
        Task<ProductoDTO?> AddAsync(ProductoDTO productoDto);
        Task<ProductoDTO> UpdateAsync(int id, ProductoDTO productoDto);
        Task<bool> DeleteAsync(int id);
    }
}