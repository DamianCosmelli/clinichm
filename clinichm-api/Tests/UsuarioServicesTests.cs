using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class UsuarioServicesTests
{
    public UsuarioServicesTests()
    {
        // Ensure EncryptionHelper is initialized for all tests
        var encryptionSettings = Microsoft.Extensions.Options.Options.Create(
            new EncryptionSettings
            {
                Key = "TestEncryptionKey123456789012345",
                IV = "TestIV1234567890"
            } 
        );
        EncryptionHelper.Initialize(encryptionSettings); // Use a 32-char key for AES-256
    }

    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfUsuarios()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        context.Usuario.AddRange(
            new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759" , SucursalID=1},
            new Usuario {UserName="user2", Nombre = "Carlos", Apellido = "Ramirez", Password="pass456", RolId=1, Celular="1155559077", SucursalID=1 }
            );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsUsuarioDTO()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };
        context.Usuario.Add(Usuario);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(Usuario.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Adrian", result.Nombre);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdOrUsernameAsync_ExistingIdAndUserName_ReturnsUsuarioPassDTO()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1};
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await service.AddAsync(usuarioReq0);

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {Id=us!.Id, UserName=Usuario.UserName};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("user1", result.UserName);
        Assert.Equal(Usuario.Password, result.Password);
    }

        [Fact]
    public async Task GetByIdOrUsernameAsync_ExistingIdOnly_ReturnsUsuarioPassDTO()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1};
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await service.AddAsync(usuarioReq0);

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {Id=us!.Id};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("user1", result.UserName);
        Assert.Equal(Usuario.Password, result.Password);
    }
            [Fact]
    public async Task GetByIdOrUsernameAsync_ExistingUserNameOnly_ReturnsUsuarioPassDTO()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1};
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await service.AddAsync(usuarioReq0);

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {UserName=Usuario.UserName};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("user1", result.UserName);
        Assert.Equal(Usuario.Password, result.Password);
    }

    [Fact]
    public async Task GetByIdOrUsernameAsync_NonExistingIdandUsername_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {Id=99, UserName="Juan"};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.Null(result);
    }
    [Fact]    
    public async Task GetByIdOrUsernameAsync_NonExistingIdOnly_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {Id=99};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.Null(result);
    }
        
    [Fact]
    public async Task GetByIdOrUsernameAsync_NonExistingUserNameOnly_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Act
        var usuarioReq = new UsuarioPassRequestDTO {UserName="Juan"};
        var result = await service.GetByIdOrUsernameAsync(usuarioReq);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidUsuarioDTO_CreatesUsuario()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var UsuarioDto = new UsuarioDTO {UserName="user100", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };

        // Act
        await service.AddAsync(UsuarioDto);
        var result = await context.Usuario.FirstOrDefaultAsync(r => r.UserName == "user100");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("user100", result.UserName);
        Assert.Equal("Adrian", result.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesUsuario()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user100", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };
        context.Usuario.Add(Usuario);
        await context.SaveChangesAsync();

        var UsuarioDto = new UsuarioDTO {UserName="NewUser200", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=2, Celular="02355550909" , SucursalID=1};

        // Act
        var result = await service.UpdateAsync(Usuario.Id, UsuarioDto);
        var updatedUsuario = await context.Usuario.FindAsync(Usuario.Id);

        // Assert
        Assert.Equal("NewUser200", updatedUsuario?.UserName);
        Assert.Equal("02355550909", updatedUsuario?.Celular);
        Assert.Equal(2, updatedUsuario?.RolId);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var UsuarioDto = new UsuarioDTO {UserName="user100", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };

        // Act
        var result = await service.UpdateAsync(99, UsuarioDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesUsuario()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user100", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };
        context.Usuario.Add(Usuario);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(Usuario.Id);
        var deletedUsuario = await context.Usuario.FindAsync(Usuario.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedUsuario);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }


    [Fact]
    public async Task GetByUserNameAsync_ExistingUsaerName_ReturnsUsuarioDTO()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));

        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1 };
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await service.AddAsync(usuarioReq0);

        var usuarioAuthDTO = new UsuarioAuthDTO{UserName=Usuario.UserName, Password=Usuario.Password};

        // Act
        var result = await service.GetByUserNameAsync(usuarioAuthDTO);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Adrian", result.Nombre);
        Assert.Equal("user1", result.UserName);
        Assert.Equal(1, result.RolId);
    }

    [Fact]
    public async Task GetByUserNameAsync_NonExistingUserName_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new UsuarioServices(new UsuarioRepository(context));
        
        // Setup test
        var usuarioAuthDTO = new UsuarioAuthDTO{UserName="Jaime", Password="Siempre500"};

        // Act
        var result = await service.GetByUserNameAsync(usuarioAuthDTO);

        // Assert
        Assert.Null(result);
    }

}
