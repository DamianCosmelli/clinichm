using System.IdentityModel.Tokens.Jwt;
using System.Text;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace clinichm_api.Tests;
public class AuthServicesTests
{
    private readonly AuthServices _authService;

    public AuthServicesTests()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "Jwt:SecretKey", "ClinichmUnitTestverifyDebetener32digitosMinimo" }
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();
        
        _authService = new AuthServices(configuration);
    }

    [Fact]
    public void AuthToken_DeberiaGenerarValidJwtToken()
    {
        // Arrange
        var usuario = new UsuarioFullDTO { UserName = "testuser" };
        var rol = "Admin";
        var sucursal = "Flores";

        // Act
        var token = _authService.AuthToken(usuario, rol, sucursal);

        // Assert
        Assert.False(string.IsNullOrEmpty(token));
        // escribe el token por fuera del metodo para validar el mismo
        // con el obtenido del metodo en testing
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("ClinichmUnitTestverifyDebetener32digitosMinimo");
        var validations = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        
        tokenHandler.ValidateToken(token, validations, out SecurityToken validatedToken);
        Assert.NotNull(validatedToken);
    }

}