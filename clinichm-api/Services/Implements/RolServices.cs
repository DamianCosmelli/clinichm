using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class RolServices : IRolService
    {
        private readonly IRepository<Rol> _repository;

        public RolServices(IRepository<Rol> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RolResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(m => new RolResponseDTO
                {
                    Id=m.Id,
                    Nombre = m.Nombre,
                    Descripcion = m.Descripcion
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los roles", ex);
            }
        }

        public async Task<RolResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var Rol = await _repository.GetByIdAsync(id);
                return Rol == null ? null : new RolResponseDTO
                {
                    Id=Rol.Id,
                    Nombre = Rol.Nombre,
                    Descripcion = Rol.Descripcion
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el rol con ID {id}", ex);
            }
        }

        public async Task<RolResponseDTO?> AddAsync(RolDTO RolDto)
        {
            try
            {
                var Rol = new Rol
                {
                    Nombre = RolDto.Nombre,
                    Descripcion = RolDto.Descripcion
                };
                await _repository.AddAsync(Rol);

            return new RolResponseDTO
            {
                Id = Rol.Id,
                Nombre = Rol.Nombre,
                Descripcion = Rol.Descripcion
            };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo rol", ex);
            }
        }

        public async Task<RolResponseDTO> UpdateAsync(int id, RolDTO RolDto)
        {
            try
            {
                var Rol = await _repository.GetByIdAsync(id);
                if (Rol == null) return null!;
                Rol.Nombre = RolDto.Nombre;
                Rol.Descripcion = RolDto.Descripcion;
                await _repository.UpdateAsync(Rol);

                return new RolResponseDTO
                {
                    Id = Rol.Id,
                    Nombre = Rol.Nombre,
                    Descripcion = Rol.Descripcion
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el rol con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var Rol = await _repository.GetByIdAsync(id);
                if (Rol == null) return false;
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
                throw new Exception($"Error al eliminar el rol con ID {id}", ex);
            }
        }
    }
}
