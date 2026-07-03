using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services.Implements
{
    public class PagoDeComisionesService : IPagoDeComisionesService
    {
        private readonly IRepository<PagoDeComisiones> _repository;

        public PagoDeComisionesService(IRepository<PagoDeComisiones> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PagoDeComisionesResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(p => new PagoDeComisionesResponseDTO
                {
                    Id = p.Id,
                    MedicoId = p.MedicoId,
                    FechaDePago = p.FechaDePago,
                    MetodoDePago = p.MetodoDePago,
                    Monto = p.Monto,
                    CierreDeCajaId = p.CierreDeCajaId
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los pagos de comisiones", ex);
            }
        }

        public async Task<PagoDeComisionesResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var pagoDeComisiones = await _repository.GetByIdAsync(id);
                return pagoDeComisiones == null ? null : new PagoDeComisionesResponseDTO
                {
                    Id = pagoDeComisiones.Id,
                    MedicoId = pagoDeComisiones.MedicoId,
                    FechaDePago = pagoDeComisiones.FechaDePago,
                    MetodoDePago = pagoDeComisiones.MetodoDePago,
                    Monto = pagoDeComisiones.Monto,
                    CierreDeCajaId = pagoDeComisiones.CierreDeCajaId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el pago de comisiones con ID {id}", ex);
            }
        }

        public async Task<PagoDeComisionesResponseDTO> AddAsync(PagoDeComisionesDTO dto)
        {
            try
            {
                var pagoDeComisiones = new PagoDeComisiones
                {
                    MedicoId = dto.MedicoId,
                    FechaDePago = dto.FechaDePago,
                    MetodoDePago = dto.MetodoDePago,
                    Monto = dto.Monto,
                    CierreDeCajaId = dto.CierreDeCajaId
                };
                await _repository.AddAsync(pagoDeComisiones);

                return new PagoDeComisionesResponseDTO
                {
                    Id = pagoDeComisiones.Id,
                    MedicoId = pagoDeComisiones.MedicoId,
                    FechaDePago = pagoDeComisiones.FechaDePago,
                    MetodoDePago = pagoDeComisiones.MetodoDePago,
                    Monto = pagoDeComisiones.Monto,
                    CierreDeCajaId = pagoDeComisiones.CierreDeCajaId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo pago de comisiones", ex);
            }
        }

        public async Task<PagoDeComisionesResponseDTO> UpdateAsync(int id, PagoDeComisionesDTO dto)
        {
            try
            {
                var pagoDeComisiones = await _repository.GetByIdAsync(id);
                if (pagoDeComisiones == null) return null!;
                pagoDeComisiones.MedicoId = dto.MedicoId;
                pagoDeComisiones.FechaDePago = dto.FechaDePago;
                pagoDeComisiones.MetodoDePago = dto.MetodoDePago;
                pagoDeComisiones.Monto = dto.Monto;
                pagoDeComisiones.CierreDeCajaId = dto.CierreDeCajaId;
                await _repository.UpdateAsync(pagoDeComisiones);
                return new PagoDeComisionesResponseDTO
                {
                    Id = pagoDeComisiones.Id,
                    MedicoId = pagoDeComisiones.MedicoId,
                    FechaDePago = pagoDeComisiones.FechaDePago,
                    MetodoDePago = pagoDeComisiones.MetodoDePago,
                    Monto = pagoDeComisiones.Monto,
                    CierreDeCajaId = pagoDeComisiones.CierreDeCajaId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el pago de comisiones con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var pagoDeComisiones = await _repository.GetByIdAsync(id);
                if (pagoDeComisiones == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el pago de comisiones con ID {id}", ex);
            }
        }

        public Task<IEnumerable<PagoDeComisionesResponseDTO>> GetByIdCajaAsync(int id)
        {
            try
            { 
                return Task.FromResult((IEnumerable<PagoDeComisionesResponseDTO>)_repository.GetAllAsync()
                    .Result.Where(p => p.CierreDeCajaId == id)
                    .Select(p => new PagoDeComisionesResponseDTO
                    {
                        Id = p.Id,
                        MedicoId = p.MedicoId,
                        FechaDePago = p.FechaDePago,
                        MetodoDePago = p.MetodoDePago,
                        Monto = p.Monto,
                        CierreDeCajaId = p.CierreDeCajaId
                    }).ToList());
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los pagos de comisiones para la caja con ID {id}", ex);
            }          
                
        }
    }
}
