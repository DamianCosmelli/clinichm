using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class RoleComisionServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        context.RoleComision.AddRange(new RoleComision { Role = "Admin" },
                                      new RoleComision { Role = "User" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsRoleComisionDTO()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(roleComision.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidRoleComisionDTO_CreatesRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        var roleComisionDto = new RoleComisionDTO { Role = "Admin" };

        // Act
        await service.AddAsync(roleComisionDto);
        var result = await context.RoleComision.FirstOrDefaultAsync(r => r.Role == "Admin");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();
        var roleComisionDto = new RoleComisionDTO { Role = "User" };

        // Act
        var result = await service.UpdateAsync(roleComision.Id, roleComisionDto);
        var updatedRoleComision = await context.RoleComision.FindAsync(roleComision.Id);

        // Assert
        Assert.Equal("User", updatedRoleComision?.Role);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        var roleComisionDto = new RoleComisionDTO { Role = "User" };

        // Act
        var result = await service.UpdateAsync(99, roleComisionDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesRoleComision()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Setup test
        var roleComision = new RoleComision { Role = "Admin" };
        context.RoleComision.Add(roleComision);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(roleComision.Id);
        var deletedRoleComision = await context.RoleComision.FindAsync(roleComision.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedRoleComision);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new RoleComisionService(new Repository<RoleComision>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }
}
