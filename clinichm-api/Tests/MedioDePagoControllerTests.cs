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

public class MedioDePagoControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));
        var controller = new MedioDePagoController(service);
        // Setup test
        var medioDePagoDto = new MedioDePagoDTO { MedioPago = "Tarjeta" };

        // Act
        var result = await controller.Create(medioDePagoDto);
        var actionResult = Assert.IsType<ActionResult<MedioDePagoResponseDTO>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Verificar que ahora hay 1 medio de pago en la BD
        var mediosDePago = await service.GetAllAsync();
        Assert.Single(mediosDePago);
        Assert.Equal("Tarjeta", mediosDePago.First().MedioPago);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeMediosDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));
        var controller = new MedioDePagoController(service);
        // Asegura un contexto limpio
        context.MedioDePago.RemoveRange(context.MedioDePago);
        await context.SaveChangesAsync();

        // Setup test
        context.MedioDePago.AddRange(new MedioDePago { MedioPago = "Tarjeta" },
                                     new MedioDePago { MedioPago = "Efectivo" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<MedioDePagoResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerMedioDePagoPorId()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));
        var controller = new MedioDePagoController(service);
         // Asegura un contexto limpio
        context.MedioDePago.RemoveRange(context.MedioDePago);
        await context.SaveChangesAsync();

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();

        // Verifica que el medio de pago fue guardado
        var medioDePagoGuardado = await context.MedioDePago.FirstOrDefaultAsync(m => m.MedioPago == "Tarjeta");
        Assert.NotNull(medioDePagoGuardado); // Asegura que el medio de pago fue guardado en la base de datos

        // Act
        var result = await controller.GetById(medioDePagoGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<MedioDePagoResponseDTO>(actionResult.Value);
        Assert.Equal("Tarjeta", returnValue.MedioPago);
    }

    [Fact]
    public async Task Update_DeberiaActualizarMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));
        var controller = new MedioDePagoController(service);
        // Asegura un contexto limpio
        context.MedioDePago.RemoveRange(context.MedioDePago);
        await context.SaveChangesAsync();

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var medioDePagoDto = new MedioDePagoDTO { MedioPago = "Efectivo" };

        // Act
        var result = await controller.Update(medioDePago.Id, medioDePagoDto);

        // Assert: Verifica que solo hay un medio de pago y que su nombre es el esperado
        var updatedMedioDePago = await service.GetByIdAsync(medioDePago.Id);
        Assert.Equal("Efectivo", updatedMedioDePago?.MedioPago);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarMedioDePago()
    {
        using var context = CreateNewContext();
        var service = new MedioDePagoService(new Repository<MedioDePago>(context));
        var controller = new MedioDePagoController(service);
        // Asegura un contexto limpio
        context.MedioDePago.RemoveRange(context.MedioDePago);
        await context.SaveChangesAsync();

        // Setup test
        var medioDePago = new MedioDePago { MedioPago = "Tarjeta" };
        context.MedioDePago.Add(medioDePago);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(medioDePago.Id);

        // Assert
        var mediosDePago = await service.GetAllAsync(); 
        Assert.Empty(mediosDePago);
    }
}
