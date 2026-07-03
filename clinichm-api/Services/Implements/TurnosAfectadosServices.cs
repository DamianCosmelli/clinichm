using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class TurnosAfectadosServices : ITurnosAfectadosService
    {
        private readonly IRepository<TurnosAfectados> _repository;

        public TurnosAfectadosServices(IRepository<TurnosAfectados> repository)
        {
            _repository = repository;
        }

        public async Task<TurnosAfectadosDTO> AddAsync(TurnosAfectadosReqDTO turnoAfectadoDto)
        {
            try
            {
                var turnoAfectado = new TurnosAfectados
                {
                    TurnoId = turnoAfectadoDto.TurnoId,
                    ConResolucion = turnoAfectadoDto.ConResolucion
                };

                await _repository.AddAsync(turnoAfectado);
                return new TurnosAfectadosDTO
                {
                    Id = turnoAfectado.Id,
                    TurnoId = turnoAfectado.TurnoId,
                    ConResolucion = turnoAfectado.ConResolucion
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los turnos afectados", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var turnoAfectado = await _repository.GetByIdAsync(id);
                if (turnoAfectado == null)
                {
                    return false; // No se encontró el turno afectado
                }

                await _repository.DeleteAsync(turnoAfectado.Id);
                return true; // Eliminación exitosa
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el turno afectado", ex);
            }
        }

        public async Task<IEnumerable<TurnosAfectadosDTO>> GetAllAsync()
        {
            try
            {
                var turnosAfectados = await _repository.GetAllAsync();
                return turnosAfectados.Select(e => new TurnosAfectadosDTO
                {
                    Id = e.Id,
                    TurnoId = e.TurnoId,
                    ConResolucion = e.ConResolucion
                }
                ).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los turnos afectados", ex);
            }
        }

        public async Task<TurnosAfectadosDTO?> GetByIdAsync(int id)
        {
            try
            {
                var turnoAfectado = await _repository.GetByIdAsync(id);
                if (turnoAfectado == null)
                {
                    return null; // No se encontró el turno afectado
                }

                return new TurnosAfectadosDTO
                {
                    Id = turnoAfectado.Id,
                    TurnoId = turnoAfectado.TurnoId,
                    ConResolucion = turnoAfectado.ConResolucion
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el turno afectado con ID {id}", ex);
            }
        }

        public async Task<TurnosAfectadosDTO> UpdateAsync(TurnosAfectadosReqDTO turnoAfectadoDto)
        {
            try
            {
                var turnoAfectado = await _repository.GetByIdAsync(turnoAfectadoDto.TurnoId);
                if (turnoAfectado == null)
                {
                    throw new Exception($"Turno afectado con ID {turnoAfectadoDto.TurnoId} no encontrado");
                }

                turnoAfectado.ConResolucion = turnoAfectadoDto.ConResolucion;

                await _repository.UpdateAsync(turnoAfectado);
                return new TurnosAfectadosDTO
                {
                    Id = turnoAfectado.Id,
                    TurnoId = turnoAfectado.TurnoId,
                    ConResolucion = turnoAfectado.ConResolucion
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar el turno afectado", ex);
            }
        }
    }
}
