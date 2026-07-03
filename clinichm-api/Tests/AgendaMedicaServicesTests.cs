using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace clinichm_api.Tests;

public class AgendaMedicaServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private Mock<ITurnoRepository> CreateMockTurnoRepository() => new Mock<ITurnoRepository>();
    private Mock<IRepository<TurnosAfectados>> CreateMockTurnosAfectadosRepository() => new Mock<IRepository<TurnosAfectados>>();

private AgendaMedicaServices CreateService(
    AppDbContext context,
    Mock<ITurnoRepository>? mockTurnoRepo = null,
    Mock<IRepository<TurnosAfectados>>? mockTurnosAfectadosRepo = null)
{
    mockTurnoRepo ??= CreateMockTurnoRepository();
    mockTurnosAfectadosRepo ??= CreateMockTurnosAfectadosRepository();

    return new AgendaMedicaServices(
        new AgendaMedicaRepository(context),
        mockTurnoRepo.Object,
        mockTurnosAfectadosRepo.Object, // Usamos el mock en lugar de una instancia real
        context);
}

    [Fact]
    public async Task GetAllAsync_ReturnsListOfAgendaMedica()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        context.AgendaMedica.AddRange(
            new AgendaMedica { FechaInicio = DateTime.Now, MedicoId = 3, SucursalId = 2, FechaFin = DateTime.Now.AddHours(1) },
            new AgendaMedica { FechaInicio = DateTime.Now.AddDays(1), MedicoId = 7, SucursalId = 1, FechaFin = DateTime.Now.AddDays(1).AddHours(1) });
        await context.SaveChangesAsync();

        var result = await service.GetAllAsync();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsAgendaMedicaDTO()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var agenda = new AgendaMedica { FechaInicio = DateTime.Now, MedicoId = 3, SucursalId = 2, FechaFin = DateTime.Now.AddHours(1) };
        context.AgendaMedica.Add(agenda);
        await context.SaveChangesAsync();

        var result = await service.GetByIdAsync(agenda.Id);

        Assert.NotNull(result);
        Assert.Equal(3, result!.MedicoId);
        Assert.Equal(2, result.SucursalId);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var result = await service.GetByIdAsync(999);

        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidAgendaMedicaDTO_CreatesAgendaMedica()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var dto = new AgendaMedicaDTO { FechaInicio = DateTime.Now, MedicoId = 3, SucursalId = 2, FechaFin = DateTime.Now.AddHours(1) };
        var result = await service.AddAsync(dto);

        Assert.NotNull(result);
        Assert.Equal(3, result!.MedicoId);
        Assert.Equal(2, result.SucursalId);
        Assert.True(result.Id > 0);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var dto = new AgendaMedicaDTO { FechaInicio = DateTime.Now, MedicoId = 3, SucursalId = 5, FechaFin = DateTime.Now.AddHours(1) };
        var result = await service.UpdateAsync(99, dto);

        Assert.Null(result);
    }

    [Fact]
   public async Task DeleteAsync_ExistingId_DeletesAgendaMedica()
{
    using var context = CreateNewContext();
    var mockTurnoRepo = CreateMockTurnoRepository();
    var mockTurnosAfectadosRepo = CreateMockTurnosAfectadosRepository();

    // Configuración para el repositorio de turnos
    mockTurnoRepo.Setup(r => r.GetTurnosAfectadosCambioAgendaDiaAsync(It.IsAny<int>(), It.IsAny<DateTime>()))
                 .ReturnsAsync(new List<Turnos>());
    
    // Configuración para el repositorio de turnos afectados
    mockTurnosAfectadosRepo.Setup(r => r.AddAsync(It.IsAny<TurnosAfectados>()))
                          .Returns(Task.CompletedTask);

    var service = CreateService(context, mockTurnoRepo, mockTurnosAfectadosRepo);

    var agenda = new AgendaMedica { 
        FechaInicio = DateTime.Now, 
        MedicoId = 3, 
        SucursalId = 5, 
        FechaFin = DateTime.Now.AddHours(1) 
    };
    
    context.AgendaMedica.Add(agenda);
    await context.SaveChangesAsync();

    // Verificación previa
    var existsBefore = await context.AgendaMedica.AnyAsync(a => a.Id == agenda.Id);
    Assert.True(existsBefore);

    var result = await service.DeleteAsync(agenda.Id);
    Assert.True(result);

    // Verificación posterior
    var existsAfter = await context.AgendaMedica.AnyAsync(a => a.Id == agenda.Id);
    Assert.False(existsAfter);

    // Verificación adicional con FindAsync
    var deleted = await context.AgendaMedica.FindAsync(agenda.Id);
    Assert.Null(deleted);
}
    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var result = await service.DeleteAsync(999);
        Assert.False(result);
    }

    [Fact]
    public async Task GetAgendaMedicaFehaRangoAsync_ReturnsFilteredAgendas()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        context.Medicos.Add(new Medicos { Id = 1, Nombre = "John", Apellido = "Doe", Matricula = "ABC123" });
        context.Sucursales.Add(new Sucursales
        {
            Id = 1,
            Nombre = "Central",
            Ciudad = "CiudadTest",
            CodigoPostal = "1234",
            Direccion = "DireccionTest"
        });

        var start = DateTime.Today;
        var end = start.AddDays(7);

        context.AgendaMedica.AddRange(
            new AgendaMedica { FechaInicio = start.AddDays(1), FechaFin = start.AddDays(1).AddHours(2), MedicoId = 1, SucursalId = 1 },
            new AgendaMedica { FechaInicio = start.AddDays(2), FechaFin = start.AddDays(2).AddHours(2), MedicoId = 1, SucursalId = 1 },
            new AgendaMedica { FechaInicio = start.AddDays(-1), FechaFin = start.AddDays(-1).AddHours(2), MedicoId = 1, SucursalId = 1 }); // Fuera de rango
        await context.SaveChangesAsync();

        var result = await service.GetAgendaMedicaFehaRangoAsync(start, end);
        Assert.Equal(2, result.Count());
        Assert.All(result, r => {
            Assert.Equal("John Doe", r.MedicoNombre);
            Assert.Equal("Central", r.SucursalNombre);
        });
    }

    [Fact]
    public async Task GetAgendaMedicaFehaRangoHoraYSucAsync_ReturnsFilteredAgendas()
    {
        using var context = CreateNewContext();
        var service = CreateService(context);

        var start = DateTime.Today;
        var end = start.AddDays(7);
        int hora = 10;
        int sucursalId = 1;

        context.AgendaMedica.AddRange(
            new AgendaMedica { FechaInicio = start.AddDays(1).AddHours(hora), FechaFin = start.AddDays(1).AddHours(hora + 2), MedicoId = 1, SucursalId = sucursalId },
            new AgendaMedica { FechaInicio = start.AddDays(2).AddHours(hora - 1), FechaFin = start.AddDays(2).AddHours(hora + 1), MedicoId = 1, SucursalId = sucursalId },
            new AgendaMedica { FechaInicio = start.AddDays(3).AddHours(hora + 3), FechaFin = start.AddDays(3).AddHours(hora + 5), MedicoId = 1, SucursalId = sucursalId }, // Fuera de hora
            new AgendaMedica { FechaInicio = start.AddDays(4).AddHours(hora), FechaFin = start.AddDays(4).AddHours(hora + 2), MedicoId = 1, SucursalId = 2 }); // Otra sucursal
        await context.SaveChangesAsync();

        var result = await service.GetAgendaMedicaFehaRangoHoraYSucAsync(start, end, hora, sucursalId);
        Assert.Equal(2, result.Count());
        Assert.All(result, r => {
            Assert.True(r.FechaInicio.Hour <= hora && r.FechaFin.Hour >= hora);
            Assert.Equal(sucursalId, r.SucursalId);
        });
    }
}