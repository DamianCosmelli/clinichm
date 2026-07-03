using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace clinichm_api.Services.Implements
{
    public class CierreCajaService : ICierreCajaService
    {
        private readonly IRepository<CierreCaja> _repository;
        private readonly ICierreCajaRepository _cierreCajaRepository;

        public CierreCajaService(IRepository<CierreCaja> repository, ICierreCajaRepository cierreCajaRepository)
        {
            _repository = repository;
            _cierreCajaRepository = cierreCajaRepository;
        }

        public async Task<IEnumerable<CierreCajaResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(c => new CierreCajaResponseDTO
                {
                    Id = c.Id,
                    FechaHora = c.FechaHora,
                    MontoEfectivo = c.MontoEfectivo,
                    MontoTarjetaCredito = c.MontoTarjetaCredito,
                    MontoDebito = c.MontoDebito,
                    MontoTransferencia = c.MontoTransferencia,
                    MontoDolar = c.MontoDolar,
                    TotalEfectivo = c.TotalEfectivo,
                    TotalCuentaClinichm = c.TotalCuentaClinichm,
                    TotalRetiro = c.TotalRetiro,
                    TotalVuelto = c.TotalVuelto,
                    TotalSinCargo = c.TotalSinCargo,
                    IdSucursal = c.IdSucursal
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los cierres de caja", ex);
            }
        }

        public async Task<CierreCajaResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var cierreCaja = await _repository.GetByIdAsync(id);
                return cierreCaja == null ? null : new CierreCajaResponseDTO
                {
                    Id = cierreCaja.Id,
                    FechaHora = cierreCaja.FechaHora,
                    MontoEfectivo = cierreCaja.MontoEfectivo,
                    MontoTarjetaCredito = cierreCaja.MontoTarjetaCredito,
                    MontoDebito = cierreCaja.MontoDebito,
                    MontoTransferencia = cierreCaja.MontoTransferencia,
                    MontoDolar = cierreCaja.MontoDolar,
                    TotalEfectivo = cierreCaja.TotalEfectivo,
                    TotalCuentaClinichm = cierreCaja.TotalCuentaClinichm,
                    TotalRetiro = cierreCaja.TotalRetiro,
                    TotalVuelto = cierreCaja.TotalVuelto,
                    TotalSinCargo = cierreCaja.TotalSinCargo,
                    IdSucursal = cierreCaja.IdSucursal
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el cierre de caja con ID {id}", ex);
            }
        }

        public async Task<CierreCajaResponseDTO> AddAsync(CierreCajaDTO dto)
        {
            try
            {
                var cierreCaja = new CierreCaja
                {
                    FechaHora = dto.FechaHora,
                    MontoEfectivo = dto.MontoEfectivo,
                    MontoTarjetaCredito = dto.MontoTarjetaCredito,
                    MontoDebito = dto.MontoDebito,
                    MontoTransferencia = dto.MontoTransferencia,
                    MontoDolar = dto.MontoDolar,
                    TotalEfectivo = dto.TotalEfectivo,
                    TotalCuentaClinichm = dto.TotalCuentaClinichm,
                    TotalRetiro = dto.TotalRetiro,
                    TotalVuelto = dto.TotalVuelto,
                    TotalSinCargo = dto.TotalSinCargo,
                    IdSucursal = dto.IdSucursal
                };
                await _repository.AddAsync(cierreCaja);

                return new CierreCajaResponseDTO
                {
                    Id = cierreCaja.Id,
                    FechaHora = cierreCaja.FechaHora,
                    MontoEfectivo = cierreCaja.MontoEfectivo,
                    MontoTarjetaCredito = cierreCaja.MontoTarjetaCredito,
                    MontoDebito = cierreCaja.MontoDebito,
                    MontoTransferencia = cierreCaja.MontoTransferencia,
                    MontoDolar = cierreCaja.MontoDolar,
                    TotalEfectivo = cierreCaja.TotalEfectivo,
                    TotalCuentaClinichm = cierreCaja.TotalCuentaClinichm,
                    TotalRetiro = cierreCaja.TotalRetiro,
                    TotalVuelto = cierreCaja.TotalVuelto,
                    TotalSinCargo = cierreCaja.TotalSinCargo,
                    IdSucursal = cierreCaja.IdSucursal
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo cierre de caja", ex);
            }
        }

        public async Task<CierreCajaResponseDTO> UpdateAsync(int id, CierreCajaDTO dto)
        {
            try
            {
                var cierreCaja = await _repository.GetByIdAsync(id);
                if (cierreCaja == null) return null!;
                cierreCaja.FechaHora = dto.FechaHora;
                cierreCaja.MontoEfectivo = dto.MontoEfectivo;
                cierreCaja.MontoTarjetaCredito = dto.MontoTarjetaCredito;
                cierreCaja.MontoDebito = dto.MontoDebito;
                cierreCaja.MontoTransferencia = dto.MontoTransferencia;
                cierreCaja.MontoDolar = dto.MontoDolar;
                cierreCaja.TotalEfectivo = dto.TotalEfectivo;
                cierreCaja.TotalCuentaClinichm = dto.TotalCuentaClinichm;
                cierreCaja.TotalRetiro = dto.TotalRetiro;
                cierreCaja.TotalVuelto = dto.TotalVuelto;
                cierreCaja.TotalSinCargo = dto.TotalSinCargo;
                cierreCaja.IdSucursal = dto.IdSucursal;
                await _repository.UpdateAsync(cierreCaja);
                return new CierreCajaResponseDTO
                {
                    Id = cierreCaja.Id,
                    FechaHora = cierreCaja.FechaHora,
                    MontoEfectivo = cierreCaja.MontoEfectivo,
                    MontoTarjetaCredito = cierreCaja.MontoTarjetaCredito,
                    MontoDebito = cierreCaja.MontoDebito,
                    MontoTransferencia = cierreCaja.MontoTransferencia,
                    MontoDolar = cierreCaja.MontoDolar,
                    TotalEfectivo = cierreCaja.TotalEfectivo,
                    TotalCuentaClinichm = cierreCaja.TotalCuentaClinichm,
                    TotalRetiro = cierreCaja.TotalRetiro,
                    TotalVuelto = cierreCaja.TotalVuelto,
                    TotalSinCargo = cierreCaja.TotalSinCargo,
                    IdSucursal = cierreCaja.IdSucursal
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el cierre de caja con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var cierreCaja = await _repository.GetByIdAsync(id);
                if (cierreCaja == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el cierre de caja con ID {id}", ex);
            }
        }

        public async Task<CierreCajaResponseDTO> ProcesarCierreDiarioAsync(CierreCajaRequestDTO request)
        {
            try
            {
                return await _cierreCajaRepository.ProcesarCierreDiarioAsync(request);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al procesar el cierre diario de caja", ex);
            }
        }

        public async Task<CierreCajaMesResponseDTO> GetCierresDelMesAsync(int idSucursal, int month, int year)
        {
            try
            {
                return await _cierreCajaRepository.GetCierresDelMesAsync(idSucursal, month, year);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los cierres del mes", ex);
            }
        }

        public async Task<CierreCajaReporteDTO> GetCierreInfoAsync(int idCierreCaja)
        {
            try
            {
                return await _cierreCajaRepository.GetCierreInfoAsync(idCierreCaja);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el cierre y los movimientos de caja con ID {idCierreCaja}", ex);
            }
        }

        public async Task<List<CierreCajaReporteDTO>> GetCierreXFechaAsync(DateOnly fechaCierre)
        {
            try
            {
                return await _cierreCajaRepository.GetCierreXFechaAsync(fechaCierre);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los cierres de la fecha {fechaCierre}", ex);
            }
        }  
        public async Task<bool> ChangeMetodoPagoComision(int IdPagoComision)
        {
            try
            {
                return await _cierreCajaRepository.ChangeMetodoPagoComision(IdPagoComision);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al cambiar el método de pago de la comisión con ID {IdPagoComision}", ex);
            }
        }

    }
}
