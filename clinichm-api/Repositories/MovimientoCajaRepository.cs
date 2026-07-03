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
    public class MovimientoCajaRepository : Repository<MovimientoCaja>, IMovimientoCajaRepository
    {
        private readonly AppDbContext _context;

        public MovimientoCajaRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<MovimientosYComisionesDTO> GetMovimientosYComisionesHoy(int sucursal)
        {
            // Obtener movimientos de caja y mapear a DTO
            var movimientos = await _context.MovimientosCaja
                .Where(m => m.FechaHora.Date == DateTime.Today && 
               (sucursal == 0 || m.IdSucursal == sucursal))
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

                // Obtener IDs de movimientos relacionados
                var listMovimientos = await _context.MovimientosCaja
                    .Where(m => m.FechaHora.Date == DateTime.Today && 
                     (sucursal == 0 || m.IdSucursal == sucursal))
                    .Select(m => m.MovRelation)
                    .Distinct()
                    .ToListAsync();
                // Creamos un diccionario para mapear MovRelation a datos del paciente
                var movPacienteSucursalDict = movimientos
                    .ToDictionary(m => m.Id, m => new { m.Paciente, m.PacienteDNI, m.Sucursal});

                // Obtener comisiones y mapear a DTO
                var comisiones = await _context.CobroTratamientos
                    .Where(c => listMovimientos.Contains(c.MovId))
                    .Select(c => new ComisionesDTO
                    {
                        Sucursal = movPacienteSucursalDict.ContainsKey(c.MovId) ?
                                   movPacienteSucursalDict[c.MovId].Sucursal : "No disponible",
                        Medico = _context.Medicos.FirstOrDefault(med => med.Id == c.MedicoId)!.Nombre + " " +
                                        _context.Medicos.FirstOrDefault(med => med.Id == c.MedicoId)!.Apellido,
                        Paciente = movPacienteSucursalDict.ContainsKey(c.MovId) ?
                                   movPacienteSucursalDict[c.MovId].Paciente : "No disponible",
                        PacienteDNI = movPacienteSucursalDict.ContainsKey(c.MovId) ?
                                   movPacienteSucursalDict[c.MovId].PacienteDNI : "No disponible",
                        Tratamientos = _context.Tratamientos.FirstOrDefault(trat => trat.Id == c.TratamientoId)!.NombreTratamiento,

                        MontoComision = _context.Medicos.FirstOrDefault(med => med.Id == c.MedicoId)!.RoleId == 1 ?
                                        _context.Tratamientos.FirstOrDefault(trat => trat.Id == c.TratamientoId)!.Comision :
                                        _context.Medicos.FirstOrDefault(med => med.Id == c.MedicoId)!.RoleId == 2 ?
                                        _context.Tratamientos.FirstOrDefault(trat => trat.Id == c.TratamientoId)!.ComisionEncargado :
                                        _context.Tratamientos.FirstOrDefault(trat => trat.Id == c.TratamientoId)!.ComisionEspecial
                    })
            .ToListAsync();

            return new MovimientosYComisionesDTO
            {
                Movimientos = movimientos,
                Comisiones = comisiones
            };
        }
        
    }
}