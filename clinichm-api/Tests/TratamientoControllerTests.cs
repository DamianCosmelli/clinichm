using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class TratamientoControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));
        var controller = new TratamientosController(service);

        // Act
        var tratamientoDto = new TratamientoDTO { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        var result = await controller.Create(tratamientoDto);
        var actionResult = Assert.IsType<ActionResult<TratamientoResponseDTO>>(result);

        // Assert
        var tratamiento = await service.GetAllAsync();
        Assert.Single(tratamiento);
        Assert.Equal("Tratamiento1", tratamiento.First().NombreTratamiento);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeTratamientos()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));
        var controller = new TratamientosController(service);

        // Setup test
        context.Tratamientos.AddRange(new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 },
                                      new Tratamientos { NombreTratamiento = "Tratamiento2", Descripcion = "Descripcion2", SucursalId = 2, PrecioEfectivo = 200, PrecioOtrosMediosDePago = 220, Comision = 20, ComisionEncargado = 10 });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<TratamientoResponseDTO>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));
        var controller = new TratamientosController(service);

        // Setup test
        var nuevoTratamiento = new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(nuevoTratamiento);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetById(nuevoTratamiento.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<TratamientoResponseDTO>(actionResult.Value);
        Assert.Equal("Tratamiento1", returnValue.NombreTratamiento);
    }

    [Fact]
    public async Task Update_DeberiaActualizarTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));
        var controller = new TratamientosController(service);

        // Setup test
        var tratamientoExistente = new Tratamientos { Id = 1, NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(tratamientoExistente);
        await context.SaveChangesAsync();

        // Nuevo registro actualizado
        var tratamientoDto = new TratamientoDTO { NombreTratamiento = "TratamientoActualizado", Descripcion = "DescripcionActualizada", SucursalId = 3, PrecioEfectivo = 150, PrecioOtrosMediosDePago = 165, Comision = 15, ComisionEncargado = 7.5M };

        // Act
        await controller.Update(tratamientoExistente.Id, tratamientoDto);

        // Assert
        var tratamiento = await service.GetByIdAsync(tratamientoExistente.Id);
        Assert.Equal("TratamientoActualizado", tratamiento?.NombreTratamiento);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarTratamiento()
    {
        using var context = CreateNewContext();
        var service = new TratamientoServices(new Repository<Tratamientos>(context));
        var controller = new TratamientosController(service);

        // Setup test
        var tratamientoExistente = new Tratamientos { NombreTratamiento = "Tratamiento1", Descripcion = "Descripcion1", SucursalId = 1, PrecioEfectivo = 100, PrecioOtrosMediosDePago = 110, Comision = 10, ComisionEncargado = 5 };
        context.Tratamientos.Add(tratamientoExistente);
        await context.SaveChangesAsync();

        // Act
        await controller.Delete(tratamientoExistente.Id);

        // Assert
        var tratamiento = await service.GetAllAsync();
        Assert.Empty(tratamiento);
    }
}