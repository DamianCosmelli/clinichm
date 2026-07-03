using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using System.Threading.Tasks;

public interface IUsuarioAuditRepository : IRepository<UsuarioAudit>
{
    Task<UsuarioAudit?> GetByUserIdAsync(UsuarioAuditReqDTO auditoriaDTO);

    Task<List<UsuarioAudit>> GetSessionByUserIdAsync(int usuarioId);
}