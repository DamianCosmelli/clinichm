using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class SucursalServices : ISucursalService
    {
        private readonly IRepository<Sucursales> _repository;

        public SucursalServices(IRepository<Sucursales> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SucursalResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(s => new SucursalResponseDTO
                {
                    Id=s.Id,
                    Nombre = s.Nombre,
                    Direccion=s.Direccion,
                    Ciudad=s.Ciudad,
                    CodigoPostal=s.CodigoPostal
                    
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todas las sucursales", ex);
            }
        }

        public async Task<SucursalResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var sucursal = await _repository.GetByIdAsync(id);
                return sucursal == null ? null : new SucursalResponseDTO
                {
                    Id=sucursal.Id,
                    Nombre = sucursal.Nombre,
                    Direccion=sucursal.Direccion,
                    Ciudad=sucursal.Ciudad,
                    CodigoPostal=sucursal.CodigoPostal                    
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener la sucursal con ID {id}", ex);
            }
        }

        public async Task<SucursalResponseDTO> AddAsync(SucursalDTO sucursalDto)
        {
            try
            {
                var sucursal = new Sucursales
                {
                    Nombre = sucursalDto.Nombre,
                    Direccion=sucursalDto.Direccion,
                    Ciudad=sucursalDto.Ciudad,
                    CodigoPostal=sucursalDto.CodigoPostal
                    
                };
                await _repository.AddAsync(sucursal);

                return new SucursalResponseDTO 
                {
                    Id=sucursal.Id,
                    Nombre = sucursal.Nombre,
                    Direccion=sucursal.Direccion,
                    Ciudad=sucursal.Ciudad,
                    CodigoPostal=sucursal.CodigoPostal
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar una nueva sucursal", ex);
            }
        }

        public async Task<SucursalResponseDTO> UpdateAsync(int id, SucursalDTO sucursalDto)
        {
            try
            {
                var sucursal = await _repository.GetByIdAsync(id);
                if (sucursal == null) return null!;
                sucursal.Nombre = sucursalDto.Nombre;
                sucursal.Direccion=sucursalDto.Direccion;
                sucursal.Ciudad=sucursalDto.Ciudad;
                sucursal.CodigoPostal=sucursalDto.CodigoPostal;
        
                await _repository.UpdateAsync(sucursal);
                return new SucursalResponseDTO 
                {
                    Id=sucursal.Id,
                    Nombre = sucursal.Nombre,
                    Direccion=sucursal.Direccion,
                    Ciudad=sucursal.Ciudad,
                    CodigoPostal=sucursal.CodigoPostal
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar la sucursal con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var sucursal = await _repository.GetByIdAsync(id);
                if (sucursal == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al eliminar la sucursal con ID {id}", ex);
            }
        }
    }
}
