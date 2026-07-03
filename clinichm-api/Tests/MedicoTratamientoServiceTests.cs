using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class MedicoTratamientoServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        context.MedicoTratamiento.AddRange(new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        },
        new MedicoTratamiento
        {
            MedicoId = 2,
            TratamientoId = 2
        });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsMedicoTratamientoDTO()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(medicoTratamiento.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.MedicoId);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidMedicoTratamientoDTO_CreatesMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        var medicoTratamientoDto = new MedicoTratamientoDTO
        {
            MedicoId = 1,
            TratamientoId = 1
        };

        // Act
        await service.AddAsync(medicoTratamientoDto);
        var result = await context.MedicoTratamiento.FirstOrDefaultAsync(mt => mt.MedicoId == 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.MedicoId);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();
        var medicoTratamientoDto = new MedicoTratamientoDTO
        {
            MedicoId = 2,
            TratamientoId = 2
        };

        // Act
        var result = await service.UpdateAsync(medicoTratamiento.Id, medicoTratamientoDto);
        var updatedMedicoTratamiento = await context.MedicoTratamiento.FindAsync(medicoTratamiento.Id);

        // Assert
        Assert.Equal(2, updatedMedicoTratamiento?.MedicoId);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        var medicoTratamientoDto = new MedicoTratamientoDTO
        {
            MedicoId = 2,
            TratamientoId = 2
        };

        // Act
        var result = await service.UpdateAsync(99, medicoTratamientoDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(medicoTratamiento.Id);
        var deletedMedicoTratamiento = await context.MedicoTratamiento.FindAsync(medicoTratamiento.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedMedicoTratamiento);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
