using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace clinichm_api.Services
{
    public class CobrosServices : ICobrosService
    {
        private readonly IMovimientoCajaRepository _movimientoRepository;
        private readonly IRepository<CobroProductos> _cobroProductosRepository;
        private readonly IRepository<CobroTratamientos> _cobroTratamientosRepository;
        private readonly IRepository<Vouchers> _vouchersRepository;
        private readonly IRepository<CobroNotas> _cobroNotasRepository;
        private readonly IRepository<PagoDeComisiones> _pagoDeComisionesRepository;
        private readonly IRepository<Tratamientos> _tratamientosRepository;
        private readonly IRepository<Medicos> _medicosRepository;
        private readonly IStockRepository _stockRepository;

        public CobrosServices(
            IMovimientoCajaRepository movimientoRepository,
            IRepository<CobroProductos> cobroProductosRepository,
            IRepository<CobroTratamientos> cobroTratamientosRepository,
            IRepository<Vouchers> vouchersRepository,
            IRepository<CobroNotas> cobroNotasRepository,
            IRepository<PagoDeComisiones> pagoDeComisionesRepository,
            IRepository<Tratamientos> tratamientosRepository,
            IRepository<Medicos> medicosRepository,
            IStockRepository stockRepository)
        {
            _cobroProductosRepository = cobroProductosRepository;
            _cobroTratamientosRepository = cobroTratamientosRepository;
            _movimientoRepository = movimientoRepository;
            _vouchersRepository = vouchersRepository;
            _cobroNotasRepository = cobroNotasRepository;
            _pagoDeComisionesRepository = pagoDeComisionesRepository;
            _tratamientosRepository = tratamientosRepository;
            _medicosRepository = medicosRepository;
            _stockRepository = stockRepository;
        }

        public async Task<CobrosRespDto> ProcesarCobro(CobrosDTO cobro)
        {
            try
            {
                int? movimientoIdRel = null;
                /* ******** Procesa los movimietos ***************/
                //proceso de pagos
                foreach (var pago in cobro.MediosDePago!)
                {
                    var movimiento = new MovimientoCaja
                    {
                        //Datos Comunes del movimiento
                        TipoMovimiento = "Cobro",
                        IdMedico = cobro.IdMedico,
                        IdSucursal = cobro.IdSucursal,
                        IdPaciente = cobro.IdPaciente,
                        CotizacionDolar = cobro.CotizacionDolar,
                        FechaHora = cobro.FechaHora,
                        FechaHoraTransf = cobro.HoraAcreditacion,
                        NumeroFactura = cobro.NumeroFactura,

                        //Datos del medio de pago
                        IdMedioPago = pago.Id,
                        Monto = pago.Monto
                    };

                    // Solo las iteraciones posteriores tendrán el campo MovRelation
                    if (movimientoIdRel.HasValue)
                    {
                        movimiento.MovRelation = movimientoIdRel.Value;
                    }

                    await _movimientoRepository.AddAsync(movimiento);

                    // Guardamos el ID del primer movimiento
                    if (!movimientoIdRel.HasValue)
                    {
                        movimientoIdRel = movimiento.Id;
                    }
                }
                // Actualiza valor del campo "MovRelation" en el primer pago
                if (movimientoIdRel.HasValue)
                {
                    var primerMovimiento = await _movimientoRepository.GetByIdAsync(movimientoIdRel.Value);
                    if (primerMovimiento != null)
                    {
                        primerMovimiento.MovRelation = primerMovimiento.Id;
                        await _movimientoRepository.UpdateAsync(primerMovimiento);
                    }
                }

                // Proceso de Vuelto
                if (cobro.Vuelto > 0)
                {
                    var vuelto = new MovimientoCaja
                    {
                        //Datos Comunes del movimiento
                        TipoMovimiento = "Vuelto",
                        IdMedico = cobro.IdMedico,
                        IdSucursal = cobro.IdSucursal,
                        IdPaciente = cobro.IdPaciente,
                        CotizacionDolar = cobro.CotizacionDolar,
                        FechaHora = cobro.FechaHora,
                        FechaHoraTransf = cobro.HoraAcreditacion,
                        NumeroFactura = cobro.NumeroFactura,
                        MovRelation = movimientoIdRel!.Value,

                        //Datos del medio de pago
                        IdMedioPago = 1,
                        Monto = cobro.Vuelto
                    };
                    await _movimientoRepository.AddAsync(vuelto);
                }
                /***** Procesa Voucher **********/
                if (cobro.Voucher > 0)
                {
                    var voucherPago = new Vouchers
                    {
                        Total = cobro.Total,
                        Voucher = cobro.Voucher,
                        MovId = movimientoIdRel!.Value
                    };
                    await _vouchersRepository.AddAsync(voucherPago);
                }
                /***** Procesa Notas **********/
                if (!string.IsNullOrWhiteSpace(cobro.Notas))
                {
                    var notas = new CobroNotas
                    {
                        Notas = cobro.Notas,
                        MovId = movimientoIdRel!.Value
                    };
                    await _cobroNotasRepository.AddAsync(notas);
                }
                /*****Procesa los Tramamientos  **********/
                foreach (var tratamiento in cobro.Tratamientos!)
                {
                    var tratamientoPago = new CobroTratamientos
                    {
                        TratamientoId = tratamiento.TratamientoId,
                        Precio = tratamiento.Precio,
                        conComision = tratamiento.conComision,
                        MovId = movimientoIdRel!.Value,
                        MedicoId = cobro.IdMedico
                    };
                    await _cobroTratamientosRepository.AddAsync(tratamientoPago);
                }

                /***** Crea PagoDeComisiones para tratamientos con comision **********/
                var tratamientos = (await _tratamientosRepository.GetAllAsync()).ToList();
                var medicos = (await _medicosRepository.GetAllAsync()).ToList();

                foreach (var tratamientoDto in cobro.Tratamientos!)
                {
                    if (tratamientoDto.conComision)
                    {
                        var tratamiento = tratamientos.FirstOrDefault(t => t.Id == tratamientoDto.TratamientoId);
                        var medico = medicos.FirstOrDefault(m => m.Id == cobro.IdMedico);
                        if (tratamiento != null && medico != null)
                        {
                            var comision = medico.RoleId == 1 ? tratamiento.Comision
                                            : medico.RoleId == 3 ? tratamiento.ComisionEspecial
                                            : tratamiento.ComisionEncargado;
                            var pagoComision = new PagoDeComisiones
                            {
                                MedicoId = cobro.IdMedico,
                                FechaDePago = DateTime.Now,
                                MetodoDePago = "Efectivo Peso",
                                Monto = comision,
                                CierreDeCajaId = 0
                            };
                            await _pagoDeComisionesRepository.AddAsync(pagoComision);
                        }
                    }
                }

                /***** Procesa los Productos **********/
                var responseStock = new List<string>();
                foreach (var producto in cobro.Productos!)
                {
                    var productoPago = new CobroProductos
                    {
                        ProductoId = producto.ProductoId,
                        Cantidad = producto.Cantidad,
                        MovId = movimientoIdRel!.Value,
                        MedicoId = cobro.IdMedico
                    };
                    // registra el cobro del producto
                    await _cobroProductosRepository.AddAsync(productoPago);
                    // Descontar stock del producto de la sucursal
                    var stockResponse = await _stockRepository.DescontarStockAsync(producto.ProductoId, producto.Cantidad, cobro.IdSucursal);
                    responseStock.Add(stockResponse);   
                }

                return new CobrosRespDto
                {
                    Id = movimientoIdRel!.Value,
                    Resultado = responseStock.Contains("Sin stock") ? "Sin Stock": "Cobro Ejecutado" 
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al procesar cobro", ex);
            }
        }
    }
}