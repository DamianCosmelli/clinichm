using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class EstadoTurnosControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarEstadoTurno()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));
        var controller = new EstadosTurnosController(service);

        // Setup test
        var estadoTurnoDto = new EstadoTurnoDTO { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" };

        // Act
        var result = await controller.Create(estadoTurnoDto);
        var actionResult = Assert.IsType<ActionResult<EstadoTurnoResponseDTO>>(result);

        // Verificar que ahora hay 1 estado de turno en la BD
        var estadoTurnos = await service.GetAllAsync();
        Assert.Single(estadoTurnos);
        Assert.Equal("Pendiente", estadoTurnos.First().Estado);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeEstadoTurnos()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));
        var controller = new EstadosTurnosController(service);

        // Asegura un contexto limpio
        context.EstadosTurnos.RemoveRange(context.EstadosTurnos);
        await context.SaveChangesAsync();

        // Setup test
        context.EstadosTurnos.AddRange(new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" },
                                      new EstadosTurnos { Estado = "Confirmado", Descripcion = "Turno confirmado", Color = "#00FF00" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<EstadoTurnoResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerEstadoTurnoPorId()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));
        var controller = new EstadosTurnosController(service);

        // Asegura un contexto limpio
        context.EstadosTurnos.RemoveRange(context.EstadosTurnos);
        await context.SaveChangesAsync();

        // Setup test
        context.EstadosTurnos.AddRange(new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" });
        await context.SaveChangesAsync();

        // Verifica que el estado de turno fue guardado
        var estadoTurnoGuardado = await context.EstadosTurnos.FirstOrDefaultAsync(et => et.Estado == "Pendiente");
        Assert.NotNull(estadoTurnoGuardado); // Asegura que el estado de turno fue guardado en la base de datos

        // Act
        var result = await controller.GetById(estadoTurnoGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<EstadoTurnoResponseDTO>(actionResult.Value);
        Assert.Equal("Pendiente", returnValue.Estado);
    }

    [Fact]
    public async Task Update_DeberiaActualizarEstadoTurno()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));
        var controller = new EstadosTurnosController(service);

        // Asegura un contexto limpio
        context.EstadosTurnos.RemoveRange(context.EstadosTurnos);
        await context.SaveChangesAsync();

        // Setup test
        context.EstadosTurnos.AddRange(new EstadosTurnos { Id = 1, Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" });
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var estadoTurnoDto = new EstadoTurnoDTO { Estado = "Confirmado", Descripcion = "Turno confirmado", Color = "#00FF00" };

        // Act
        var result = await controller.Update(1, estadoTurnoDto);

        // Assert: Verifica que solo hay un estado de turno y que su nombre es el esperado
        var estadoTurno = await service.GetByIdAsync(1);
        Assert.Equal("Confirmado", estadoTurno?.Estado);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarEstadoTurno()
    {
        using var context = CreateNewContext();
        var service = new EstadoTurnoServices(new Repository<EstadosTurnos>(context));
        var controller = new EstadosTurnosController(service);

        // Asegura un contexto limpio
        context.EstadosTurnos.RemoveRange(context.EstadosTurnos);
        await context.SaveChangesAsync();

        // Setup test
        context.EstadosTurnos.AddRange(new EstadosTurnos { Estado = "Pendiente", Descripcion = "Turno pendiente", Color = "#FF0000" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        // Assert
        var estadoTurnos = await service.GetAllAsync(); 
        Assert.Empty(estadoTurnos);
    }
}
