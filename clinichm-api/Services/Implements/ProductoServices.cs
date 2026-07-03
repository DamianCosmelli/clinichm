using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;

namespace clinichm_api.Services
{
    public class ProductoService : IProductoService
    {
        private readonly IRepository<Producto> _repository;

        public ProductoService(IRepository<Producto> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductoDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(p => new ProductoDTO
                {
                    Id = p.Id,
                    CategoriaProdId = p.CategoriaProdId,
                    Nombre = p.Nombre,
                    NoAutoDescontable = p.NoAutoDescontable
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error al obtener los productos", ex);
            }
        }

        public async Task<ProductoDTO?> GetByIdAsync(int id)
        {
            try
            {
                var producto = await _repository.GetByIdAsync(id);
                return producto == null ? null : new ProductoDTO
                {
                    Id = producto.Id,
                    CategoriaProdId = producto.CategoriaProdId,
                    Nombre = producto.Nombre,
                    NoAutoDescontable = producto.NoAutoDescontable
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al obtener el producto con ID {id}", ex);
            }
        }

        public async Task<ProductoDTO?> AddAsync(ProductoDTO productoDto)
        {
            try
            {
                var producto = new Producto
                {
                    CategoriaProdId = productoDto.CategoriaProdId,
                    Nombre = productoDto.Nombre,
                    NoAutoDescontable = productoDto.NoAutoDescontable
                };
                await _repository.AddAsync(producto);
                return new ProductoDTO
                {
                    Id = producto.Id,
                    CategoriaProdId = producto.CategoriaProdId,
                    Nombre = producto.Nombre,
                    NoAutoDescontable = producto.NoAutoDescontable
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error al crear el producto", ex);
            }
        }

        public async Task<ProductoDTO> UpdateAsync(int id, ProductoDTO productoDto)
        {
            try
            {
                var producto = await _repository.GetByIdAsync(id);
                if (producto == null) throw new KeyNotFoundException("Producto no encontrado");

                producto.CategoriaProdId = productoDto.CategoriaProdId;
                producto.Nombre = productoDto.Nombre;
                producto.NoAutoDescontable = productoDto.NoAutoDescontable;

                await _repository.UpdateAsync(producto);

                return new ProductoDTO
                {
                    Id = producto.Id,
                    CategoriaProdId = producto.CategoriaProdId,
                    Nombre = producto.Nombre,
                    NoAutoDescontable = producto.NoAutoDescontable
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al actualizar el producto con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var producto = await _repository.GetByIdAsync(id);
                if (producto == null) return false;

                await _repository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al eliminar el producto con ID {id}", ex);
            }
        }
    }
}