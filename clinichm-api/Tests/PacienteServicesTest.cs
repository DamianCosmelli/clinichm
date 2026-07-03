using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class PacienteServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfPacientes()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        context.Pacientes.AddRange(new Pacientes { Nombre = "Luis", Apellido = "Badia", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" },
                                   new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsPacienteDTO()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var paciente = new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };
        context.Pacientes.Add(paciente);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(paciente.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Badia", result.Nombre);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidPacienteDTO_CreatesPacientes()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var pacienteDto = new PacienteDTO { Nombre = "Badia", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };

        // Act
        await service.AddAsync(pacienteDto);
        var result = await context.Pacientes.FirstOrDefaultAsync(p => p.Nombre == "Badia");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Badia", result.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var paciente = new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };
        context.Pacientes.Add(paciente);
        await context.SaveChangesAsync();
        var pacienteDto = new PacienteDTO { Nombre = "Jorge", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };

        // Act
        var result = await service.UpdateAsync(paciente.Id, pacienteDto);
        var updatedPaciente = await context.Pacientes.FindAsync(paciente.Id);

        // Assert
        Assert.Equal("Jorge", updatedPaciente?.Nombre);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var pacienteDto = new PacienteDTO { Nombre = "Jorge", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };

        // Act
        var result = await service.UpdateAsync(99, pacienteDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var paciente = new Pacientes { Nombre = "Jorge", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };
        context.Pacientes.Add(paciente);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(paciente.Id);
        var deletedPaciente = await context.Pacientes.FindAsync(paciente.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedPaciente);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetPacientesPorMedicoAsync_ReturnsPacientesGroupedByMedico()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        context.RecepcionPacientes.AddRange(
            new RecepcionPacientes { PacienteId = 1, MedicoId = 1 , EstadoRecepcion = "En Espera"},
            new RecepcionPacientes { PacienteId = 2, MedicoId = 1 , EstadoRecepcion = "En Espera"},
            new RecepcionPacientes { PacienteId = 3, MedicoId = 2, EstadoRecepcion = "En Espera" }
        );
        context.Pacientes.AddRange(
            new Pacientes { Id = 1, Nombre = "Juan", Apellido = "Perez", Celular = "123456789", Email = "juan.perez@example.com", DNI = "12345678", Direccion = "Calle Falsa 123", CodigoPostal = "1234", MedioPublicidad = "Internet" },
            new Pacientes { Id = 2, Nombre = "Maria", Apellido = "Gomez", Celular = "987654321", Email = "maria.gomez@example.com", DNI = "87654321", Direccion = "Avenida Siempre Viva 456", CodigoPostal = "5678", MedioPublicidad = "TV" },
            new Pacientes { Id = 3, Nombre = "Carlos", Apellido = "Lopez", Celular = "555555555", Email = "carlos.lopez@example.com", DNI = "55555555", Direccion = "Calle 123", CodigoPostal = "7890", MedioPublicidad = "Radio" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetPacientesPorMedicoAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count()); // Dos médicos diferentes
        Assert.Equal(2, result.First().Pacientes.Count); // Dos pacientes para el primer médico
    }

    [Fact]
    public async Task GetByDNIAsync_ExistingDNI_ReturnsPacienteDTO()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        var paciente = new Pacientes { Nombre = "Luis", Apellido = "Badia", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" };
        context.Pacientes.Add(paciente);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByDNIAsync("42345654");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Luis", result.Nombre);
    }

    [Fact]
    public async Task GetByDNIAsync_NonExistingDNI_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Act
        var result = await service.GetByDNIAsync("99999999");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetPacientesSoloConsultoAsync_ReturnsPacientesSoloConsulto()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));

        // Setup test
        context.Pacientes.AddRange(
            new Pacientes { Nombre = "Luis", Apellido = "Badia", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram", SoloConsulto = true, FechaDeRecontacto = "2025-10-01" },
            new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram", SoloConsulto = false }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetPacientesSoloConsultoAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Luis", result.First().Nombre);
    }
}
