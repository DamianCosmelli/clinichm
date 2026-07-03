using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class SucursalControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));
        var controller = new SucursalesController(service);
        // Setup test
        var sucursalDto = new SucursalDTO { Nombre = "Flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"};

        // Act
        var result = await controller.Create(sucursalDto);
        var actionResult = Assert.IsType<CreatedAtActionResult>(result);

        // Verificar que ahora hay 1 persona en la BD
        var sucursal = await service.GetAllAsync();
        Assert.Single(sucursal);
        Assert.Equal("Flores", sucursal.First().Nombre);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDeSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));
        var controller = new SucursalesController(service);
        // Asegura un contexto limpio
        context.Sucursales.RemoveRange(context.Sucursales);
        await context.SaveChangesAsync();

        // Setup test
        context.Sucursales.AddRange(new Sucursales { Nombre = "flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"},
                                     new Sucursales { Nombre = "nordelta",Ciudad="GBA",Direccion="Capibara 123", CodigoPostal="9000"});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);

        // Aquí, solo esperamos IEnumerable<RolDTO> en lugar de una List
        var returnValue = Assert.IsType<List<SucursalResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));
        var controller = new SucursalesController(service);
         // Asegura un contexto limpio
        context.Sucursales.RemoveRange(context.Sucursales);
        await context.SaveChangesAsync();

        // Setup test
        context.Sucursales.AddRange(new Sucursales { Nombre = "Flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"});
        await context.SaveChangesAsync();

        // Verifica que el rol fue guardado
        var sucursalesGuardado = await context.Sucursales.FirstOrDefaultAsync(s => s.Nombre == "Flores");
        Assert.NotNull(sucursalesGuardado); // Asegura que el rol fue guardado en la base de datos


        // Act
        var result = await controller.GetById(sucursalesGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<SucursalResponseDTO>(actionResult.Value);
        Assert.Equal("Flores", returnValue.Nombre);

    }
     [Fact]
    public async Task Update_DeberiaActualizarSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));
        var controller = new SucursalesController(service);
        // Asegura un contexto limpio
        context.Sucursales.RemoveRange(context.Sucursales);
        await context.SaveChangesAsync();

        // Setup test
        context.Sucursales.AddRange(new Sucursales {Id=1, Nombre = "flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"});
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var sucursalDto = new SucursalDTO { Nombre = "Nordelta",Ciudad="GBA",Direccion="Capibara 123", CodigoPostal="9000"};

        // Act
        var result = await controller.Update(1, sucursalDto);

        // Assert: Verifica que solo hay un rol y que su nombre es el esperado
        var sucursal = await service.GetByIdAsync(1);
        Assert.Equal("Nordelta", sucursal?.Nombre);

    }
     [Fact]
    public async Task Deleted_DeberiaElimimarSucursal()
    {
        using var context = CreateNewContext();
        var service = new SucursalServices(new Repository<Sucursales>(context));
        var controller = new SucursalesController(service);
        // Asegura un contexto limpio
        context.Sucursales.RemoveRange(context.Sucursales);
        await context.SaveChangesAsync();

        // Setup test
        context.Sucursales.AddRange(new Sucursales { Nombre = "Flores",Ciudad="CABA",Direccion="Siempre viva 123", CodigoPostal="5678"});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        //assert
        var sucursal = await service.GetAllAsync(); 
        Assert.Empty(sucursal);


    }
}