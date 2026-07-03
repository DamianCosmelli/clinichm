using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class RolServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfRoles()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        context.Rol.AddRange(new Rol { Nombre = "Admin", Descripcion = "Administrador" },
                             new Rol { Nombre = "User", Descripcion = "Usuario" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsRolDTO()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        var rol = new Rol { Nombre = "Admin", Descripcion = "Administrador" };
        context.Rol.Add(rol);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(rol.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Admin", result.Nombre);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidRolDTO_CreatesRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        var rolDto = new RolDTO { Nombre = "Editor", Descripcion = "Edita contenido" };

        // Act
        await service.AddAsync(rolDto);
        var result = await context.Rol.FirstOrDefaultAsync(r => r.Nombre == "Editor");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Editor", result.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        var rol = new Rol { Nombre = "User", Descripcion = "Usuario" };
        context.Rol.Add(rol);
        await context.SaveChangesAsync();

        var rolDto = new RolDTO { Nombre = "SuperUser", Descripcion = "Super Usuario" };

        // Act
        var result = await service.UpdateAsync(rol.Id, rolDto);
        var updatedRol = await context.Rol.FindAsync(rol.Id);

        // Assert
        Assert.Equal("SuperUser", updatedRol?.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        var rolDto = new RolDTO { Nombre = "SuperUser", Descripcion = "Super Usuario" };

        // Act
        var result = await service.UpdateAsync(99, rolDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesRol()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Setup test
        var rol = new Rol { Nombre = "Admin", Descripcion = "Administrador" };
        context.Rol.Add(rol);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(rol.Id);
        var deletedRol = await context.Rol.FindAsync(rol.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedRol);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new RolServices(new Repository<Rol>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
