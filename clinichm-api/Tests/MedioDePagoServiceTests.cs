using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class MedioDePagoServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        context.MedioDePago.AddRange(new MedioDePago { MedioPago = "Tarjeta" },
                                     new MedioDePago { MedioPago = "Efectivo" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsMedioDePagoDTO()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(medioDePago.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tarjeta", result.MedioPago);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidMedioDePagoDTO_CreatesMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        var medioDePagoDto = new MedioDePagoDTO { MedioPago = "Tarjeta" };

        // Act
        await service.AddAsync(medioDePagoDto);
        var result = await context.MedioDePago.FirstOrDefaultAsync(m => m.MedioPago == "Tarjeta");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Tarjeta", result.MedioPago);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();
        var medioDePagoDto = new MedioDePagoDTO { MedioPago = "Efectivo" };

        // Act
        var result = await service.UpdateAsync(medioDePago.Id, medioDePagoDto);
        var updatedMedioDePago = await context.MedioDePago.FindAsync(medioDePago.Id);

        // Assert
        Assert.Equal("Efectivo", updatedMedioDePago?.MedioPago);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        var medioDePagoDto = new MedioDePagoDTO { MedioPago = "Efectivo" };

        // Act
        var result = await service.UpdateAsync(99, medioDePagoDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(medioDePago.Id);
        var deletedMedioDePago = await context.MedioDePago.FindAsync(medioDePago.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedMedioDePago);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
