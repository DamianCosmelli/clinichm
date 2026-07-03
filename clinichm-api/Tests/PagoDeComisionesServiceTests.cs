using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class PagoDeComisionesServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        context.PagoDeComisiones.AddRange(new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 },
                                          new PagoDeComisiones { MedicoId = 2, FechaDePago = DateTime.Now, MetodoDePago = "Efectivo", Monto = 200, CierreDeCajaId = 2 });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsPagoDeComisionesDTO()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(pagoDeComisiones.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tarjeta", result.MetodoDePago);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidPagoDeComisionesDTO_CreatesPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        var pagoDeComisionesDto = new PagoDeComisionesDTO { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };

        // Act
        await service.AddAsync(pagoDeComisionesDto);
        var result = await context.PagoDeComisiones.FirstOrDefaultAsync(p => p.MetodoDePago == "Tarjeta");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tarjeta", result.MetodoDePago);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();
        var pagoDeComisionesDto = new PagoDeComisionesDTO { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Efectivo", Monto = 200, CierreDeCajaId = 1 };

        // Act
        var result = await service.UpdateAsync(pagoDeComisiones.Id, pagoDeComisionesDto);
        var updatedPagoDeComisiones = await context.PagoDeComisiones.FindAsync(pagoDeComisiones.Id);

        // Assert
        Assert.Equal("Efectivo", updatedPagoDeComisiones?.MetodoDePago);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        var pagoDeComisionesDto = new PagoDeComisionesDTO { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Efectivo", Monto = 200, CierreDeCajaId = 1 };

        // Act
        var result = await service.UpdateAsync(99, pagoDeComisionesDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(pagoDeComisiones.Id);
        var deletedPagoDeComisiones = await context.PagoDeComisiones.FindAsync(pagoDeComisiones.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedPagoDeComisiones);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
