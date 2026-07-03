using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class MedicoService : IMedicoService
    {
        private readonly IRepository<Medicos> _repository;

        public MedicoService(IRepository<Medicos> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MedicoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(m => new MedicoResponseDTO
                {
                    Id = m.Id,
                    Nombre = m.Nombre,
                    Apellido = m.Apellido,
                    Matricula = m.Matricula,
                    SucursalId = m.SucursalId,
                    RoleId = m.RoleId                
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los médicos", ex);
            }
        }

        public async Task<MedicoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var medico = await _repository.GetByIdAsync(id);
                return medico == null ? null : new MedicoResponseDTO
                {
                    Id = medico.Id,
                    Nombre = medico.Nombre,
                    Apellido = medico.Apellido,
                    Matricula = medico.Matricula,
                    SucursalId = medico.SucursalId,
                    RoleId = medico.RoleId
                    
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el médico con ID {id}", ex);
            }
        }

        public async Task<MedicoResponseDTO?> AddAsync(MedicoDTO medicoDto)
        {
            try
            {
                var medico = new Medicos
                {
                    Nombre = medicoDto.Nombre,
                    Apellido = medicoDto.Apellido,
                    Matricula = medicoDto.Matricula,
                    SucursalId = medicoDto.SucursalId,
                    RoleId = medicoDto.RoleId
                };
                await _repository.AddAsync(medico);

                return new MedicoResponseDTO
                {
                    Id = medico.Id,
                    Nombre = medico.Nombre,
                    Apellido = medico.Apellido,
                    Matricula = medico.Matricula,
                    SucursalId = medico.SucursalId,
                    RoleId = medico.RoleId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo médico", ex);
            }
        }

        public async Task<MedicoResponseDTO?> UpdateAsync(int id, MedicoDTO medicoDto)
        {
            try
            {
                var medico = await _repository.GetByIdAsync(id);
                if (medico == null) return null!;
                medico.Nombre = medicoDto.Nombre;
                medico.Apellido = medicoDto.Apellido;
                medico.Matricula = medicoDto.Matricula;
                medico.SucursalId = medicoDto.SucursalId;
                medico.RoleId = medicoDto.RoleId;
                await _repository.UpdateAsync(medico);
                return new MedicoResponseDTO
                {
                    Id = medico.Id,
                    Nombre = medico.Nombre,
                    Apellido = medico.Apellido,
                    Matricula = medico.Matricula,
                    SucursalId = medico.SucursalId,
                    RoleId = medico.RoleId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el médico con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var medico = await _repository.GetByIdAsync(id);
                if (medico == null) return false;
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
                throw new Exception($"Error al eliminar el médico con ID {id}", ex);
            }
        }
    }
}
