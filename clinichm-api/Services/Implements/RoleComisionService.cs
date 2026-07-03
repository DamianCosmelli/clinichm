using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services.Implements
{
    public class RoleComisionService : IRoleComisionService
    {
        private readonly IRepository<RoleComision> _repository;

        public RoleComisionService(IRepository<RoleComision> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RoleComisionResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(r => new RoleComisionResponseDTO
                {
                    Id = r.Id,
                    Role = r.Role
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los roles de comisión", ex);
            }
        }

        public async Task<RoleComisionResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var roleComision = await _repository.GetByIdAsync(id);
                return roleComision == null ? null : new RoleComisionResponseDTO
                {
                    Id = roleComision.Id,
                    Role = roleComision.Role
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el rol de comisión con ID {id}", ex);
            }
        }

        public async Task<RoleComisionResponseDTO> AddAsync(RoleComisionDTO dto)
        {
            try
            {
                var roleComision = new RoleComision
                {
                    Role = dto.Role
                };
                await _repository.AddAsync(roleComision);

                return new RoleComisionResponseDTO
                {
                    Id = roleComision.Id,
                    Role = roleComision.Role
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo rol de comisión", ex);
            }
        }

        public async Task<RoleComisionResponseDTO> UpdateAsync(int id, RoleComisionDTO dto)
        {
            try
            {
                var roleComision = await _repository.GetByIdAsync(id);
                if (roleComision == null) return null!;
                roleComision.Role = dto.Role;
                await _repository.UpdateAsync(roleComision);
                return new RoleComisionResponseDTO
                {
                    Id = roleComision.Id,
                    Role = roleComision.Role
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el rol de comisión con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var roleComision = await _repository.GetByIdAsync(id);
                if (roleComision == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el rol de comisión con ID {id}", ex);
            }
        }
    }
}
