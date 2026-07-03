using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services.Implements
{
    public class MedioDePagoService : IMedioDePagoService
    {
        private readonly IRepository<MedioDePago> _repository;

        public MedioDePagoService(IRepository<MedioDePago> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MedioDePagoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(m => new MedioDePagoResponseDTO
                {
                    Id = m.Id,
                    MedioPago = m.MedioPago
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los medios de pago", ex);
            }
        }

        public async Task<MedioDePagoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var medioDePago = await _repository.GetByIdAsync(id);
                return medioDePago == null ? null : new MedioDePagoResponseDTO
                {
                    Id = medioDePago.Id,
                    MedioPago = medioDePago.MedioPago
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el medio de pago con ID {id}", ex);
            }
        }

        public async Task <MedioDePagoResponseDTO> AddAsync(MedioDePagoDTO dto)
        {
            try
            {
                var medioDePago = new MedioDePago
                {
                    MedioPago = dto.MedioPago
                };
                await _repository.AddAsync(medioDePago);

                return new MedioDePagoResponseDTO
                {
                    Id = medioDePago.Id,
                    MedioPago = medioDePago.MedioPago  
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo medio de pago", ex);
            }
        }

        public async Task<MedioDePagoResponseDTO> UpdateAsync(int id, MedioDePagoDTO dto)
        {
            try
            {
                var medioDePago = await _repository.GetByIdAsync(id);
                if (medioDePago == null) return null!;
                medioDePago.MedioPago = dto.MedioPago;
                await _repository.UpdateAsync(medioDePago);
                return new MedioDePagoResponseDTO
                {
                    Id = medioDePago.Id,
                    MedioPago = medioDePago.MedioPago
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el medio de pago con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var medioDePago = await _repository.GetByIdAsync(id);
                if (medioDePago == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el medio de pago con ID {id}", ex);
            }
        }
    }
}
