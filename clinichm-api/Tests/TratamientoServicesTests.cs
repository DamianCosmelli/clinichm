using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class TratamientoServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfTratamientos()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        context.Tratamientos.AddRange(new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 },
                                      new Tratamientos { NombreTratamiento = "Tratamiento2", Descripcion = "Descripcion2", SucursalId = 2, PrecioEfectivo = 200, PrecioOtrosMediosDePago = 220, Comision = 20, ComisionEncargado = 10 });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsTratamientoDTO()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        var tratamiento = new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(tratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(tratamiento.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tratamiento1", result.NombreTratamiento);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidTratamientoDTO_CreatesTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        var tratamientoDto = new TratamientoDTO { NombreTratamiento = "Tratamiento3", Descripcion = "Descripcion3", SucursalId = 3, PrecioEfectivo = 300, PrecioOtrosMediosDePago = 330, Comision = 30, ComisionEncargado = 15 };

        // Act
        await service.AddAsync(tratamientoDto);
        var result = await context.Tratamientos.FirstOrDefaultAsync(t => t.NombreTratamiento == "Tratamiento3");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tratamiento3", result.NombreTratamiento);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        var tratamiento = new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(tratamiento);
        await context.SaveChangesAsync();

        var tratamientoDto = new TratamientoDTO { NombreTratamiento = "TratamientoActualizado", Descripcion = "DescripcionActualizada", SucursalId = 4, PrecioEfectivo = 150, PrecioOtrosMediosDePago = 165, Comision = 15, ComisionEncargado = 7.5M };

        // Act
        var result = await service.UpdateAsync(tratamiento.Id, tratamientoDto);
        var updatedTratamiento = await context.Tratamientos.FindAsync(tratamiento.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("TratamientoActualizado", updatedTratamiento?.NombreTratamiento);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        var tratamientoDto = new TratamientoDTO { NombreTratamiento = "TratamientoActualizado", Descripcion = "DescripcionActualizada", SucursalId = 3, PrecioEfectivo = 150, PrecioOtrosMediosDePago = 165, Comision = 15, ComisionEncargado = 7.5M };

        // Act
        var result = await service.UpdateAsync(99, tratamientoDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Setup test
        var tratamiento = new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(tratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(tratamiento.Id);
        var deletedTratamiento = await context.Tratamientos.FindAsync(tratamiento.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedTratamiento);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}