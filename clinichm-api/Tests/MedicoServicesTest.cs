using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class MedicoServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfMedicos()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        context.Medicos.AddRange(new Medicos { Nombre = "Juan", Apellido = "Perez", Matricula = "1234", SucursalId = 1 },
                                 new Medicos { Nombre = "Pedro", Apellido = "Lopez", Matricula = "1274", SucursalId = 1});
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsMedicoDTO()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        var medico = new Medicos { Nombre = "Juan", Apellido = "Perez", Matricula = "1234", SucursalId = 1 };
        context.Medicos.Add(medico);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(medico.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Juan", result.Nombre);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidMedicoDTO_CreatesMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        var medicoDto = new MedicoDTO { Nombre = "Nicolas", Apellido = "Gomez", Matricula = "1234", SucursalId = 2};

        // Act
        await service.AddAsync(medicoDto);
        var result = await context.Medicos.FirstOrDefaultAsync(m => m.Nombre == "Nicolas");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Nicolas", result.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        var medico = new Medicos { Nombre = "Nicolas", Apellido = "Gomez", Matricula = "1234", SucursalId = 1 };
        context.Medicos.Add(medico);
        await context.SaveChangesAsync();
        var medicoDto = new MedicoDTO { Nombre = "Nicolas", Apellido = "Gomez", Matricula = "1234", SucursalId = 2};

        // Act
        var result = await service.UpdateAsync(medico.Id, medicoDto);
        var updatedMedico = await context.Medicos.FindAsync(medico.Id);

        // Assert
        Assert.Equal(2, updatedMedico?.SucursalId);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        var medicoDto = new MedicoDTO { Nombre = "Nicolas", Apellido = "Gomez", Matricula = "1234", SucursalId = 2 };

        // Act
        var result = await service.UpdateAsync(99, medicoDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Setup test
        var medico = new Medicos { Nombre = "Nicolas", Apellido = "Gomez", Matricula = "1234", SucursalId = 2 };
        context.Medicos.Add(medico);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(medico.Id);
        var deletedMedico = await context.Medicos.FindAsync(medico.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedMedico);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}