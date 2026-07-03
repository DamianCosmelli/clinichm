using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services.Implements
{
    public class MedicoTratamientoService : IMedicoTratamientoService
    {
        private readonly IRepository<MedicoTratamiento> _repository;

        public MedicoTratamientoService(IRepository<MedicoTratamiento> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MedicoTratamientoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(mt => new MedicoTratamientoResponseDTO
                {
                    Id = mt.Id,
                    MedicoId = mt.MedicoId,
                    TratamientoId = mt.TratamientoId
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener las especialidades por medico", ex);
            }
        }

        public async Task<MedicoTratamientoResponseDTO?> GetByIdAsync(int id)
        {
            try 
            {
                var medicoTratamiento = await _repository.GetByIdAsync(id);
                return medicoTratamiento == null ? null : new MedicoTratamientoResponseDTO
                {
                    Id = medicoTratamiento.Id,
                    MedicoId = medicoTratamiento.MedicoId,
                    TratamientoId = medicoTratamiento.TratamientoId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener relacion de medico y esoecialidad", ex);
            }
        }

        public async Task<MedicoTratamientoResponseDTO> AddAsync(MedicoTratamientoDTO dto)
        {
            try
            {
                var medicoTratamiento = new MedicoTratamiento
                {
                    MedicoId = dto.MedicoId,
                    TratamientoId = dto.TratamientoId
                };
                await _repository.AddAsync(medicoTratamiento);

                return new MedicoTratamientoResponseDTO
                {
                    Id = medicoTratamiento.Id,
                    MedicoId = medicoTratamiento.MedicoId,
                    TratamientoId = medicoTratamiento.TratamientoId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar especialidad a medico", ex);
            }
        }

        public async Task<MedicoTratamientoResponseDTO> UpdateAsync(int id, MedicoTratamientoDTO dto)
        {
            try
            {
                var medicoTratamiento = await _repository.GetByIdAsync(id);
                if (medicoTratamiento == null) return null!;
                medicoTratamiento.MedicoId = dto.MedicoId;
                medicoTratamiento.TratamientoId = dto.TratamientoId;
                await _repository.UpdateAsync(medicoTratamiento);
                return new MedicoTratamientoResponseDTO
                {
                    Id = medicoTratamiento.Id,
                    MedicoId = medicoTratamiento.MedicoId,
                    TratamientoId = medicoTratamiento.TratamientoId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al actualizar especialidad a medico", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var medicoTratamiento = await _repository.GetByIdAsync(id);
                if (medicoTratamiento == null) return false;
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
                throw new Exception("Error al eliminar registro", ex);
            }
        }
    }
}
