using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class SucursalServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfSucursales()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        context.Sucursales.AddRange(
            new Sucursales { Nombre = "flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"},
            new Sucursales { Nombre = "nordelta",Ciudad="GBA",Direccion="Capibara 123", CodigoPostal="9078" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsSucursalDTO()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        var sucursal = new Sucursales { Nombre = "flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"};
        context.Sucursales.Add(sucursal);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(sucursal.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("flores", result.Nombre);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidSucursalDTO_CreatesSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        var sucursalDto = new SucursalDTO { Nombre = "Nordelta",Ciudad="GBA",Direccion="Capibara 123", CodigoPostal="9078" };

        // Act
        await service.AddAsync(sucursalDto);
        var result = await context.Sucursales.FirstOrDefaultAsync(s => s.Nombre == "Nordelta");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Nordelta", result.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        var sucursal = new Sucursales { Nombre = "flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"};
        context.Sucursales.Add(sucursal);
        await context.SaveChangesAsync();
        var sucursalDto = new SucursalDTO { Nombre = "Flores",Ciudad="CABA",Direccion="Siempre viva 893", CodigoPostal="9090"};

        // Act
        var result = await service.UpdateAsync(sucursal.Id, sucursalDto);
        var updatedSucursal = await context.Sucursales.FindAsync(sucursal.Id);

        // Assert
        Assert.Equal("Flores", updatedSucursal?.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        var sucursalDto = new SucursalDTO { Nombre = "lomas" };

        // Act
        var result = await service.UpdateAsync(99, sucursalDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Setup test
        var sucursal = new Sucursales { Nombre = "Lommas",Ciudad="GBA",Direccion="Florida 123", CodigoPostal="5678"};
        context.Sucursales.Add(sucursal);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(sucursal.Id);
        var deletedSucursal = await context.Sucursales.FindAsync(sucursal.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedSucursal);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
