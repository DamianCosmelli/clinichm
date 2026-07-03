using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Microsoft.AspNetCore.Http;

namespace clinichm_api.Tests;

public class UsuarioAuditServicesTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListaDeAuditoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));

        // Setup test
        context.UsuarioAudit.AddRange(
            new UsuarioAudit{Id=1, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.000", Navegador="FireFox", UsuarioId=1},
            new UsuarioAudit{Id=2, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.010", Navegador="FireFox", UsuarioId=2},
            new UsuarioAudit{Id=3, LoginTime=DateTime.Now , LogoutTime=DateTime.Now.AddHours(1), Ip="123.456.789.020", Navegador="FireFox", UsuarioId=3}
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }

        [Fact]
    public async Task GetSessionByUserId_ReturnsListaDeAuditoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));

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
        var result = await service.GetSessionByUserIdAsync(3);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }

           [Fact]
    public async Task AddAudutoria_DebeAgregarAuditoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));

        // Setup test
        var auditoria = new UsuarioAuditReqDTO {UsuarioId=1};
        var httpContext = new DefaultHttpContext();
        httpContext.Connection.RemoteIpAddress = System.Net.IPAddress.Parse("123.233.123.1");
        httpContext.Request.Headers["User-Agent"] = "FireFox";

        // Act
        var result = await service.AddAsync(auditoria,httpContext);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("123.233.123.1", result.Ip);
        Assert.Equal("FireFox", result.Navegador);
    } 

    [Fact]
    public async Task UpdateAudutoria_DebeActualizarAuditoria()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));

        // Setup test
        var auditoria = new UsuarioAuditReqDTO {UsuarioId=1};

        context.UsuarioAudit.Add(
            new UsuarioAudit{Id=1, LoginTime=DateTime.Now.AddHours(-1) , Ip="123.456.789.000", Navegador="FireFox", UsuarioId=1});
        await context.SaveChangesAsync();

        // Act
        var resultUpdate = await service.UpdateAsync(auditoria);

        // Assert
        Assert.NotNull(resultUpdate);
        Assert.Equal(DateTime.Now.Hour, resultUpdate.LogoutTime!.Value.Hour);
        Assert.Equal(DateTime.Now.Minute, resultUpdate.LogoutTime!.Value.Minute);
    } 
    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesTurno()
    {
        using var context = CreateNewContext();
        var service = new UsuarioAuditServices(new UsuarioAuditRepository(context));

        // Setup test
        var auditoria = new UsuarioAudit {
            Id=1, LoginTime=DateTime.Now.AddHours(-1) , Ip="123.456.789.000", Navegador="FireFox", UsuarioId=1
        };
        context.UsuarioAudit.Add(auditoria);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(auditoria.Id);
        var deletedTurno = await context.UsuarioAudit.FindAsync(auditoria.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedTurno);
    }

}