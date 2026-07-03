using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class UsuarioAuditServices : IUsuarioAuditService
    {
        private readonly IUsuarioAuditRepository _repository;

        public UsuarioAuditServices(IUsuarioAuditRepository repository)
        {
            _repository = repository;
        }
        /*
        * Devuelve los ultimos 20 registros de sesiones 
        */
        public async Task<IEnumerable<UsuarioAuditDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync())
                .OrderByDescending(s => s.Id) // Ordena por ID descendente
                .Take(20)                     // toma los ultimos 20 registros
                .Select(s => new UsuarioAuditDTO
                {
                    Id = s.Id,
                    UsuarioId = s.UsuarioId,
                    LoginTime = s.LoginTime,
                    LogoutTime = s.LogoutTime,
                    Ip = s.Ip,
                    Navegador = s.Navegador

                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener auditorias", ex);
            }
        }

        public async Task<UsuarioAuditDTO?> GetByIdAsync(int id)
        {
            try
            {
                var auditoria = await _repository.GetByIdAsync(id);
                return auditoria == null ? null : new UsuarioAuditDTO
                {
                    Id = auditoria.Id,
                    UsuarioId = auditoria.UsuarioId,
                    LoginTime = auditoria.LoginTime,
                    LogoutTime = auditoria.LogoutTime,
                    Ip = auditoria.Ip,
                    Navegador = auditoria.Navegador
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener la auditoria con ID {id}", ex);
            }
        }

        public async Task<UsuarioAuditDTO> AddAsync(UsuarioAuditReqDTO auditDTO, HttpContext httpContext)
        {
            try
            {
                var auditoria = new UsuarioAudit
                {
                    UsuarioId = auditDTO.UsuarioId,
                    LoginTime = DateTime.Now,
                    Ip = GetClientIp(httpContext),
                    Navegador = GetUserAgent(httpContext)

                };
                await _repository.AddAsync(auditoria);

                return new UsuarioAuditDTO
                {
                    Id = auditoria.Id,
                    UsuarioId = auditDTO.UsuarioId,
                    LoginTime = auditoria.LoginTime,
                    LogoutTime = auditoria.LogoutTime,
                    Ip = auditoria.Ip,
                    Navegador = auditoria.Navegador
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar una nueva auditoria", ex);
            }
        }
        /*
        * El update solo se usa para acentar el horario de loguot del usuario
        */
        public async Task<UsuarioAuditDTO> UpdateAsync(UsuarioAuditReqDTO auditDTO)
        {
            try
            {   
                var auditoria = await _repository.GetByUserIdAsync(auditDTO);
                if (auditoria == null) return null!;
                auditoria.UsuarioId = auditDTO.UsuarioId;
                auditoria.LogoutTime = DateTime.Now; //actualiza el horario de logout
     

                await _repository.UpdateAsync(auditoria);
                return new UsuarioAuditDTO
                {
                    Id = auditoria.Id,
                    UsuarioId = auditoria.UsuarioId,
                    LoginTime = auditoria.LoginTime,
                    LogoutTime = auditoria.LogoutTime,
                    Ip = auditoria.Ip,
                    Navegador = auditoria.Navegador
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar la auditoria del usuarioId {auditDTO.UsuarioId}", ex);
            }
        }
        /*
        * Solo uso administrativo. No se utilizara en interface de usuario.
        */
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var auditoria = await _repository.GetByIdAsync(id);
                if (auditoria == null) return false;
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
                throw new Exception($"Error al eliminar la sucursal con ID {id}", ex);
            }
        }
        public async Task<List<UsuarioAuditRespDTO>> GetSessionByUserIdAsync(int usuarioId)
        {
            try
            {
                return (await _repository.GetSessionByUserIdAsync(usuarioId))
                .Select(s => new UsuarioAuditRespDTO
                {
                    Id = s.Id,
                    UsuarioId = s.UsuarioId,
                    LoginTime = s.LoginTime,
                    LogoutTime = s.LogoutTime,
                    Ip = s.Ip,
                    Navegador = s.Navegador

                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener auditorias delk usuario", ex);
            }
        }

        /*
        * Metodos de identificadion interna de IP y Navegador
        */
        private string GetClientIp(HttpContext httpContext)
        {
            var ip = httpContext.Connection.RemoteIpAddress?.ToString();

            if (httpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ip = httpContext.Request.Headers["X-Forwarded-For"].ToString().Split(',')[0];
            }

            return ip ?? "Desconocido";
        }
        private string GetUserAgent(HttpContext httpContext)
        {
            return httpContext.Request.Headers["User-Agent"].ToString();
        }

    }
}
