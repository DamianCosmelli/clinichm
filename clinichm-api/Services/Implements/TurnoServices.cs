using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DocumentFormat.OpenXml.Office2010.Excel;


namespace clinichm_api.Services
{
    public class TurnoServices : ITurnoService
    {
        private readonly IRepository<Turnos> _repository;
        private readonly ITurnoRepository _turnoRepository;
        
        private readonly AppDbContext _context;

        public TurnoServices(IRepository<Turnos> repository, ITurnoRepository turnoRepository , AppDbContext context)
        {
            _repository = repository;
            _turnoRepository = turnoRepository;
            _context = context;
        }

        public async Task<IEnumerable<TurnoResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(t => new TurnoResponseDTO
                {
                    Id = t.Id,
                    FechaHora = t.FechaHora,
                    MedicoId = t.MedicoId,
                    SucursalId = t.SucursalId,
                    PacienteId = t.PacienteId,
                    TratamientoId = t.TratamientoId,
                    UsuarioRegistroId = t.UsuarioRegistroId,
                    Confirmado = t.Confirmado,
                    FechaHoraConfirmacion = t.FechaHoraConfirmacion,
                    Reprogramado = t.Reprogramado,
                    NuevoTurnoId = t.NuevoTurnoId,
                    Asistio = t.Asistio,
                    Cancelado = t.Cancelado,
                    NoEncontrado = t.NoEncontrado
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los turnos", ex);
            }
        }

        public async Task<TurnoResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var turno = await _repository.GetByIdAsync(id);
                var duplicados = turno == null ? null : await GetTurnosDuplicadosAsync(turno.PacienteId);
                return turno == null ? null : new TurnoResponseDTO
                {
                    Id = turno.Id,
                    FechaHora = turno.FechaHora,
                    MedicoId = turno.MedicoId,
                    SucursalId = turno.SucursalId,
                    PacienteId = turno.PacienteId,
                    TratamientoId = turno.TratamientoId,
                    UsuarioRegistroId = turno.UsuarioRegistroId,
                    Confirmado = turno.Confirmado,
                    FechaHoraConfirmacion = turno.FechaHoraConfirmacion,
                    Reprogramado = turno.Reprogramado,
                    NuevoTurnoId = turno.NuevoTurnoId,
                    Asistio = turno.Asistio,
                    Cancelado = turno.Cancelado,
                    NoEncontrado = turno.NoEncontrado,
                    TurnosDuplicados = duplicados?
                        .Where(d => d.Id != turno.Id) // Filtra el propio turno
                        .ToList() ?? new List<TurnoDuplicadoDTO>()
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el turno con ID {id}", ex);
            }
        }

        public async Task<TurnoResponseDTO> AddAsync(TurnoDTO turnoDto)
        {
            try
            {

                var turno = new Turnos
                {
                    FechaHora = turnoDto.FechaHora,
                    MedicoId = turnoDto.MedicoId,
                    SucursalId = turnoDto.SucursalId,
                    PacienteId = turnoDto.PacienteId,
                    TratamientoId = turnoDto.TratamientoId,
                    UsuarioRegistroId = turnoDto.UsuarioRegistroId,
                    Confirmado = turnoDto.Confirmado,
                    FechaHoraConfirmacion = turnoDto.FechaHoraConfirmacion.HasValue ? turnoDto.FechaHoraConfirmacion.Value : turnoDto.FechaHora,
                    Reprogramado = turnoDto.Reprogramado,
                    NuevoTurnoId = turnoDto.NuevoTurnoId,
                    Asistio = turnoDto.Asistio,
                    Cancelado = turnoDto.Cancelado,
                    NoEncontrado = turnoDto.NoEncontrado
                };
                await _repository.AddAsync(turno);
                // Verificar si ya existe un turno para el mismo paciente en cualquier fecha y horario posterior al turno tomado
                var duplicados = await GetTurnosDuplicadosAsync(turno.PacienteId);

                return new TurnoResponseDTO
                {
                    Id = turno.Id,
                    FechaHora = turno.FechaHora,
                    MedicoId = turno.MedicoId,
                    SucursalId = turno.SucursalId,
                    PacienteId = turno.PacienteId,
                    TratamientoId = turno.TratamientoId,
                    UsuarioRegistroId = turno.UsuarioRegistroId,
                    Confirmado = turno.Confirmado,
                    FechaHoraConfirmacion = turno.FechaHoraConfirmacion,
                    Reprogramado = turno.Reprogramado,
                    NuevoTurnoId = turno.NuevoTurnoId,
                    Asistio = turno.Asistio,
                    Cancelado = turno.Cancelado,
                    NoEncontrado = turno.NoEncontrado,
                    TurnosDuplicados = duplicados.ToList() ?? new List<TurnoDuplicadoDTO>()
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo turno", ex);
            }
        }

        public async Task<TurnoResponseDTO> UpdateAsync(int id, TurnoDTO turnoDto)
        {
            try
            {
                var turno = await _repository.GetByIdAsync(id);
                if (turno == null) return null!;
                turno.FechaHora = turnoDto.FechaHora;
                turno.MedicoId = turnoDto.MedicoId;
                turno.SucursalId = turnoDto.SucursalId;
                turno.PacienteId = turnoDto.PacienteId;
                turno.TratamientoId = turnoDto.TratamientoId;
                turno.UsuarioRegistroId = turnoDto.UsuarioRegistroId;
                turno.Confirmado = turnoDto.Confirmado;
                turno.FechaHoraConfirmacion = turnoDto.FechaHoraConfirmacion.HasValue ? turnoDto.FechaHoraConfirmacion.Value : turnoDto.FechaHora; ;
                turno.Reprogramado = turnoDto.Reprogramado;
                turno.NuevoTurnoId = turnoDto.NuevoTurnoId;
                turno.Asistio = turnoDto.Asistio;
                turno.Cancelado = turnoDto.Cancelado;
                turno.NoEncontrado = turnoDto.NoEncontrado;
                await _repository.UpdateAsync(turno);

                return new TurnoResponseDTO
                {
                    Id = turno.Id,
                    FechaHora = turno.FechaHora,
                    MedicoId = turno.MedicoId,
                    SucursalId = turno.SucursalId,
                    PacienteId = turno.PacienteId,
                    TratamientoId = turno.TratamientoId,
                    UsuarioRegistroId = turno.UsuarioRegistroId,
                    Confirmado = turno.Confirmado,
                    FechaHoraConfirmacion = turno.FechaHoraConfirmacion,
                    Reprogramado = turno.Reprogramado,
                    NuevoTurnoId = turno.NuevoTurnoId,
                    Asistio = turno.Asistio,
                    Cancelado = turno.Cancelado,
                    NoEncontrado = turno.NoEncontrado,
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el turno con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var turno = await _repository.GetByIdAsync(id);
                if (turno == null) return false;
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
                throw new Exception($"Error al eliminar el turno con ID {id}", ex);
            }
        }

        public async Task<IEnumerable<TurnoDuplicadoDTO>> GetTurnosDuplicadosAsync(int pacienteId)
        {
            var turnosEnOtrosDias = await _repository.GetAllAsync();
            var turnosDuplicados = turnosEnOtrosDias
                .Where(t => t.PacienteId == pacienteId && t.Asistio == false )
                .Select(t => new TurnoDuplicadoDTO { Id = t.Id, fecha = t.FechaHora, TratamientoId = t.TratamientoId, MedicoId = t.MedicoId })
                .ToList();

            return turnosDuplicados;
        }

        public async Task<IEnumerable<TurnoResponseDTO>> GetTurnosAusentesAsync()
        {
            var turnosAusentes = await _turnoRepository.GetTurnosAusentesAsync();
            return turnosAusentes.Select(t => new TurnoResponseDTO
            {
                Id = t.Id,
                FechaHora = t.FechaHora,
                MedicoId = t.MedicoId,
                SucursalId = t.SucursalId,
                PacienteId = t.PacienteId,
                TratamientoId = t.TratamientoId,
                UsuarioRegistroId = t.UsuarioRegistroId,
                Confirmado = t.Confirmado,
                FechaHoraConfirmacion = t.FechaHoraConfirmacion,
                Reprogramado = t.Reprogramado,
                NuevoTurnoId = t.NuevoTurnoId,
                Asistio = t.Asistio
            }).ToList();
        }

        public async Task<IEnumerable<TurnoResponseXCalendarDTO>> GetTurnosAfectadosPorCambioAgendaAsync()
        {
            // Obtener los turnos afectados por el cambio de agenda
            var turnosAfectadosRepository = new Repository<TurnosAfectados>(_context);
            var turnosAfectadosList = await turnosAfectadosRepository.GetAllAsync();
            var turnosAfectados = turnosAfectadosList.Where(t => t.ConResolucion == false);

            //identificar los turnos afectados
            var turnosAfectadosIds = turnosAfectados.Select(t => t.TurnoId).ToList();
            var turnosAfectadosQuery = _context.Turnos
                .Where(t => turnosAfectadosIds.Contains(t.Id));

            // Obtener IDs relacionados
                var medicoIds = turnosAfectadosQuery.Select(t => t.MedicoId).Distinct().ToList();
                var pacienteIds = turnosAfectadosQuery.Select(t => t.PacienteId).Distinct().ToList();
                var sucursalIds = turnosAfectadosQuery.Select(t => t.SucursalId).Distinct().ToList();
                var tratamientoIds = turnosAfectadosQuery.Select(t => t.TratamientoId).Distinct().ToList();

                // Cargar entidades necesarias
                var medicos = await _context.Medicos
                    .Where(m => medicoIds.Contains(m.Id))
                    .ToDictionaryAsync(m => m.Id);

                var pacientes = await _context.Pacientes
                    .Where(p => pacienteIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id);

                var sucursales = await _context.Sucursales
                    .Where(s => sucursalIds.Contains(s.Id))
                    .ToDictionaryAsync(s => s.Id);

                var tratamientos = await _context.Tratamientos
                    .Where(t => tratamientoIds.Contains(t.Id))
                    .ToDictionaryAsync(t => t.Id);

                        
            return turnosAfectadosQuery.Select(t => new TurnoResponseXCalendarDTO
            {
                Id = t.Id,
                FechaHora = t.FechaHora,
                MedicoId = t.MedicoId,
                MedicoNombre = medicos[t.MedicoId].Nombre + " " + medicos[t.MedicoId].Apellido,
                PacienteNombre = pacientes[t.PacienteId].Nombre + " " + pacientes[t.PacienteId].Apellido,
                PacienteCelular = pacientes[t.PacienteId].Celular,
                PacienteEmail = pacientes[t.PacienteId].Email,
                TratamientoNombre = tratamientos[t.TratamientoId].NombreTratamiento,
                SucursalNombre = sucursales[t.SucursalId].Nombre,
                SucursalId = t.SucursalId,
                PacienteId = t.PacienteId,
                TratamientoId = t.TratamientoId,
                UsuarioRegistroId = t.UsuarioRegistroId,
                Confirmado = t.Confirmado,
                FechaHoraConfirmacion = t.FechaHoraConfirmacion,
                Reprogramado = t.Reprogramado,
                NuevoTurnoId = t.NuevoTurnoId,
                Asistio = t.Asistio
            }).ToList();
        }

        public async Task<IEnumerable<TurnoResponseXCalendarDTO>> GetTurnosRangoFecha(DateTime fechaDesde, DateTime fechaHasta)
        {
            try
            {
                var turnos = await _turnoRepository.GetTurnosRangoFecha(fechaDesde, fechaHasta);

                if (turnos == null)
                    return new List<TurnoResponseXCalendarDTO>();

                // Obtener IDs relacionados
                var medicoIds = turnos.Select(t => t.MedicoId).Distinct().ToList();
                var pacienteIds = turnos.Select(t => t.PacienteId).Distinct().ToList();
                var sucursalIds = turnos.Select(t => t.SucursalId).Distinct().ToList();
                var tratamientoIds = turnos.Select(t => t.TratamientoId).Distinct().ToList();

                // Cargar entidades necesarias
                var medicos = await _context.Medicos
                    .Where(m => medicoIds.Contains(m.Id))
                    .ToDictionaryAsync(m => m.Id);

                var pacientes = await _context.Pacientes
                    .Where(p => pacienteIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id);

                var sucursales = await _context.Sucursales
                    .Where(s => sucursalIds.Contains(s.Id))
                    .ToDictionaryAsync(s => s.Id);

                var tratamientos = await _context.Tratamientos
                    .Where(t => tratamientoIds.Contains(t.Id))
                    .ToDictionaryAsync(t => t.Id);

                var resultado = new List<TurnoResponseXCalendarDTO>();

                foreach (var t in turnos)
                {
                    var duplicados = await GetTurnosDuplicadosAsync(t.PacienteId);

                    // Excluir el propio ID del turno
                    var duplicadosFiltrados = duplicados?
                        .Where(d => d.Id != t.Id)
                        .ToList() ?? new List<TurnoDuplicadoDTO>();

                    resultado.Add(new TurnoResponseXCalendarDTO
                    {
                        Id = t.Id,
                        FechaHora = t.FechaHora,
                        MedicoId = t.MedicoId,
                        MedicoNombre = medicos[t.MedicoId].Nombre + " " + medicos[t.MedicoId].Apellido,
                        PacienteNombre = pacientes[t.PacienteId].Nombre + " " + pacientes[t.PacienteId].Apellido,
                        PacienteCelular = pacientes[t.PacienteId].Celular,
                        PacienteEmail = pacientes[t.PacienteId].Email,
                        TratamientoNombre = tratamientos[t.TratamientoId].NombreTratamiento,
                        SucursalNombre = sucursales[t.SucursalId].Nombre,
                        SucursalId = t.SucursalId,
                        PacienteId = t.PacienteId,
                        TratamientoId = t.TratamientoId,
                        UsuarioRegistroId = t.UsuarioRegistroId,
                        Confirmado = t.Confirmado,
                        FechaHoraConfirmacion = t.FechaHoraConfirmacion,
                        Reprogramado = t.Reprogramado,
                        NuevoTurnoId = t.NuevoTurnoId,
                        Asistio = t.Asistio,
                        Cancelado = t.Cancelado,
                        NoEncontrado = t.NoEncontrado,
                        TurnosDuplicados = duplicadosFiltrados
                    });
                }
                
                return resultado;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener el rango de turnos", ex);
            }
        }

        // Método para alternar ConResolucion de TurnosAfectados por TurnoId (cumple con la interfaz)
        public async Task<bool> UpdateConResolucionTurnoAfectadoAsync(int turnoId)
        {
            var turnosAfectadosRepository = new Repository<TurnosAfectados>(_context);
            var turnosAfectadosList = await turnosAfectadosRepository.GetAllAsync();
            var turnoAfectado = turnosAfectadosList.FirstOrDefault(t => t.TurnoId == turnoId);
            if (turnoAfectado == null)
                return false;

            turnoAfectado.ConResolucion = !turnoAfectado.ConResolucion;
            await turnosAfectadosRepository.UpdateAsync(turnoAfectado);
            return true;
        }

    }

    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }
    }

}
        



