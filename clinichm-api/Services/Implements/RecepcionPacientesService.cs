using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services.Implements
{
    public class RecepcionPacientesService : IRecepcionPacientesService
    {
        private readonly IRepository<RecepcionPacientes> _repository;
        private readonly AppDbContext _context;

        public RecepcionPacientesService(IRepository<RecepcionPacientes> repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<IEnumerable<RecepcionPacientesResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(rp => new RecepcionPacientesResponseDTO
                {
                    Id = rp.Id,
                    PacienteId = rp.PacienteId,
                    TratamientoId = rp.TratamientoId,
                    MedicoId = rp.MedicoId,
                    HoraIngreso = rp.HoraIngreso,
                    HoraAnestesia = rp.HoraAnestesia,
                    EstadoRecepcion = rp.EstadoRecepcion,
                    EsConsulta = rp.EsConsulta,
                    Piso = rp.Piso,
                    SucursalId = rp.SucursalId,
                    EsRetoque = rp.EsRetoque,
                    MotivoConsulta = rp.MotivoConsulta
                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener lista de pacientes recepcionados", ex);
            }
        }

        public async Task<RecepcionPacientesResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var recepcionPacientes = await _repository.GetByIdAsync(id);
                return recepcionPacientes == null ? null : new RecepcionPacientesResponseDTO
                {
                    Id = recepcionPacientes.Id,
                    PacienteId = recepcionPacientes.PacienteId,
                    TratamientoId = recepcionPacientes.TratamientoId,
                    MedicoId = recepcionPacientes.MedicoId,
                    HoraIngreso = recepcionPacientes.HoraIngreso,
                    HoraAnestesia = recepcionPacientes.HoraAnestesia,
                    EstadoRecepcion = recepcionPacientes.EstadoRecepcion,
                    EsConsulta = recepcionPacientes.EsConsulta,
                    Piso = recepcionPacientes.Piso,
                    SucursalId = recepcionPacientes.SucursalId,
                    EsRetoque = recepcionPacientes.EsRetoque,
                    MotivoConsulta = recepcionPacientes.MotivoConsulta
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener paciente recepcionado", ex);
            }
        }

        public async Task<RecepcionPacientesResponseDTO> AddAsync(RecepcionPacientesDTO dto)
        {
            try
            {
                var recepcionPacientes = new RecepcionPacientes
                {
                    PacienteId = dto.PacienteId,
                    TratamientoId = dto.TratamientoId,
                    MedicoId = dto.MedicoId,
                    HoraIngreso = dto.HoraIngreso,
                    HoraAnestesia = dto.HoraAnestesia,
                    EstadoRecepcion = dto.EstadoRecepcion,
                    EsConsulta = dto.EsConsulta,
                    Piso = dto.Piso,
                    SucursalId = dto.SucursalId,
                    EsRetoque = dto.EsRetoque,
                    MotivoConsulta = dto.MotivoConsulta

                };
                await _repository.AddAsync(recepcionPacientes);

                return new RecepcionPacientesResponseDTO
                {
                    Id = recepcionPacientes.Id,
                    PacienteId = recepcionPacientes.PacienteId,
                    TratamientoId = recepcionPacientes.TratamientoId,
                    MedicoId = recepcionPacientes.MedicoId,
                    HoraIngreso = recepcionPacientes.HoraIngreso,
                    HoraAnestesia = recepcionPacientes.HoraAnestesia,
                    EstadoRecepcion = recepcionPacientes.EstadoRecepcion,
                    EsConsulta = recepcionPacientes.EsConsulta,
                    Piso = recepcionPacientes.Piso,
                    SucursalId = recepcionPacientes.SucursalId,
                    EsRetoque = recepcionPacientes.EsRetoque,
                    MotivoConsulta = recepcionPacientes.MotivoConsulta
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al recepcionar paciente", ex);
            }
        }

        public async Task<RecepcionPacientesResponseDTO> UpdateAsync(int id, RecepcionPacientesDTO dto)
        {
            try
            {
                var recepcionPacientes = await _repository.GetByIdAsync(id);
                if (recepcionPacientes == null) return null!;
                recepcionPacientes.PacienteId = dto.PacienteId;
                recepcionPacientes.TratamientoId = dto.TratamientoId;
                recepcionPacientes.MedicoId = dto.MedicoId;
                recepcionPacientes.HoraIngreso = dto.HoraIngreso;
                recepcionPacientes.HoraAnestesia = dto.HoraAnestesia;
                recepcionPacientes.EstadoRecepcion = dto.EstadoRecepcion;
                recepcionPacientes.EsConsulta = dto.EsConsulta;
                recepcionPacientes.Piso = dto.Piso;
                recepcionPacientes.SucursalId = dto.SucursalId;
                recepcionPacientes.EsRetoque = dto.EsRetoque;
                recepcionPacientes.MotivoConsulta = dto.MotivoConsulta;

                await _repository.UpdateAsync(recepcionPacientes);
                return new RecepcionPacientesResponseDTO
                {
                    Id = recepcionPacientes.Id,
                    PacienteId = recepcionPacientes.PacienteId,
                    TratamientoId = recepcionPacientes.TratamientoId,
                    MedicoId = recepcionPacientes.MedicoId,
                    HoraIngreso = recepcionPacientes.HoraIngreso,
                    HoraAnestesia = recepcionPacientes.HoraAnestesia,
                    EstadoRecepcion = recepcionPacientes.EstadoRecepcion,
                    EsConsulta = recepcionPacientes.EsConsulta,
                    Piso = recepcionPacientes.Piso,
                    SucursalId = recepcionPacientes.SucursalId
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al actualizar recepcion de paciente", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var recepcionPacientes = await _repository.GetByIdAsync(id);
                if (recepcionPacientes == null) return false;
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
                throw new Exception("Error al eliminar recepcion de paciente", ex);
            }
        }

        public async Task<IEnumerable<RecepcionCalendarResponseDTO>> GetRecepcionXFecha(DateTime fecha)
        {
            var pacientes = await _repository.GetAllAsync();

            // Obtener IDs relacionados
            var medicoIds = pacientes.Select(t => t.MedicoId).Distinct().ToList();
            var pacienteIds = pacientes.Select(t => t.PacienteId).Distinct().ToList();
            var sucursalIds = pacientes.Select(t => t.SucursalId).Distinct().ToList();
            var tratamientoIds = pacientes.Select(t => t.TratamientoId).Distinct().ToList();

            // Cargar entidades necesarias
            var medicos = await _context.Medicos
                .Where(m => medicoIds.Contains(m.Id))
                .ToDictionaryAsync(m => m.Id);

            var pacientesInfo = await _context.Pacientes
                .Where(p => pacienteIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var sucursales = await _context.Sucursales
                .Where(s => sucursalIds.Contains(s.Id))
                .ToDictionaryAsync(s => s.Id);

            var tratamientos = await _context.Tratamientos
                .Where(t => tratamientoIds.Contains(t.Id))
                .ToDictionaryAsync(t => t.Id);

            return pacientes.Where(p => p.HoraIngreso.Date == fecha.Date
                                //&& p.EstadoRecepcion != "Finalizado"
                                ).
                                Select(p => new RecepcionCalendarResponseDTO
                                {
                                    Id = p.Id,
                                    PacienteId = p.PacienteId,
                                    PacienteNombre = pacientesInfo[p.PacienteId].Nombre + " " + pacientesInfo[p.PacienteId].Apellido,
                                    PacienteDNI = pacientesInfo[p.PacienteId].DNI,
                                    PacienteCelular = pacientesInfo[p.PacienteId].Celular,
                                    PacienteMail = pacientesInfo[p.PacienteId].Email,
                                    TratamientoId = p.TratamientoId,
                                    TratamientoNombre = tratamientos[p.TratamientoId].NombreTratamiento,
                                    MedicoId = p.MedicoId,
                                    MedicoNombre = medicos[p.MedicoId].Nombre + " " + medicos[p.MedicoId].Apellido,
                                    HoraIngreso = p.HoraIngreso,
                                    HoraAnestesia = p.HoraAnestesia,
                                    EstadoRecepcion = p.EstadoRecepcion,
                                    EsConsulta = p.EsConsulta,
                                    EsRetoque = p.EsRetoque,
                                    SucursalId = p.SucursalId,
                                    Sucursal = sucursales[p.SucursalId].Nombre,
                                    Piso = p.Piso,
                                    MotivoConsulta = p.MotivoConsulta
                                }
                                ).ToList();

        }
        
        public async Task<IEnumerable<RecepcionCalendarResponseDTO>> GetRecepcionXPacienteId(int pacienteId)
        {
            var pacientes = await _repository.GetAllAsync();

            // Obtener IDs relacionados
            var medicoIds = pacientes.Select(t => t.MedicoId).Distinct().ToList();
            var pacienteIds = pacientes.Select(t => t.PacienteId).Distinct().ToList();
            var sucursalIds = pacientes.Select(t => t.SucursalId).Distinct().ToList();
            var tratamientoIds = pacientes.Select(t => t.TratamientoId).Distinct().ToList();

            // Cargar entidades necesarias
            var medicos = await _context.Medicos
                .Where(m => medicoIds.Contains(m.Id))
                .ToDictionaryAsync(m => m.Id);

            var pacientesInfo = await _context.Pacientes
                .Where(p => pacienteIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var sucursales = await _context.Sucursales
                .Where(s => sucursalIds.Contains(s.Id))
                .ToDictionaryAsync(s => s.Id);

            var tratamientos = await _context.Tratamientos
                .Where(t => tratamientoIds.Contains(t.Id))
                .ToDictionaryAsync(t => t.Id);

            return pacientes.Where(p => p.PacienteId == pacienteId).
                                Select(p => new RecepcionCalendarResponseDTO
                                {
                                    Id = p.Id,
                                    PacienteId = p.PacienteId,
                                    PacienteNombre = pacientesInfo[p.PacienteId].Nombre+" "+pacientesInfo[p.PacienteId].Apellido,
                                    PacienteDNI = pacientesInfo[p.PacienteId].DNI,
                                    PacienteCelular = pacientesInfo[p.PacienteId].Celular,
                                    PacienteMail = pacientesInfo[p.PacienteId].Email,
                                    TratamientoId = p.TratamientoId,
                                    TratamientoNombre = tratamientos[p.TratamientoId].NombreTratamiento,
                                    MedicoId = p.MedicoId,
                                    MedicoNombre = medicos[p.MedicoId].Nombre+" "+medicos[p.MedicoId].Apellido,
                                    HoraIngreso = p.HoraIngreso,
                                    HoraAnestesia = p.HoraAnestesia,
                                    EstadoRecepcion = p.EstadoRecepcion,
                                    EsConsulta = p.EsConsulta,
                                    EsRetoque = p.EsRetoque,
                                    SucursalId = p.SucursalId,
                                    Sucursal = sucursales[p.SucursalId].Nombre,
                                    Piso = p.Piso,
                                    MotivoConsulta = p.MotivoConsulta
                                }
                                ).ToList();

        }
    }
}
