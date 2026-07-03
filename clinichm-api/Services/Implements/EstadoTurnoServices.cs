using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class EstadoTurnoServices : IEstadoTurnoService
    {
        private readonly IRepository<EstadosTurnos> _repository;

        public EstadoTurnoServices(IRepository<EstadosTurnos> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EstadoTurnoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(e => new EstadoTurnoResponseDTO
                {
                    Id=e.Id,
                    Estado = e.Estado,
                    Descripcion = e.Descripcion,
                    Color = e.Color
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los estados de turno", ex);
            }
        }

        public async Task<EstadoTurnoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var estadoTurno = await _repository.GetByIdAsync(id);
                return estadoTurno == null ? null : new EstadoTurnoResponseDTO
                {
                    Id=estadoTurno.Id,
                    Estado = estadoTurno.Estado,
                    Descripcion = estadoTurno.Descripcion,
                    Color = estadoTurno.Color
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el estado de turno con ID {id}", ex);
            }
        }

        public async Task<EstadoTurnoResponseDTO?> AddAsync(EstadoTurnoDTO estadoTurnoDto)
        {
            try
            {
                var estadoTurno = new EstadosTurnos
                {
                    Estado = estadoTurnoDto.Estado,
                    Descripcion = estadoTurnoDto.Descripcion,
                    Color = estadoTurnoDto.Color
                };
                await _repository.AddAsync(estadoTurno);

                return new EstadoTurnoResponseDTO
                {
                    Id=estadoTurno.Id,
                    Estado=estadoTurno.Estado,
                    Descripcion=estadoTurno.Descripcion,
                    Color=estadoTurno.Color
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo estado de turno", ex);
            }
        }

        public async Task<EstadoTurnoResponseDTO?> UpdateAsync(int id, EstadoTurnoDTO estadoTurnoDto)
        {
            try
            {
                var estadoTurno = await _repository.GetByIdAsync(id);
                if (estadoTurno == null) return null!;
                estadoTurno.Estado = estadoTurnoDto.Estado;
                estadoTurno.Descripcion = estadoTurnoDto.Descripcion;
                estadoTurno.Color = estadoTurnoDto.Color;
                await _repository.UpdateAsync(estadoTurno);
                return new EstadoTurnoResponseDTO
                {
                    Id=estadoTurno.Id,
                    Estado=estadoTurno.Estado,
                    Descripcion=estadoTurno.Descripcion,
                    Color=estadoTurno.Color
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el estado de turno con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var estadoTurno = await _repository.GetByIdAsync(id);
                if (estadoTurno == null) return false;
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
                throw new Exception($"Error al eliminar el estado de turno con ID {id}", ex);
            }
        }
    }
}
