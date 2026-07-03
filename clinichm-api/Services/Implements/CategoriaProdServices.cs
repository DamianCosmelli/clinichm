using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;

namespace clinichm_api.Services
{
    public class CategoriaProdService : ICategoriaProdService
    {
        private readonly IRepository<CategoriaProd> _repository;

        public CategoriaProdService(IRepository<CategoriaProd> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CategoriaProdDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(c => new CategoriaProdDTO
                {
                    Id = c.Id,
                    Nombre = c.Nombre
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas las categorías", ex);
            }
        }

        public async Task<CategoriaProdDTO?> GetByIdAsync(int id)
        {
            try
            {
                var categoria = await _repository.GetByIdAsync(id);
                return categoria == null ? null : new CategoriaProdDTO
                {
                    Id = categoria.Id,
                    Nombre = categoria.Nombre
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener la categoría con ID {id}", ex);
            }
        }

        public async Task<CategoriaProdDTO?> AddAsync(CategoriaProdReqDTO categoriaDTO)
        {
            try
            {
                var categoria = new CategoriaProd
                {
                    Nombre = categoriaDTO.Nombre
                };
                await _repository.AddAsync(categoria);
                return new CategoriaProdDTO
                {
                    Id = categoria.Id,
                    Nombre = categoria.Nombre
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar una nueva categoría", ex);
            }
        }

        public async Task<CategoriaProdDTO> UpdateAsync(int id, CategoriaProdReqDTO categoriaDTO)
        {
            try
            {
                var categoria = await _repository.GetByIdAsync(id);
                if (categoria == null) throw new Exception($"Categoría con ID {id} no encontrada");

                categoria.Nombre = categoriaDTO.Nombre;
                await _repository.UpdateAsync(categoria);

                return new CategoriaProdDTO
                {
                    Id = categoria.Id,
                    Nombre = categoria.Nombre
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar la categoría con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var categoria = await _repository.GetByIdAsync(id);
                if (categoria == null) return false;

                await _repository.DeleteAsync(id);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar la categoría con ID {id}", ex);
            }
        }
    }
}