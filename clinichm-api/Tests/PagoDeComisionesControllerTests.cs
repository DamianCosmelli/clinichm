using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using clinichm_api.Controllers;
using Xunit;
using clinichm_api.Data;

namespace clinichm_api.Tests;

public class PagoDeComisionesControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));
        var controller = new PagoDeComisionesController(service);
        // Setup test
        var pagoDeComisionesDto = new PagoDeComisionesDTO { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };

        // Act
        var result = await controller.Create(pagoDeComisionesDto);
        var actionResult = Assert.IsType<ActionResult<PagoDeComisionesResponseDTO>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Verificar que ahora hay 1 pago de comisiones en la BD
        var pagosDeComisiones = await service.GetAllAsync();
        Assert.Single(pagosDeComisiones);
        Assert.Equal("Tarjeta", pagosDeComisiones.First().MetodoDePago);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDePagosDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));
        var controller = new PagoDeComisionesController(service);
        // Asegura un contexto limpio
        context.PagoDeComisiones.RemoveRange(context.PagoDeComisiones);
        await context.SaveChangesAsync();

        // Setup test
        context.PagoDeComisiones.AddRange(new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 },
                                          new PagoDeComisiones { MedicoId = 2, FechaDePago = DateTime.Now, MetodoDePago = "Efectivo", Monto = 200, CierreDeCajaId = 2 });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<PagoDeComisionesResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerPagoDeComisionesPorId()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));
        var controller = new PagoDeComisionesController(service);
         // Asegura un contexto limpio
        context.PagoDeComisiones.RemoveRange(context.PagoDeComisiones);
        await context.SaveChangesAsync();

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();

        // Verifica que el pago de comisiones fue guardado
        var pagoDeComisionesGuardado = await context.PagoDeComisiones.FirstOrDefaultAsync(p => p.MetodoDePago == "Tarjeta");
        Assert.NotNull(pagoDeComisionesGuardado); // Asegura que el pago de comisiones fue guardado en la base de datos

        // Act
        var result = await controller.GetById(pagoDeComisionesGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<PagoDeComisionesResponseDTO>(actionResult.Value);
        Assert.Equal("Tarjeta", returnValue.MetodoDePago);
    }

    [Fact]
    public async Task Update_DeberiaActualizarPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));
        var controller = new PagoDeComisionesController(service);
        // Asegura un contexto limpio
        context.PagoDeComisiones.RemoveRange(context.PagoDeComisiones);
        await context.SaveChangesAsync();

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var pagoDeComisionesDto = new PagoDeComisionesDTO { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Efectivo", Monto = 200, CierreDeCajaId = 1 };

        // Act
        var result = await controller.Update(pagoDeComisiones.Id, pagoDeComisionesDto);

        // Assert: Verifica que solo hay un pago de comisiones y que su nombre es el esperado
        var updatedPagoDeComisiones = await service.GetByIdAsync(pagoDeComisiones.Id);
        Assert.Equal("Efectivo", updatedPagoDeComisiones?.MetodoDePago);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarPagoDeComisiones()
    {
        using var context = CreateNewContext();
        var service = new PagoDeComisionesService(new Repository<PagoDeComisiones>(context));
        var controller = new PagoDeComisionesController(service);
        // Asegura un contexto limpio
        context.PagoDeComisiones.RemoveRange(context.PagoDeComisiones);
        await context.SaveChangesAsync();

        // Setup test
        var pagoDeComisiones = new PagoDeComisiones { MedicoId = 1, FechaDePago = DateTime.Now, MetodoDePago = "Tarjeta", Monto = 100, CierreDeCajaId = 1 };
        context.PagoDeComisiones.Add(pagoDeComisiones);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(pagoDeComisiones.Id);

        // Assert
        var pagosDeComisiones = await service.GetAllAsync(); 
        Assert.Empty(pagosDeComisiones);
    }
}
