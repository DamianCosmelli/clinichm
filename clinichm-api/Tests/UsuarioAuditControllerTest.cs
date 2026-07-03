using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class UsuarioAuditControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDeAusitoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioAuditController(service);
        // Asegura un contexto limpio
        context.UsuarioAudit.RemoveRange(context.UsuarioAudit);
        await context.SaveChangesAsync();

        // Setup test
        context.UsuarioAudit.AddRange(
            new UsuarioAudit{Id=1, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.000", Navegador="FireFox", UsuarioId=1},
            new UsuarioAudit{Id=2, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.010", Navegador="FireFox", UsuarioId=2},
            new UsuarioAudit{Id=3, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.020", Navegador="FireFox", UsuarioId=3}
        );
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<UsuarioAuditDTO>>(actionResult.Value);
        Assert.Equal(3, returnValue.Count());
    }

        [Fact]
    public async Task GetSessionByUserId_DeberiaTraerListaDeAusitoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));
        var controller = new UsuarioAuditController(service);
        // Asegura un contexto limpio
        context.UsuarioAudit.RemoveRange(context.UsuarioAudit);
        await context.SaveChangesAsync();

        // Setup test
        context.UsuarioAudit.AddRange(
            new UsuarioAudit{Id=1, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.000", Navegador="FireFox", UsuarioId=1},
            new UsuarioAudit{Id=2, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.010", Navegador="FireFox", UsuarioId=2},
            new UsuarioAudit{Id=3, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.020", Navegador="FireFox", UsuarioId=3},
            new UsuarioAudit{Id=4, LoginTime=DateTime.Now.AddHours(1) , LogoutTime=DateTime.Now.AddHours(2), Ip="123.456.789.020", Navegador="FireFox", UsuarioId=3},
            new UsuarioAudit{Id=5, LoginTime=DateTime.Now.AddHours(2) , LogoutTime=DateTime.Now.AddHours(3), Ip="123.456.789.020", Navegador="FireFox", UsuarioId=3}
        );
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetSessionByUsuarioId(3);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<UsuarioAuditRespDTO>>(actionResult.Value);
        Assert.Equal(3, returnValue.Count());
    }
}