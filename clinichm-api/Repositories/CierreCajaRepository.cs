using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.AspNetCore.Http.HttpResults;

namespace clinichm_api.Repositories
{
    public enum MedioPagoEnum
    {
        EfectivoPeso,
        EfectivoDolar,
        TarjetaDebito,
        TarjetaCredito,
        Transferencia, 
        SinCargo
    }

    public class CierreCajaRepository : Repository<CierreCaja>, ICierreCajaRepository
    {
        private readonly AppDbContext _context;

        private static readonly Dictionary<MedioPagoEnum, string> MedioPagoMap = new Dictionary<MedioPagoEnum, string>
        {
            { MedioPagoEnum.EfectivoPeso, "Efectivo Peso" },
            { MedioPagoEnum.EfectivoDolar, "Efectivo Dolar" },
            { MedioPagoEnum.TarjetaDebito, "Tarjeta De Debito" },
            { MedioPagoEnum.TarjetaCredito, "Tarjeta De Credito" },
            { MedioPagoEnum.Transferencia, "Transferencia" },
            { MedioPagoEnum.SinCargo, "Sin Cargo" }
        };

        public CierreCajaRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<CierreCajaResponseDTO> ProcesarCierreDiarioAsync(CierreCajaRequestDTO request)
        {
            var cierreCaja = new CierreCaja
            {
                FechaHora = request.FechaHora,
                IdSucursal = request.IdSucursal,
            };

            /******* OBTENCION DE INFORMACION [INICIO] *********/
            //traer movimientos de caja de la fecha y sucursal indicada y que no tienen cierre de caja
            var movimientosCaja = await _context.MovimientosCaja
                .Where(m => m.FechaHora.Date == request.FechaHora.Date && m.IdSucursal == request.IdSucursal && m.IdCierreCaja == 0)
                .ToListAsync();

            // trae el listado de movimientos referidos(Campo MovRef)
            var movRelations = movimientosCaja
                                .Select(m => m.MovRelation)
                                .Distinct()
                                .ToList();

            // Obtiene los Vouchers de los movientos
            var vouchers = await _context.Vouchers
                .Where(v => movRelations.Contains(v.MovId))
                .ToListAsync();

            // Obtiene los tratamientos
            var tratamientoCobro = await _context.CobroTratamientos
                .Where(t => movRelations.Contains(t.MovId))
                .ToListAsync();

            // Obtiene los productos
            var productosCobro = await _context.CobroProductos
                .Where(p => movRelations.Contains(p.MovId))
                .ToListAsync();

            // obtiene listado de medios de pago
            var mediosDePago = await _context.MedioDePago.ToListAsync();
            // obtiene listado de tratamientos
            var tratamientos = await _context.Tratamientos.ToListAsync();
            // obtiene listado de medicos
            var medicos = await _context.Medicos.ToListAsync();

            /******* OBTENCION DE INFORMACION [FIN} *********/

            /******* PROCESAMIENTO DE MOVIMIENTOS [INICIO} *********/

            if (movimientosCaja.Count == 0)
            {
                //throw new Exception("No hay movimientos de caja para cerrar");
                return new CierreCajaResponseDTO
                {
                    Mensaje = "No hay movimientos de caja para cerrar"
                };
            }

            /*** Sumariza los totales por medios de pago ***/

            //suma todo los movimientos de efectivo excluyendo tipo retiro y vuelto
            cierreCaja.MontoEfectivo = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.EfectivoPeso] && mp.Id == m.IdMedioPago)
                && m.TipoMovimiento != "Retiro"
                && m.TipoMovimiento != "Vuelto")
                .Sum(m => m.Monto);

            cierreCaja.MontoTarjetaCredito = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.TarjetaCredito] && mp.Id == m.IdMedioPago))
                .Sum(m => m.Monto);

            cierreCaja.MontoDebito = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.TarjetaDebito] && mp.Id == m.IdMedioPago))
                .Sum(m => m.Monto);

            cierreCaja.MontoTransferencia = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.Transferencia] && mp.Id == m.IdMedioPago))
                .Sum(m => m.Monto);

            cierreCaja.MontoDolar = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.EfectivoDolar] && mp.Id == m.IdMedioPago))
                .Sum(m => m.Monto);

            //TotalCuentaClinichm (sumatoria de Credito y Debito)
            cierreCaja.TotalCuentaClinichm += cierreCaja.MontoDebito;
            cierreCaja.TotalCuentaClinichm += cierreCaja.MontoTarjetaCredito;

            //Movimientos Sin Cargo
            cierreCaja.TotalSinCargo = movimientosCaja
                .Where(m => mediosDePago.Any(mp => mp.MedioPago == MedioPagoMap[MedioPagoEnum.SinCargo] && mp.Id == m.IdMedioPago))
                .Sum(m => m.Monto);

            //suma todo los movimientos del tipo retiro
            cierreCaja.TotalRetiro = movimientosCaja
                .Where(m => m.TipoMovimiento == "Retiro")
                .Sum(m => m.Monto);

            //suma todo los movimientos del tipo vuelto
            cierreCaja.TotalVuelto = movimientosCaja
                .Where(m => m.TipoMovimiento == "Vuelto")
                .Sum(m => m.Monto);

            /* Sumariza el monto de vouchers*/
            cierreCaja.TotalVoucher = vouchers.Sum(v => v.Voucher);

            /* Contabiliza la cantidad de Vouchers*/
            cierreCaja.CantVoucher = vouchers.Count(m => m.Voucher > 0);

            /******* PROCESAMIENTO DE MOVIMIENTOS [FIN} *********/

            // Inicializar TotalEfectivo con el monto en efectivo
            cierreCaja.TotalEfectivo = cierreCaja.MontoEfectivo;

            /**** Calcular comisiones por tratamientos realizados [INICIO] ****/

            foreach (var movimiento in tratamientoCobro)
            {
                if (movimiento.conComision)
                {
                    var tratamiento = tratamientos.FirstOrDefault(t => t.Id == movimiento.TratamientoId);
                    var medico = medicos.FirstOrDefault(m => m.Id == movimiento.MedicoId);
                    if (tratamiento != null && medico != null)
                    {
                        decimal comision = medico.RoleId == 1 ? tratamiento.Comision : tratamiento.ComisionEncargado;
                        cierreCaja.TotalEfectivo -= comision;
                    }
                }
            }

            cierreCaja.TotalEfectivo -= cierreCaja.TotalRetiro;
            cierreCaja.TotalEfectivo -= cierreCaja.TotalVuelto;
            _context.CierreCaja.Add(cierreCaja);
            await _context.SaveChangesAsync();

            var idCierreCaja = cierreCaja.Id;

            var comisionesPendientes = await _context.PagoDeComisiones
                .Where(p => p.CierreDeCajaId == 0 && p.FechaDePago.Date == request.FechaHora.Date)
                .ToListAsync();

            foreach (var comision in comisionesPendientes)
            {
                comision.CierreDeCajaId = idCierreCaja;
                _context.PagoDeComisiones.Update(comision);
            }

            // Se agrega campo idCierreCaja en MovimientosCaja
            foreach (var movimiento in movimientosCaja)
            {
                movimiento.IdCierreCaja = idCierreCaja;
                _context.MovimientosCaja.Update(movimiento);
                await _context.SaveChangesAsync();
            }

            // Se agrega campo idCierreCaja en CobroTratamiento
            foreach (var tratCobro in tratamientoCobro)
            {
                tratCobro.IdCierreCaja = idCierreCaja;
                _context.CobroTratamientos.Update(tratCobro);
                await _context.SaveChangesAsync();
            }
            // Se agrega campo idCierreCaja en CobroProducto
            foreach (var prodCobro in productosCobro)
            {
                prodCobro.IdCierreCaja = idCierreCaja;
                _context.CobroProductos.Update(prodCobro);
                await _context.SaveChangesAsync();
            }
            // Se agrega campo idCierreCaja en Vouchers
            foreach (var voucher in vouchers)
            {
                voucher.IdCierreCaja = idCierreCaja;
                _context.Vouchers.Update(voucher);
                await _context.SaveChangesAsync();
            }

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
                TotalVoucher = cierreCaja.TotalVoucher,
                CantVoucher = cierreCaja.CantVoucher,
                IdSucursal = cierreCaja.IdSucursal,
                Mensaje = "Proceso Ejecutado Exitosamente"
            };
        }

        public async Task<CierreCajaMesResponseDTO> GetCierresDelMesAsync(int idSucursal, int month, int year)
        {
            var cierresDelMes = await _context.CierreCaja
                .Where(c => c.IdSucursal == idSucursal && c.FechaHora.Month == month && c.FechaHora.Year == year)
                .ToListAsync();

            var cierres = cierresDelMes.Select(c => new CierreCajaResponseDTO
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
                IdSucursal = c.IdSucursal
            }).ToList();

            var resumen = new CierreCajaResponseDTO
            {
                IdSucursal = idSucursal,
                FechaHora = new DateTime(year, month, 1),
                MontoEfectivo = cierres.Sum(c => c.MontoEfectivo),
                MontoTarjetaCredito = cierres.Sum(c => c.MontoTarjetaCredito),
                MontoDebito = cierres.Sum(c => c.MontoDebito),
                MontoTransferencia = cierres.Sum(c => c.MontoTransferencia),
                MontoDolar = cierres.Sum(c => c.MontoDolar),
                TotalEfectivo = cierres.Sum(c => c.TotalEfectivo),
                TotalCuentaClinichm = cierres.Sum(c => c.TotalCuentaClinichm),
                TotalRetiro = cierres.Sum(c => c.TotalRetiro),
                Mensaje = "Resumen de Totales"
            };

            //cierres.Add(resumen);

            return new CierreCajaMesResponseDTO
            {
                Resumen = resumen,
                Detalle = cierres
            };
        }
        // Método para obtener el cierre de caja y los movimientos asociados
        public async Task<CierreCajaReporteDTO> GetCierreInfoAsync(int idCierreCaja)
        {
            //Obtiene el resumen del cierre de Caja
            var cierreCaja = await _context.CierreCaja
                .Where(c => c.Id == idCierreCaja)
                .Select(c => new CierreCajaResponseDTO
                {
                    Id = c.Id,
                    FechaHora = c.FechaHora,
                    IdSucursal = c.IdSucursal,
                    Sucursal = _context.Sucursales.FirstOrDefault(suc => suc.Id == c.IdSucursal)!.Nombre,
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
                    TotalVoucher = c.TotalVoucher,
                    CantVoucher = c.CantVoucher
                })
                .FirstOrDefaultAsync();

            //Obtiene los movimientos de Caja asociados
            var movimientosCaja = await _context.MovimientosCaja
                .Where(m => m.IdCierreCaja == idCierreCaja)
                .Select(m => new MovimientoCajaResporteDTO
                {
                    Id = m.Id,
                    FechaHora = m.FechaHora,
                    Medico = _context.Medicos.FirstOrDefault(med => med.Id == m.IdMedico)!.Nombre + " " +
                                   _context.Medicos.FirstOrDefault(med => med.Id == m.IdMedico)!.Apellido,
                    Paciente = _context.Pacientes.FirstOrDefault(pac => pac.Id == m.IdPaciente)!.Nombre + " " +
                                   _context.Pacientes.FirstOrDefault(pac => pac.Id == m.IdPaciente)!.Apellido,
                    PacienteDNI = _context.Pacientes.FirstOrDefault(pac => pac.Id == m.IdPaciente)!.DNI,
                    NumeroFactura = m.NumeroFactura,
                    MedioPago = _context.MedioDePago.FirstOrDefault(mp => mp.Id == m.IdMedioPago)!.MedioPago,
                    Monto = m.Monto,
                    TipoMovimiento = m.TipoMovimiento,
                    FechaHoraTransf = m.FechaHoraTransf,
                    Sucursal = _context.Sucursales.FirstOrDefault(suc => suc.Id == m.IdSucursal)!.Nombre,
                    DescripcionRetiro = m.DescripcionRetiro,
                    Notas = _context.CobroNotas.FirstOrDefault(n => n.MovId == m.MovRelation)!.Notas,
                    Tratamientos = string.Join(", ", _context.CobroTratamientos
                        .Where(t => t.MovId == m.MovRelation)
                        .Join(
                            _context.Tratamientos,
                            ct => ct.TratamientoId,
                            tr => tr.Id,
                            (ct, tr) => tr.NombreTratamiento)
                        .ToList()),          
                })
                .ToListAsync();

            // Obtiene los productos empleados.
            var productosListado = await _context.CobroProductos
                .Where(p => p.IdCierreCaja == idCierreCaja)
                .Select(p => new CierreCajaProdDTO
                {
                    Fecha = _context.MovimientosCaja.FirstOrDefault(mov => mov.Id == p.MovId)!.FechaHora,
                    Medico = _context.Medicos.FirstOrDefault(med => med.Id == p.MedicoId)!.Nombre + " " +
                             _context.Medicos.FirstOrDefault(med => med.Id == p.MedicoId)!.Apellido,
                    Producto = _context.Producto.FirstOrDefault(prod => prod.Id == p.ProductoId)!.Nombre,
                    CantProd = p.Cantidad

                }).ToListAsync();

            // obtiene el listado de comisiones pagadas en el cierre
            var comisionesListado = await _context.PagoDeComisiones
            .Where(p => p.CierreDeCajaId == idCierreCaja)
                .Select(p => new CierreCajaPagoDeComisionesDTO
                {
                    Id = p.Id,
                    Medico = _context.Medicos.FirstOrDefault(med => med.Id == p.MedicoId)!.Nombre + " " +
                             _context.Medicos.FirstOrDefault(med => med.Id == p.MedicoId)!.Apellido,
                    FechaDePago = p.FechaDePago,
                    MetodoDePago = p.MetodoDePago,
                    Monto = p.Monto
                }).ToListAsync();

            return new CierreCajaReporteDTO
            {
                Resumen = cierreCaja,
                Movimientos = movimientosCaja,
                Productos = productosListado,
                Comisiones = comisionesListado
            };
        }

        public async Task<List<CierreCajaReporteDTO>> GetCierreXFechaAsync(DateOnly fechaCierre)
        {
            var cierres = await _context.CierreCaja
            .Where(c => DateOnly.FromDateTime(c.FechaHora) == fechaCierre)
            .Select(c => c.Id)
            .ToListAsync();

            if (cierres == null) return new List<CierreCajaReporteDTO>();

            var listaCierres = new List<CierreCajaReporteDTO>();

            foreach (int cierre in cierres)
            {
                var cierreDetalle = await GetCierreInfoAsync(cierre);
                listaCierres.Add(cierreDetalle);
            }

            return listaCierres;
        }

        public async Task<Boolean> ChangeMetodoPagoComision(int IdPagoComision)
        { 
            var pagoComision = await _context.PagoDeComisiones.FindAsync(IdPagoComision);           
            if (pagoComision == null)
            {
                return false; // Pago de comisión no encontrado
            }

            var cierreCaja = await _context.CierreCaja
                            .Where(c => c.Id == pagoComision!.CierreDeCajaId)
                            .FirstOrDefaultAsync();

            var totalEfectivoUpdate = cierreCaja!.TotalEfectivo;


            if (pagoComision.MetodoDePago == "Efectivo Peso")
            {
                // Si el método de pago es "Efectivo Peso", se cambia a "Transferencia"
                totalEfectivoUpdate += pagoComision.Monto; // Aumenta el efectivo
                pagoComision.MetodoDePago = "Transferencia"; // Cambia el método de pago
            }
            else
            {
                // Si el método de pago es "Transferencia", se cambia a "Efectivo Peso"
                totalEfectivoUpdate -= pagoComision.Monto; // Disminuye el efectivo
                pagoComision.MetodoDePago = "Efectivo Peso"; // Cambia el método de pago
            }

            //Actualiza el total efectivo en CierreCaja
            cierreCaja.TotalEfectivo = totalEfectivoUpdate;
            _context.CierreCaja.Update(cierreCaja);

            // Actualiza el pago de comisión
            _context.PagoDeComisiones.Update(pagoComision);
            
            // Guarda los cambios en la base de datos
            await _context.SaveChangesAsync();

            return true; // Cambio exitoso
        }
    }
}
