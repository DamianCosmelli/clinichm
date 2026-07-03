using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace clinichm_api.Services.Implements
{
    public class MovimientoCajaService : IMovimientoCajaService
    {
        private readonly IMovimientoCajaRepository _repository;
        private readonly IRepository<CobroNotas> _repositoryCobroNotas;
        private readonly IDolarService _dolarService;

        public MovimientoCajaService(IMovimientoCajaRepository repository,
        IDolarService dolarService,
        IRepository<CobroNotas> repositoryCobroNotas)
        {
            _repository = repository;
            _dolarService = dolarService;
            _repositoryCobroNotas = repositoryCobroNotas;
        }

        public async Task<IEnumerable<MovimientoCajaResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(m => new MovimientoCajaResponseDTO
                {
                    Id = m.Id,
                    IdSucursal = m.IdSucursal,
                    IdMedico = m.IdMedico,
                    IdPaciente = m.IdPaciente,
                    CotizacionDolar = m.CotizacionDolar,
                    NumeroFactura = m.NumeroFactura,
                    IdMedioPago = m.IdMedioPago,
                    Monto = m.Monto,
                    TipoMovimiento = m.TipoMovimiento,
                    FechaHora = m.FechaHora,
                    FechaHoraTransf = m.FechaHoraTransf,
                    IdCierreCaja = m.IdCierreCaja,
                    IdEmpleado = m.IdEmpleado,
                    DescripcionRetiro = m.DescripcionRetiro,
                    MovRelation = m.MovRelation,
                    Notas = _repositoryCobroNotas.GetAllAsync().Result
                            .FirstOrDefault(n => n.MovId == m.MovRelation)?.Notas


                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los movimientos de caja", ex);
            }
        }

        public async Task<MovimientoCajaResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var movimientoCaja = await _repository.GetByIdAsync(id);
                return movimientoCaja == null ? null : new MovimientoCajaResponseDTO
                {
                    Id = movimientoCaja.Id,
                    IdSucursal = movimientoCaja.IdSucursal,
                    IdMedico = movimientoCaja.IdMedico,
                    IdPaciente = movimientoCaja.IdPaciente,
                    CotizacionDolar = movimientoCaja.CotizacionDolar,
                    NumeroFactura = movimientoCaja.NumeroFactura,
                    IdMedioPago = movimientoCaja.IdMedioPago,
                    Monto = movimientoCaja.Monto,
                    TipoMovimiento = movimientoCaja.TipoMovimiento,
                    FechaHora = movimientoCaja.FechaHora,
                    FechaHoraTransf = movimientoCaja.FechaHoraTransf,
                    IdCierreCaja = movimientoCaja.IdCierreCaja,
                    IdEmpleado = movimientoCaja.IdEmpleado,
                    DescripcionRetiro = movimientoCaja.DescripcionRetiro,
                    MovRelation = movimientoCaja.MovRelation,
                    Notas = _repositoryCobroNotas.GetAllAsync().Result
                            .FirstOrDefault(n => n.MovId == movimientoCaja.MovRelation)!.Notas

                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el movimiento de caja con ID {id}", ex);
            }
        }

        public async Task<MovimientoCajaResponseDTO> AddAsync(MovimientoCajaDTO movimientoCajaDto)
        {
            try
            {
                /*se obtiene el valor del dolar*/
                var dolar = await _dolarService.GetDolarAsync();
                var movimientoCaja = new MovimientoCaja
                {
                    IdSucursal = movimientoCajaDto.IdSucursal,
                    IdMedico = movimientoCajaDto.IdMedico,
                    IdPaciente = movimientoCajaDto.IdPaciente,
                    CotizacionDolar = movimientoCajaDto.CotizacionDolar,
                    NumeroFactura = movimientoCajaDto.NumeroFactura,
                    IdMedioPago = movimientoCajaDto.IdMedioPago,
                    Monto = movimientoCajaDto.Monto,
                    TipoMovimiento = movimientoCajaDto.TipoMovimiento,
                    FechaHora = movimientoCajaDto.FechaHora,
                    FechaHoraTransf = movimientoCajaDto.FechaHoraTransf,
                    IdCierreCaja = movimientoCajaDto.IdCierreCaja,
                    IdEmpleado = movimientoCajaDto.IdEmpleado,
                    DescripcionRetiro = movimientoCajaDto.DescripcionRetiro
                };
                await _repository.AddAsync(movimientoCaja);

                return new MovimientoCajaResponseDTO
                {
                    Id = movimientoCaja.Id,
                    IdSucursal = movimientoCaja.IdSucursal,
                    IdMedico = movimientoCaja.IdMedico,
                    IdPaciente = movimientoCaja.IdPaciente,
                    CotizacionDolar = movimientoCaja.CotizacionDolar,
                    NumeroFactura = movimientoCaja.NumeroFactura,
                    IdMedioPago = movimientoCaja.IdMedioPago,
                    Monto = movimientoCaja.Monto,
                    TipoMovimiento = movimientoCaja.TipoMovimiento,
                    FechaHora = movimientoCaja.FechaHora,
                    FechaHoraTransf = movimientoCaja.FechaHoraTransf,
                    IdCierreCaja = movimientoCaja.IdCierreCaja,
                    IdEmpleado = movimientoCaja.IdEmpleado,
                    DescripcionRetiro = movimientoCaja.DescripcionRetiro
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar un nuevo movimiento de caja", ex);
            }
        }

        public async Task<MovimientoCajaResponseDTO> UpdateAsync(int id, MovimientoCajaDTO movimientoCajaDto)
        {
            try
            {
                var movimientoCaja = await _repository.GetByIdAsync(id);
                if (movimientoCaja == null) return null!;

                //si el movimiento ya fue cerrado no se puede modificar
                if (movimientoCaja.IdCierreCaja > 0)
                {
                    Log.Error("[MovCaja-Update] No se puede modificar un movimiento de caja que ya fue cerrado");
                    throw new Exception("No se puede modificar un movimiento de caja que ya fue cerrado");
                }


                movimientoCaja.IdSucursal = movimientoCajaDto.IdSucursal;
                movimientoCaja.IdMedico = movimientoCajaDto.IdMedico;
                movimientoCaja.IdPaciente = movimientoCajaDto.IdPaciente;
                movimientoCaja.CotizacionDolar = movimientoCajaDto.CotizacionDolar;
                movimientoCaja.NumeroFactura = movimientoCajaDto.NumeroFactura;
                movimientoCaja.IdMedioPago = movimientoCajaDto.IdMedioPago;
                movimientoCaja.Monto = movimientoCajaDto.Monto;
                movimientoCaja.TipoMovimiento = movimientoCajaDto.TipoMovimiento;
                movimientoCaja.FechaHora = movimientoCajaDto.FechaHora;
                movimientoCaja.FechaHoraTransf = movimientoCajaDto.FechaHoraTransf;
                movimientoCaja.IdCierreCaja = movimientoCajaDto.IdCierreCaja;
                movimientoCaja.IdEmpleado = movimientoCajaDto.IdEmpleado;
                movimientoCaja.DescripcionRetiro = movimientoCajaDto.DescripcionRetiro;

                await _repository.UpdateAsync(movimientoCaja);
                return new MovimientoCajaResponseDTO
                {
                    Id = movimientoCaja.Id,
                    IdSucursal = movimientoCaja.IdSucursal,
                    IdMedico = movimientoCaja.IdMedico,
                    IdPaciente = movimientoCaja.IdPaciente,
                    CotizacionDolar = movimientoCaja.CotizacionDolar,
                    NumeroFactura = movimientoCaja.NumeroFactura,
                    IdMedioPago = movimientoCaja.IdMedioPago,
                    Monto = movimientoCaja.Monto,
                    TipoMovimiento = movimientoCaja.TipoMovimiento,
                    FechaHora = movimientoCaja.FechaHora,
                    FechaHoraTransf = movimientoCaja.FechaHoraTransf,
                    IdCierreCaja = movimientoCaja.IdCierreCaja,
                    IdEmpleado = movimientoCaja.IdEmpleado,
                    DescripcionRetiro = movimientoCaja.DescripcionRetiro
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el movimiento de caja con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var movimientoCaja = await _repository.GetByIdAsync(id);
                if (movimientoCaja == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el movimiento de caja con ID {id}", ex);
            }
        }
        public async Task<MovimientosYComisionesDTO> MovimientosyComisiones(int sucursal)
        {
            try
            {
                return await _repository.GetMovimientosYComisionesHoy(sucursal);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al consultar movimientos y comisiones", ex);
            }
        }
    }
}
