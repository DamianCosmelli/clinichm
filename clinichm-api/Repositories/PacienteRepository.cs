using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace clinichm_api.Repositories
{
    public class PacienteRepository : Repository<Pacientes>, IPacienteRepository
    {
        private readonly AppDbContext _context;

        public PacienteRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PacientesPorMedicoDTO>> GetPacientesPorMedicoAsync()
        {
            var turnos = await _context.RecepcionPacientes.ToListAsync();

            var turnosAgrupados = turnos
                .GroupBy(t => t.MedicoId)
                .ToList();

            var resultado = new List<PacientesPorMedicoDTO>();

            foreach (var grupo in turnosAgrupados)
            {
                var pacientes = grupo
                    .Select(t => t.PacienteId)
                    .Distinct()
                    .Select(pacienteId => _context.Pacientes
                        .Where(p => p.Id == pacienteId)
                        .Select(p => new PacienteResponseDTO
                        {
                            Id = p.Id,
                            Nombre = p.Nombre,
                            Apellido = p.Apellido,
                            Celular = p.Celular,
                            Email = p.Email,
                            DNI = p.DNI,
                            Direccion = p.Direccion,
                            CodigoPostal = p.CodigoPostal,
                            MedioPublicidad = p.MedioPublicidad
                        }).FirstOrDefault())
                    .Where(p => p != null)
                    .Cast<PacienteResponseDTO>()
                    .ToList();

                resultado.Add(new PacientesPorMedicoDTO
                {
                    MedicoId = grupo.Key,
                    Pacientes = pacientes
                });
            }

            return resultado;
        }

        public async Task<PacienteResponseDTO?> GetByDNIAsync(string dni)
        {
            var paciente = await _context.Pacientes
                .Where(p => p.DNI == dni)
                .Select(p => new PacienteResponseDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellido = p.Apellido,
                    Celular = p.Celular,
                    Email = p.Email,
                    DNI = p.DNI,
                    Direccion = p.Direccion,
                    CodigoPostal = p.CodigoPostal,
                    MedioPublicidad = p.MedioPublicidad,
                    SoloConsulto = p.SoloConsulto,
                    FechaNac = p.FechaNac,
                })
                .FirstOrDefaultAsync();

            return paciente;
        }

        public async Task<IEnumerable<PacienteResponseDTO>> GetPacientesSoloConsultoAsync()
        {
            var pacientes = await _context.Pacientes
                .Where(p => p.SoloConsulto)
                .Select(p => new PacienteResponseDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellido = p.Apellido,
                    Celular = p.Celular,
                    Email = p.Email,
                    DNI = p.DNI,
                    Direccion = p.Direccion,
                    CodigoPostal = p.CodigoPostal,
                    MedioPublicidad = p.MedioPublicidad,
                    SoloConsulto = p.SoloConsulto,
                    FechaDeRecontacto = p.FechaDeRecontacto
                })
                .ToListAsync();

            return pacientes;
        }

        public async Task<IEnumerable<PacienteUltVisitaRespDTO>> GetPacientesSinVisitaEnUltimosMesesAsync(int meses = 1)
        {
            var fechaLimite = DateTime.Now.AddMonths(-meses);
            var pacientesConVisitas = await _context.RecepcionPacientes
                .Where(rp => rp.HoraIngreso >= fechaLimite)
                .Select(rp => rp.PacienteId)
                .Distinct()
                .ToListAsync();

            var pacientesSinVisitas = await _context.Pacientes
                .Where(p => !pacientesConVisitas.Contains(p.Id))
                .Select(p => new PacienteUltVisitaRespDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellido = p.Apellido,
                    Celular = p.Celular,
                    Email = p.Email,
                    DNI = p.DNI,
                    Direccion = p.Direccion,
                    CodigoPostal = p.CodigoPostal,
                    MedioPublicidad = p.MedioPublicidad,
                    HoraIngreso = _context.RecepcionPacientes
                        .Where(rp => rp.PacienteId == p.Id)
                        .OrderByDescending(rp => rp.HoraIngreso)
                        .Select(rp => rp.HoraIngreso)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return pacientesSinVisitas;
        }
    }
}
