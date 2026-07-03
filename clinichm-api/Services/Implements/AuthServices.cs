using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.IdentityModel.Tokens;

namespace clinichm_api.Services
{
     public class AuthServices : IAuthService
    {
        private readonly string _secretKey;

        public AuthServices(IConfiguration configuration)
        {
            _secretKey = configuration["Jwt:SecretKey"] ?? throw new ArgumentNullException("Jwt:SecretKey no está configurado");
        }
        
        public string AuthToken(UsuarioFullDTO usuario, string rol, string sucursal)
        {
            try
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, usuario.UserName ?? ""),
                    new Claim(ClaimTypes.Role, rol),
                    new Claim("RolID", usuario.RolId.ToString()),
                    new Claim("UsuarioId", usuario.Id.ToString()),
                    new Claim("Sucursal", sucursal),
                    new Claim("SucursalId", usuario.SucursalID.ToString())                    
                    
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: "clinichm_api",
                    audience: "clinichm_api",
                    claims: claims,
                    expires: DateTime.Now.AddHours(1),
                    signingCredentials: creds
                );
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener token JWT", ex);
            }
        }
    }
}
