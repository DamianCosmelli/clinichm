using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class PacienteServices : IPacienteService
    {
        private readonly IRepository<Pacientes> _repository;
        private readonly IPacienteRepository _pacienteRepository;

        public PacienteServices(IRepository<Pacientes> repository, IPacienteRepository pacienteRepository)
        {
            _repository = repository;
            _pacienteRepository = pacienteRepository;
        }

        public async Task<IEnumerable<PacienteResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(p => new PacienteResponseDTO
                {
                    Id=p.Id,
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
                    FechaDeRecontacto = p.FechaDeRecontacto

                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los pacientes", ex);
            }
        }

        public async Task<PacienteResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var paciente = await _repository.GetByIdAsync(id);
                return paciente == null ? null : new PacienteResponseDTO
                {
                    Id=paciente.Id,
                    Nombre = paciente.Nombre,
                    Apellido = paciente.Apellido,
                    Celular = paciente.Celular,
                    Email = paciente.Email,
                    DNI = paciente.DNI,
                    Direccion = paciente.Direccion,
                    CodigoPostal = paciente.CodigoPostal,
                    MedioPublicidad = paciente.MedioPublicidad,
                    FechaNac = paciente.FechaNac,
                    SoloConsulto = paciente.SoloConsulto,
                    FechaDeRecontacto = paciente.FechaDeRecontacto
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el paciente con ID {id}", ex);
            }
        }

        public async Task<PacienteResponseDTO> AddAsync(PacienteDTO pacienteDto)
        {
            try
            {
                var paciente = new Pacientes
                {
                    Nombre = pacienteDto.Nombre,
                    Apellido = pacienteDto.Apellido,
                    Celular = pacienteDto.Celular,
                    Email = pacienteDto.Email,
                    DNI = pacienteDto.DNI,
                    Direccion = pacienteDto.Direccion,
                    CodigoPostal = pacienteDto.CodigoPostal,
                    MedioPublicidad = pacienteDto.MedioPublicidad,
                    SoloConsulto = pacienteDto.SoloConsulto,
                    FechaNac = pacienteDto.FechaNac,
                    FechaDeRecontacto = pacienteDto.FechaDeRecontacto
                };
                await _repository.AddAsync(paciente);

                return new PacienteResponseDTO
                {
                    Id=paciente.Id,  
                    Nombre = paciente.Nombre,
                    Apellido = paciente.Apellido,
                    Celular = paciente.Celular,
                    Email = paciente.Email,
                    DNI = paciente.DNI,
                    Direccion = paciente.Direccion,
                    CodigoPostal = paciente.CodigoPostal,
                    MedioPublicidad = paciente.MedioPublicidad,
                    FechaNac = paciente.FechaNac,
                    SoloConsulto = paciente.SoloConsulto,
                    FechaDeRecontacto = paciente.FechaDeRecontacto 
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un nuevo paciente", ex);
            }
        }

        public async Task<PacienteResponseDTO> UpdateAsync(int id, PacienteDTO pacienteDto)
        {
            try
            {
                var paciente = await _repository.GetByIdAsync(id);
                if (paciente == null) return null!;
                paciente.Nombre = pacienteDto.Nombre;
                paciente.Apellido = pacienteDto.Apellido;
                paciente.Celular = pacienteDto.Celular;
                paciente.Email = pacienteDto.Email;
                paciente.DNI = pacienteDto.DNI;
                paciente.Direccion = pacienteDto.Direccion;
                paciente.CodigoPostal = pacienteDto.CodigoPostal;
                paciente.MedioPublicidad = pacienteDto.MedioPublicidad;
                paciente.SoloConsulto = pacienteDto.SoloConsulto;
                paciente.FechaNac = pacienteDto.FechaNac;
                paciente.FechaDeRecontacto = pacienteDto.FechaDeRecontacto;
                await _repository.UpdateAsync(paciente);
                
                return new PacienteResponseDTO
                {
                    Id=paciente.Id,  
                    Nombre = paciente.Nombre,
                    Apellido = paciente.Apellido,
                    Celular = paciente.Celular,
                    Email = paciente.Email,
                    DNI = paciente.DNI,
                    Direccion = paciente.Direccion,
                    CodigoPostal = paciente.CodigoPostal,
                    MedioPublicidad = paciente.MedioPublicidad,
                    FechaNac = paciente.FechaNac,
                    SoloConsulto = paciente.SoloConsulto,
                    FechaDeRecontacto = paciente.FechaDeRecontacto
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el paciente con ID {id}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var paciente = await _repository.GetByIdAsync(id);
                if (paciente == null) return false;
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
                throw new Exception($"Error al eliminar el paciente con ID {id}", ex);
            }
        }

        public async Task<IEnumerable<PacientesPorMedicoDTO>> GetPacientesPorMedicoAsync()
        {
            try
            {
                return await _pacienteRepository.GetPacientesPorMedicoAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener los pacientes por médico", ex);
            }
        }

        public async Task<PacienteResponseDTO?> GetByDNIAsync(string dni)
        {
            try
            {
                return await _pacienteRepository.GetByDNIAsync(dni);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el paciente con DNI {dni}", ex);
            }
        }

        public async Task<IEnumerable<PacienteResponseDTO>> GetPacientesSoloConsultoAsync()
        {
            try
            {
                return await _pacienteRepository.GetPacientesSoloConsultoAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los pacientes que solo consultaron", ex);
            }
        }

        public async Task<IEnumerable<PacienteUltVisitaRespDTO>> GetPacientesSinVisitaEnUltimosMesesAsync(int meses = 1)
        {
            try
            {
                return await _pacienteRepository.GetPacientesSinVisitaEnUltimosMesesAsync(meses);
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los pacientes sin visita en los últimos {meses} meses", ex);
            }
        }
    }
}
