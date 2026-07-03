using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResponseDTO>> GetAllAsync();
        Task<UsuarioResponseDTO?> GetByIdAsync(int id);
        Task<UsuarioResponseDTO?> AddAsync(UsuarioDTO usuarioDTO);
        Task<UsuarioResponseDTO> UpdateAsync(int id, UsuarioDTO usuarioDTO);
        Task<bool> DeleteAsync(int id);
        Task<UsuarioPassResponseDTO?> GetByIdOrUsernameAsync(UsuarioPassRequestDTO usuarioPassRequest);
        Task<UsuarioFullDTO?> GetByUserNameAsync(UsuarioAuthDTO usuarioRequest);
        Task<UsuarioAuthDTO?> ChangePassAsync(UsuarioCambioPassDTO usuarioRequest);
    }
}