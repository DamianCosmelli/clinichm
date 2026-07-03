using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IUsuarioAuditService
    {
        Task<IEnumerable<UsuarioAuditDTO>> GetAllAsync();
        Task<UsuarioAuditDTO?> GetByIdAsync(int id);
        Task<UsuarioAuditDTO> AddAsync(UsuarioAuditReqDTO auditoriaDto, HttpContext httpContext);
        Task<UsuarioAuditDTO> UpdateAsync(UsuarioAuditReqDTO auditoriaDto);
        Task<bool> DeleteAsync(int id);
        Task<List<UsuarioAuditRespDTO>> GetSessionByUserIdAsync(int usuarioId);
    }
}