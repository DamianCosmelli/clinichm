using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Http;

namespace clinichm_api.Tests;

public class UsuarioControllerTests
{
      public UsuarioControllerTests()
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
    // Servicio en memoria de Auth
    public class AuthServiceInMemory : IAuthService
    {
        public string AuthToken(UsuarioFullDTO usuario, string rol, string sucursal) =>
            $"mocked_token_for_{usuario.UserName}";
    }

    // Simula un error en la generación del token
    public class AuthServiceWithError : IAuthService
    {
        public string AuthToken(UsuarioFullDTO usuario, string rol, string sucursal) =>
            throw new Exception("Error en el servicio de autenticación");
    }

    [Fact]
    public async Task Create_DeberiaCrearUsuario()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);
        // Act
        var UsuarioDto = new UsuarioDTO { UserName = "user100", Nombre = "Adrian", Apellido = "Peralta", Password = "pass123", RolId = 1, Celular = "1155556759", SucursalID = 1 };
        var result = await controller.Create(UsuarioDto);
        var actionResult = Assert.IsType<ActionResult<UsuarioResponseDTO>>(result);

        // Assert
        var usuario = await usuarioService.GetAllAsync();
        Assert.Single(usuario);
        Assert.Equal("Adrian", usuario.First().Nombre);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDeUsuarios()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        context.Usuario.AddRange(
            new Usuario { UserName = "user1", Nombre = "Adrian", Apellido = "Peralta", Password = "pass123", RolId = 1, Celular = "1155556759", SucursalID = 1 },
            new Usuario { UserName = "user2", Nombre = "Carlos", Apellido = "Ramirez", Password = "pass456", RolId = 1, Celular = "1155559077", SucursalID = 1 }
            );
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<UsuarioResponseDTO>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdUsuario()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        var nuevoUsuario = new Usuario { UserName = "user1", Nombre = "Adrian", Apellido = "Peralta", Password = "pass123", RolId = 1, Celular = "1155556759", SucursalID = 1 };
        context.Usuario.Add(nuevoUsuario);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetById(nuevoUsuario.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<UsuarioResponseDTO>(actionResult.Value);
        Assert.Equal("Adrian", returnValue.Nombre);

    }

    [Fact]
    public async Task Update_DeberiaActualizarRol()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        var existeUsuario = new Usuario { UserName = "user1", Nombre = "Adrian", Apellido = "Peralta", Password = "pass123", RolId = 1, Celular = "1155556759", SucursalID = 1 };
        context.Usuario.Add(existeUsuario);
        await context.SaveChangesAsync();

        // Nuevo registro actualizado
        var nuevoUsuarioDto = new UsuarioDTO { UserName = "GeneralUSer34", Nombre = "Juan", Apellido = "Giles", Password = "pass123", RolId = 4, Celular = "1155556759", SucursalID = 2 };

        // Act
        await controller.Update(existeUsuario.Id, nuevoUsuarioDto);

        // Assert
        var usuario = await usuarioService.GetByIdAsync(existeUsuario.Id);
        Assert.Equal("Juan", usuario?.Nombre);
        Assert.Equal("GeneralUSer34", usuario?.UserName);
        Assert.Equal(4, usuario?.RolId);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarUsuario()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        var existeUsuario = new Usuario { UserName = "user1", Nombre = "Adrian", Apellido = "Peralta", Password = "pass123", RolId = 1, Celular = "1155556759", SucursalID = 1 };
        context.Usuario.Add(existeUsuario);
        await context.SaveChangesAsync();

        // Act
        await controller.Delete(existeUsuario.Id);

        // Assert
        var usuarios = await usuarioService.GetAllAsync();
        Assert.Empty(usuarios);
    }

    [Fact]
    public async Task GetUsuarioPass_DeberiaTraerPassxIdUsuario()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1};
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await usuarioService.AddAsync(usuarioReq0);

        // Act
        var usuarioreq = new UsuarioPassRequestDTO { Id = 1 };
        var result = await controller.GetUsuarioPass(id: 1, username: null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var usuario = Assert.IsType<UsuarioPassResponseDTO>(okResult.Value);
        Assert.Equal("user1", usuario.UserName);
        Assert.NotNull(usuario.Password);

    }
    [Fact]
    public async Task GetUsuarioPass_DeberiaRetornarUsuario_CuandoUsernameExiste()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Setup test
        var Usuario = new Usuario {UserName="user1", Nombre = "Adrian", Apellido = "Peralta", Password="pass123", RolId=1, Celular="1155556759", SucursalID=1};
        var usuarioReq0 = new UsuarioDTO { UserName=Usuario.UserName, Apellido=Usuario.Apellido,Password=Usuario.Password, RolId=Usuario.RolId, Celular=Usuario.Celular, SucursalID=Usuario.SucursalID, Nombre=Usuario.Nombre};
        var us = await usuarioService.AddAsync(usuarioReq0);

        // Act
        var result = await controller.GetUsuarioPass(id: null, username: Usuario.UserName);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var usuario = Assert.IsType<UsuarioPassResponseDTO>(okResult.Value);

        Assert.Equal("user1", usuario.UserName);
        Assert.NotNull(usuario.Password);
    }

    [Fact]
    public async Task GetUsuarioPass_DeberiaRetornarNotFound_CuandoUsuarioNoExiste()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Act
        var result = await controller.GetUsuarioPass(id: 999, username: null);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetUsuarioPass_DeberiaRetornarBadRequest_CuandoNoSeEnviaIdNiUsername()
    {
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);


        // Act
        var result = await controller.GetUsuarioPass(id: null, username: null);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
    [Fact]
    public async Task Login_DeberiaRetornarToken_CuandoCredencialesSonCorrectas()
    {
        // Arrange
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);

        // Mock HttpContext
        var httpContext = new DefaultHttpContext();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        // Se agrega un rol y usuario en memoria
        var rol = new Rol { Id = 1, Nombre = "Admin" };
        var sucursal = new Sucursales { Id = 1, Nombre = "Flores", Direccion = "Gaona 3707", Ciudad = "CABA", CodigoPostal = "1467" };
        await context.Rol.AddAsync(rol);
        await context.Sucursales.AddAsync(sucursal);
        await context.SaveChangesAsync();

        var usuario = new UsuarioDTO
        {
            UserName = "user100",
            Nombre = "Adrian",
            Apellido = "Peralta",
            Password = "pass123", // Hash de la contraseña
            RolId = 1,
            Celular = "1155556759",
            SucursalID = 1
        };

        //var createUsuario = await controller.Create(usuario);
        var createUsuario = await usuarioService.AddAsync(usuario);

        var loginDto = new UsuarioAuthDTO { UserName = "user100", Password = "pass123" };

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as dynamic;
        Assert.NotNull(response?.GetType().GetProperty("Token"));
    }

    [Fact]
    public async Task Login_DeberiaRetornarUnauthorized_CuandoUsuarioNoExiste()
    {
        // Arrange
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        var loginDto = new UsuarioAuthDTO { UserName = "noexiste", Password = "pass123" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.Login(loginDto));
        Assert.Equal("Usuario o contraseña incorrectos", exception.Message);
    }

    [Fact]
    public async Task Login_DeberiaRetornarUnauthorized_CuandoPasswordEsIncorrecta()
    {
        // Arrange
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceInMemory();
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Se agrega un rol y usuario en memoria
        var rol = new Rol { Id = 1, Nombre = "Admin" };
        await context.Rol.AddAsync(rol);
        await context.SaveChangesAsync();

        var usuarioDto = new UsuarioDTO
        {
            UserName = "user100",
            Nombre = "Adrian",
            Apellido = "Peralta",
            Password = BCrypt.Net.BCrypt.HashPassword("pass123"), // Hash correcto
            RolId = 1,
            Celular = "1155556759",
            SucursalID = 1
        };
        await usuarioService.AddAsync(usuarioDto);

        var loginDto = new UsuarioAuthDTO { UserName = "user100", Password = "wrongpassword" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.Login(loginDto));
        Assert.Equal("Usuario o contraseña incorrectos", exception.Message);
    }

    [Fact]
    public async Task Login_DeberiaRetornarErrorInterno_CuandoOcurreUnaExcepcion()
    {
        // Arrange
        using var context = CreateNewContext();
        var usuarioService = new UsuarioServices(new UsuarioRepository(context));
        var authService = new AuthServiceWithError(); // Servicio que genera un error
        var rolService = new RolServices(new Repository<Rol>(context));
        var sucursalService = new SucursalServices(new Repository<Sucursales>(context));
        var usuarioAudit = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioController(usuarioService, authService, rolService, sucursalService, usuarioAudit);



        // Se agrega un rol y usuario en memoria
        var rol = new Rol { Id = 1, Nombre = "Admin" };
        await context.Rol.AddAsync(rol);
        await context.SaveChangesAsync();

        var usuarioDto = new UsuarioDTO
        {
            UserName = "user100",
            Nombre = "Adrian",
            Apellido = "Peralta",
            Password = BCrypt.Net.BCrypt.HashPassword("pass123"),
            RolId = 1,
            Celular = "1155556759",
            SucursalID = 1
        };
        await usuarioService.AddAsync(usuarioDto);

        var loginDto = new UsuarioAuthDTO { UserName = "user100", Password = "pass123" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.Login(loginDto));
        Assert.Equal("Usuario o contraseña incorrectos", exception.Message);
    }
}