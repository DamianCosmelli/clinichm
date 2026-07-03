using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class EstadoTurnosServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfEstadoTurnos()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        context.EstadosTurnos.AddRange(new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" },
                                       new EstadosTurnos { Estado = "Confirmado", Descripcion = "Turno confirmado", Color = "#00FF00" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsEstadoTurnosDTO()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        var estadoTurno = new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" };
        context.EstadosTurnos.Add(estadoTurno);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(estadoTurno.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Pendiente", result.Estado);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidEstadoTurnosDTO_CreatesEstadoTurnos()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        var estadoTurnoDto = new EstadoTurnoDTO { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" };

        // Act
        await service.AddAsync(estadoTurnoDto);
        var result = await context.EstadosTurnos.FirstOrDefaultAsync(et => et.Estado == "Pendiente");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Pendiente", result.Estado);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesEstadoTurnos()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        var estadoTurno = new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" };
        context.EstadosTurnos.Add(estadoTurno);
        await context.SaveChangesAsync();

        var estadoTurnoDto = new EstadoTurnoDTO { Estado = "Confirmado", Descripcion = "Turno confirmado", Color = "#00FF00" };

        // Act
        var result = await service.UpdateAsync(estadoTurno.Id, estadoTurnoDto);
        var updatedEstadoTurno = await context.EstadosTurnos.FindAsync(estadoTurno.Id);

        // Assert
        Assert.Equal("Confirmado", updatedEstadoTurno?.Estado);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        var estadoTurnoDto = new EstadoTurnoDTO { Estado = "Confirmado", Descripcion = "Turno confirmado", Color = "#00FF00" };

        // Act
        var result = await service.UpdateAsync(99, estadoTurnoDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesEstadoTurnos()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Setup test
        var estadoTurno = new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" };
        context.EstadosTurnos.Add(estadoTurno);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(estadoTurno.Id);
        var deletedEstadoTurno = await context.EstadosTurnos.FindAsync(estadoTurno.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedEstadoTurno);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
