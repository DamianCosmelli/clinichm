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

public class RoleComisionControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));
        var controller = new RoleComisionController(service);
        // Setup test
        var roleComisionDto = new RoleComisionDTO { Role = "Admin" };

        // Act
        var result = await controller.Create(roleComisionDto);
        var actionResult = Assert.IsType<ActionResult<RoleComisionResponseDTO>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Verificar que ahora hay 1 role de comisión en la BD
        var rolesComision = await service.GetAllAsync();
        Assert.Single(rolesComision);
        Assert.Equal("Admin", rolesComision.First().Role);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeRolesComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));
        var controller = new RoleComisionController(service);
        // Asegura un contexto limpio
        context.RoleComision.RemoveRange(context.RoleComision);
        await context.SaveChangesAsync();

        // Setup test
        context.RoleComision.AddRange(new RoleComision { Role = "Admin" },
                                      new RoleComision { Role = "User" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<RoleComisionResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerRoleComisionPorId()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));
        var controller = new RoleComisionController(service);
         // Asegura un contexto limpio
        context.RoleComision.RemoveRange(context.RoleComision);
        await context.SaveChangesAsync();

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();

        // Verifica que el role de comisión fue guardado
        var roleComisionGuardado = await context.RoleComision.FirstOrDefaultAsync(r => r.Role == "Admin");
        Assert.NotNull(roleComisionGuardado); // Asegura que el role de comisión fue guardado en la base de datos

        // Act
        var result = await controller.GetById(roleComisionGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<RoleComisionResponseDTO>(actionResult.Value);
        Assert.Equal("Admin", returnValue.Role);
    }

    [Fact]
    public async Task Update_DeberiaActualizarRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));
        var controller = new RoleComisionController(service);
        // Asegura un contexto limpio
        context.RoleComision.RemoveRange(context.RoleComision);
        await context.SaveChangesAsync();

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var roleComisionDto = new RoleComisionDTO { Role = "User" };

        // Act
        var result = await controller.Update(roleComision.Id, roleComisionDto);

        // Assert: Verifica que solo hay un role de comisión y que su nombre es el esperado
        var updatedRoleComision = await service.GetByIdAsync(roleComision.Id);
        Assert.Equal("User", updatedRoleComision?.Role);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));
        var controller = new RoleComisionController(service);
        // Asegura un contexto limpio
        context.RoleComision.RemoveRange(context.RoleComision);
        await context.SaveChangesAsync();

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(roleComision.Id);

        // Assert
        var rolesComision = await service.GetAllAsync(); 
        Assert.Empty(rolesComision);
    }
}
