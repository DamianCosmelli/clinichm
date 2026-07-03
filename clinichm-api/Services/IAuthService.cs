using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IAuthService
    {
        string AuthToken(UsuarioFullDTO usuario, string rol, string sucursal);
    }
}