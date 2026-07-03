using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class RolControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));
        var controller = new RolController(service);

        // Act
        var rolDto = new RolDTO { Nombre = "Admin", Descripcion = "Administracion" };
        var result = await controller.Create(rolDto);
        var actionResult = Assert.IsType<CreatedAtActionResult>(result);

        // Assert
        var rol = await service.GetAllAsync();
        Assert.Single(rol);
        Assert.Equal("Admin", rol.First().Nombre);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDeRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));
        var controller = new RolController(service);

        // Setup test
        context.Rol.AddRange(new Rol { Nombre = "Admin", Descripcion = "Administrador" },
                             new Rol { Nombre = "User", Descripcion = "Usuario" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<RolResponseDTO>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));
        var controller = new RolController(service);

        // Setup test
        var nuevoRol = new Rol { Nombre = "Visualizador", Descripcion = "Visualizador" };
        context.Rol.Add(nuevoRol);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetById(nuevoRol.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<RolResponseDTO>(actionResult.Value);
        Assert.Equal("Visualizador", returnValue.Nombre);
    }

    [Fact]
    public async Task Update_DeberiaActualizarRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));
        var controller = new RolController(service);

        // Setup test
        var rolExistente = new Rol { Id=1, Nombre = "Redactor", Descripcion = "Redactor" };
        context.Rol.Add(rolExistente);
        await context.SaveChangesAsync();

        // Nuevo registro actualizado
        var rolDto = new RolDTO { Nombre = "Admin", Descripcion = "Administracion" };

        // Act
        await controller.Update(rolExistente.Id, rolDto);

        // Assert
        var rol = await service.GetByIdAsync(rolExistente.Id);
        Assert.Equal("Admin", rol?.Nombre);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));
        var controller = new RolController(service);

        // Setup test
        var rolExistente = new Rol { Nombre = "Lector", Descripcion = "Lector" };
        context.Rol.Add(rolExistente);
        await context.SaveChangesAsync();

        // Act
        await controller.Delete(rolExistente.Id);

        // Assert
        var rol = await service.GetAllAsync();
        Assert.Empty(rol);
    }
}
