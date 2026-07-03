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

namespace clinichm_api.Services.Implements
{
    public class EmpleadoService : IEmpleadoService
    {
        private readonly IRepository<Empleado> _empleadoRepository;

         public EmpleadoService(IRepository<Empleado> repository)
        {
            _empleadoRepository = repository;
        }


        public async Task<IEnumerable<EmpleadoResponseDTO>> GetAllAsync()
        {
            try
            {
                var empleados = await _empleadoRepository.GetAllAsync();
                return empleados.Select(e => new EmpleadoResponseDTO 
                {
                    Id=e.Id,
                    Nombre=e.Nombre,
                    Apellido=e.Apellido,
                    DNI=e.DNI
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los empleados", ex);
            }
        }

        public async Task<EmpleadoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var empleado = await _empleadoRepository.GetByIdAsync(id);
                return empleado == null ? null : new EmpleadoResponseDTO 
                {
                    Id=empleado.Id,
                    Nombre=empleado.Nombre,
                    Apellido=empleado.Apellido,
                    DNI=empleado.DNI
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el empleado con ID {id}", ex);
            }
        }

        public async Task<EmpleadoResponseDTO> AddAsync(EmpleadoDTO empleadoDTO)
        {
            try
            {
                var empleado = new Empleado
                {
                    Nombre = empleadoDTO.Nombre,
                    Apellido = empleadoDTO.Apellido,
                    DNI=empleadoDTO.DNI
                };
                await _empleadoRepository.AddAsync(empleado);

                return new EmpleadoResponseDTO
                {
                    Id=empleado.Id,
                    Nombre=empleado.Nombre,
                    Apellido=empleado.Apellido,
                    DNI=empleado.DNI
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo empleado", ex);
            }
        }

        public async Task<EmpleadoResponseDTO> UpdateAsync(int id, EmpleadoDTO empleadoDTO)
        {
            try
            {
                var empleado = await _empleadoRepository.GetByIdAsync(id);
                if (empleado == null) return null!;
                empleado.Nombre = empleadoDTO.Nombre;
                empleado.Apellido= empleadoDTO.Apellido;
                empleado.DNI=empleadoDTO.DNI;
                await _empleadoRepository.UpdateAsync(empleado);
                return new EmpleadoResponseDTO {
                    Id=empleado.Id,
                    Nombre=empleado.Nombre,
                    Apellido=empleado.Apellido,
                    DNI=empleado.DNI
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el empleado con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var empleado = await _empleadoRepository.GetByIdAsync(id);
                if (empleado == null) return false;
                await _empleadoRepository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el empleado con ID {id}", ex);
            }
        }
    }
}
