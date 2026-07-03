using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class TratamientoServices : ITratamientoService
    {
        private readonly IRepository<Tratamientos> _repository;

        public TratamientoServices(IRepository<Tratamientos> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TratamientoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(t => new TratamientoResponseDTO
                {
                    Id = t.Id,
                    NombreTratamiento = t.NombreTratamiento,
                    Descripcion = t.Descripcion,
                    SucursalId = t.SucursalId,
                    PrecioEfectivo = t.PrecioEfectivo,
                    PrecioOtrosMediosDePago = t.PrecioOtrosMediosDePago,
                    Comision = t.Comision,
                    ComisionEncargado = t.ComisionEncargado,
                    ComisionEspecial = t.ComisionEspecial
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los tratamientos", ex);
            }
        }

        public async Task<TratamientoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var tratamiento = await _repository.GetByIdAsync(id);
                return tratamiento == null ? null : new TratamientoResponseDTO
                {
                    Id = tratamiento.Id,
                    NombreTratamiento = tratamiento.NombreTratamiento,
                    Descripcion = tratamiento.Descripcion,
                    SucursalId = tratamiento.SucursalId,
                    PrecioEfectivo = tratamiento.PrecioEfectivo,
                    PrecioOtrosMediosDePago = tratamiento.PrecioOtrosMediosDePago,
                    Comision = tratamiento.Comision,
                    ComisionEncargado = tratamiento.ComisionEncargado,
                    ComisionEspecial = tratamiento.ComisionEspecial
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el tratamiento con ID {id}", ex);
            }
        }

        public async Task<TratamientoResponseDTO> AddAsync(TratamientoDTO tratamientoDto)
        {
            try
            {
                var tratamiento = new Tratamientos
                {
                    NombreTratamiento = tratamientoDto.NombreTratamiento,
                    Descripcion = tratamientoDto.Descripcion,
                    SucursalId = tratamientoDto.SucursalId,
                    PrecioEfectivo = tratamientoDto.PrecioEfectivo,
                    PrecioOtrosMediosDePago = tratamientoDto.PrecioOtrosMediosDePago,
                    Comision = tratamientoDto.Comision,
                    ComisionEncargado = tratamientoDto.ComisionEncargado,
                    ComisionEspecial = tratamientoDto.ComisionEspecial
                };
                await _repository.AddAsync(tratamiento);

                return new TratamientoResponseDTO
                {
                    Id = tratamiento.Id,
                    NombreTratamiento = tratamiento.NombreTratamiento,
                    Descripcion = tratamiento.Descripcion,
                    SucursalId = tratamiento.SucursalId,
                    PrecioEfectivo = tratamiento.PrecioEfectivo,
                    PrecioOtrosMediosDePago = tratamiento.PrecioOtrosMediosDePago,
                    Comision = tratamiento.Comision,
                    ComisionEncargado = tratamiento.ComisionEncargado,
                    ComisionEspecial = tratamiento.ComisionEspecial
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo tratamiento", ex);
            }
        }

        public async Task<TratamientoResponseDTO> UpdateAsync(int id, TratamientoDTO tratamientoDto)
        {
            try
            {
                var tratamiento = await _repository.GetByIdAsync(id);
                if (tratamiento == null) return null!;
                tratamiento.NombreTratamiento = tratamientoDto.NombreTratamiento;
                tratamiento.Descripcion = tratamientoDto.Descripcion;
                tratamiento.SucursalId = tratamientoDto.SucursalId;
                tratamiento.PrecioEfectivo = tratamientoDto.PrecioEfectivo;
                tratamiento.PrecioOtrosMediosDePago = tratamientoDto.PrecioOtrosMediosDePago;
                tratamiento.Comision = tratamientoDto.Comision;
                tratamiento.ComisionEncargado = tratamientoDto.ComisionEncargado;
                tratamiento.ComisionEspecial = tratamientoDto.ComisionEspecial;
                await _repository.UpdateAsync(tratamiento);
                
                return new TratamientoResponseDTO
                {
                    Id = tratamiento.Id,
                    NombreTratamiento = tratamiento.NombreTratamiento,
                    Descripcion = tratamiento.Descripcion,
                    SucursalId = tratamiento.SucursalId,
                    PrecioEfectivo = tratamiento.PrecioEfectivo,
                    PrecioOtrosMediosDePago = tratamiento.PrecioOtrosMediosDePago,
                    Comision = tratamiento.Comision,
                    ComisionEncargado = tratamiento.ComisionEncargado,
                    ComisionEspecial = tratamiento.ComisionEspecial
                };       
                
             
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el tratamiento con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var tratamiento = await _repository.GetByIdAsync(id);
                if (tratamiento == null) return false;
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
                throw new Exception($"Error al eliminar el tratamiento con ID {id}", ex);
            }
        }
    }
}
