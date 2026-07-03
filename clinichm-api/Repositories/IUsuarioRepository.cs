using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using System.Threading.Tasks;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByIdOrUsernameAsync(UsuarioPassRequestDTO usuarioDTO);
    Task<Usuario?> GetByUserNameAsync(UsuarioAuthDTO usuarioDTO);
}