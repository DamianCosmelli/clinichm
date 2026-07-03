using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class AgendaMedicaServices : IAgendaMedicaService
    {
        private readonly IAgendaMedicaRepository _repository;
        private readonly AppDbContext _context;

        private readonly ITurnoRepository _turnoRepository;
        private readonly IRepository<TurnosAfectados> _turnoAfectadosRepository;


        public AgendaMedicaServices(IAgendaMedicaRepository repository, ITurnoRepository turnoRepository, IRepository<TurnosAfectados> turnosAfectRepository, AppDbContext context)
        {
            _repository = repository;
            _context = context;
            _turnoRepository = turnoRepository;
            _turnoAfectadosRepository = turnosAfectRepository;
        }

        public async Task<IEnumerable<AgendaMedicaResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(a => new AgendaMedicaResponseDTO
                {
                    Id = a.Id,
                    FechaInicio = a.FechaInicio,
                    MedicoId = a.MedicoId,
                    SucursalId = a.SucursalId,
                    FechaFin = a.FechaFin
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todas las agendas médicas", ex);
            }
        }

        public async Task<AgendaMedicaResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var agendaMedica = await _repository.GetByIdAsync(id);
                return agendaMedica == null ? null : new AgendaMedicaResponseDTO
                {
                    Id = agendaMedica.Id,
                    FechaInicio = agendaMedica.FechaInicio,
                    MedicoId = agendaMedica.MedicoId,
                    SucursalId = agendaMedica.SucursalId,
                    FechaFin = agendaMedica.FechaFin
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener la agenda médica con ID {id}", ex);
            }
        }

        public async Task<AgendaMedicaResponseDTO?> AddAsync(AgendaMedicaDTO agendaMedicaDto)
        {
            try
            {
                var agendaMedica = new AgendaMedica
                {
                    FechaInicio = agendaMedicaDto.FechaInicio,
                    MedicoId = agendaMedicaDto.MedicoId,
                    SucursalId = agendaMedicaDto.SucursalId,
                    FechaFin = agendaMedicaDto.FechaFin
                };
                await _repository.AddAsync(agendaMedica);
                return new AgendaMedicaResponseDTO
                {
                    Id = agendaMedica.Id,
                    FechaInicio = agendaMedica.FechaInicio,
                    MedicoId = agendaMedica.MedicoId,
                    SucursalId = agendaMedica.SucursalId,
                    FechaFin = agendaMedica.FechaFin
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar una nueva agenda médica", ex);
            }
        }

        public async Task<AgendaMedicaResponseDTO?> UpdateAsync(int id, AgendaMedicaDTO agendaMedicaDto)
        {
            try
            {
                var agendaMedica = await _repository.GetByIdAsync(id);
                if (agendaMedica == null) return null!;
                
                /* Ejecuta turnos afectados por el cambio de agenda */
                if (agendaMedica.FechaInicio.Date != agendaMedicaDto.FechaInicio.Date)
                {
                    // Si las fecha ha cambiado, verifica los turnos afectados || ser considera Delete dado que se cambia la fecha
                    await TurnosAfectadosVerify(agendaMedica.MedicoId, agendaMedica.FechaInicio, agendaMedica.FechaFin, "Delete_UpdateDate");
                }
                else
                {
                    // Si cambio solo la hora, verifica los turnos afectados
                    await TurnosAfectadosVerify(agendaMedica.MedicoId, agendaMedicaDto.FechaInicio, agendaMedicaDto.FechaFin, "Update");
                }

                agendaMedica.FechaInicio = agendaMedicaDto.FechaInicio;
                agendaMedica.MedicoId = agendaMedicaDto.MedicoId;
                agendaMedica.SucursalId = agendaMedicaDto.SucursalId;
                agendaMedica.FechaFin = agendaMedicaDto.FechaFin;
                await _repository.UpdateAsync(agendaMedica);
                
                return new AgendaMedicaResponseDTO
                {
                    Id = agendaMedica.Id,
                    FechaInicio = agendaMedica.FechaInicio,
                    MedicoId = agendaMedica.MedicoId,
                    SucursalId = agendaMedica.SucursalId,
                    FechaFin = agendaMedica.FechaFin
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar la agenda médica con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var agendaMedica = await _repository.GetByIdAsync(id);
                if (agendaMedica == null) return false;
                await _repository.DeleteAsync(id);
                /* Ejecuta turnos afectados por el cambio de agenda */
                await TurnosAfectadosVerify(agendaMedica.MedicoId, agendaMedica.FechaInicio, agendaMedica.FechaFin, "Delete");
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al eliminar la agenda médica con ID {id}", ex);
            }
        }
        public async Task<IEnumerable<AgendaMedicaResponseXCalendarDTO>> GetAgendaMedicaFehaRangoAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var agendaMedica = await _repository.GetAllAsync();
                // Obtener IDs relacionados
                var medicoIds = agendaMedica.Select(t => t.MedicoId).Distinct().ToList();
                var sucursalIds = agendaMedica.Select(t => t.SucursalId).Distinct().ToList();

                // Cargar entidades necesarias
                var medicos = await _context.Medicos
                    .Where(m => medicoIds.Contains(m.Id))
                    .ToDictionaryAsync(m => m.Id);

                var sucursales = await _context.Sucursales
                    .Where(s => sucursalIds.Contains(s.Id))
                    .ToDictionaryAsync(s => s.Id);

                return agendaMedica.Where(a => a.FechaInicio.Date >= fechaInicio.Date && a.FechaFin.Date <= fechaFin.Date)
                    .Select(a => new AgendaMedicaResponseXCalendarDTO
                    {
                        Id = a.Id,
                        FechaInicio = a.FechaInicio,
                        MedicoId = a.MedicoId,
                        SucursalId = a.SucursalId,
                        FechaFin = a.FechaFin,
                        MedicoNombre = medicos[a.MedicoId].Nombre + " " + medicos[a.MedicoId].Apellido,
                        SucursalNombre = sucursales[a.SucursalId].Nombre
                    }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener las agendas médicas en el rango de fechas", ex);
            }
        }
        public async Task<IEnumerable<AgendaMedicaResponseDTO>> GetAgendaMedicaFehaRangoHoraYSucAsync(DateTime fechaInicio,
        DateTime fechaFin, int hora, int sucursalId)
        {
            try
            {
                var agendaMedica = await _repository.GetAllAsync();
                return agendaMedica.Where(a => a.FechaInicio.Date >= fechaInicio.Date
                                            && a.FechaFin.Date <= fechaFin.Date
                                            && a.FechaInicio.Hour <= hora // Comparar solo la hora
                                            && a.FechaFin.Hour >= hora // Comparar solo la hora
                                            && a.SucursalId == sucursalId)
                    .Select(a => new AgendaMedicaResponseDTO
                    {
                        Id = a.Id,
                        FechaInicio = a.FechaInicio,
                        MedicoId = a.MedicoId,
                        SucursalId = a.SucursalId,
                        FechaFin = a.FechaFin
                    }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener las agendas médicas en el rango de fechas y sucursal", ex);
            }
        }
        /* Realiza accion de turnos afectados por el cambio de agenda */
        private async Task TurnosAfectadosVerify(int medicoId, DateTime fechaInicio, DateTime fechaFin, string? accion = null)
        {
            Task<List<Turnos>>? turnosAfectados = null;
            // Busca turnos afectados por la agenda médica
            if (accion!.Contains("Delete"))
            {
                turnosAfectados = _turnoRepository.GetTurnosAfectadosCambioAgendaDiaAsync(medicoId, fechaInicio);
            }
            else
            {
                turnosAfectados = _turnoRepository.GetTurnosAfectadosCambioAgendaHoraAsync(medicoId, fechaInicio, fechaFin);
            }

            // Agrega los turnos afectados tabla de turnosAfectados 
            // Si no hay turnos afectados, no se hace nada
            if (turnosAfectados != null)
            {
                foreach (var turno in turnosAfectados.Result)
                {
                    var turnoAfectado = new TurnosAfectados
                    {
                        TurnoId = turno.Id,
                        ConResolucion = false, // Asignar el valor por defecto
                        Accion = accion // Asignar la acción si se proporciona
                    };

                    await _turnoAfectadosRepository.AddAsync(turnoAfectado);
                }

            }
        }
    }
}
