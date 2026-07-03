using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using clinichm_api.Controllers;
using Xunit;

namespace clinichm_api.Tests;

public class MedicoTratamientoControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));
        var controller = new MedicoTratamientoController(service);

        // Setup test
        var medicoTratamientoDto = new MedicoTratamientoDTO
        {
            MedicoId = 1,
            TratamientoId = 1
        };

        // Act
        var result = await controller.Create(medicoTratamientoDto);
        var actionResult = Assert.IsType<ActionResult<MedicoTratamientoResponseDTO>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Verificar que ahora hay 1 medico tratamiento en la BD
        var medicoTratamientos = await service.GetAllAsync();
        Assert.Single(medicoTratamientos);
        Assert.Equal(1, medicoTratamientos.First().MedicoId);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeMedicoTratamientos()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));
        var controller = new MedicoTratamientoController(service);

        // Asegura un contexto limpio
        context.MedicoTratamiento.RemoveRange(context.MedicoTratamiento);
        await context.SaveChangesAsync();

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
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<MedicoTratamientoResponseDTO>>(actionResult.Value);

        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerMedicoTratamientoPorId()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));
        var controller = new MedicoTratamientoController(service);

        // Asegura un contexto limpio
        context.MedicoTratamiento.RemoveRange(context.MedicoTratamiento);
        await context.SaveChangesAsync();

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();

        // Verifica que el medico tratamiento fue guardado
        var medicoTratamientoGuardado = await context.MedicoTratamiento.FirstOrDefaultAsync(mt => mt.MedicoId == 1);
        Assert.NotNull(medicoTratamientoGuardado); // Asegura que el medico tratamiento fue guardado en la base de datos

        // Act
        var result = await controller.GetById(medicoTratamientoGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<MedicoTratamientoResponseDTO>(actionResult.Value);
        Assert.Equal(1, returnValue.MedicoId);
    }

    [Fact]
    public async Task Update_DeberiaActualizarMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));
        var controller = new MedicoTratamientoController(service);

        // Asegura un contexto limpio
        context.MedicoTratamiento.RemoveRange(context.MedicoTratamiento);
        await context.SaveChangesAsync();

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();

        // Nuevo registro actualizado
        var medicoTratamientoDto = new MedicoTratamientoDTO
        {
            MedicoId = 2,
            TratamientoId = 2
        };

        // Act
        var result = await controller.Update(medicoTratamiento.Id, medicoTratamientoDto);

        // Assert: Verifica que solo hay un medico tratamiento y que sus IDs son los esperados
        var updatedMedicoTratamiento = await service.GetByIdAsync(medicoTratamiento.Id);
        Assert.Equal(2, updatedMedicoTratamiento?.MedicoId);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarMedicoTratamiento()
    {
        using var context = CreateNewContext();
        var service = new MedicoTratamientoService(new Repository<MedicoTratamiento>(context));
        var controller = new MedicoTratamientoController(service);

        // Asegura un contexto limpio
        context.MedicoTratamiento.RemoveRange(context.MedicoTratamiento);
        await context.SaveChangesAsync();

        // Setup test
        var medicoTratamiento = new MedicoTratamiento
        {
            MedicoId = 1,
            TratamientoId = 1
        };
        context.MedicoTratamiento.Add(medicoTratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(medicoTratamiento.Id);

        // Assert
        var medicoTratamientos = await service.GetAllAsync();
        Assert.Empty(medicoTratamientos);
    }
}
