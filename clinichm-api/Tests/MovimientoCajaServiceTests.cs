using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;

namespace clinichm_api.Tests;

public class MovimientoCajaServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    private IDolarService CreateMockDolarService()
    {
        var mock = new Mock<IDolarService>();
        mock.Setup(s => s.GetDolarAsync()).ReturnsAsync(new DolarDTO
        {
            FechaActualizacion = DateTime.Now,
            Compra = 100
        });
        return mock.Object;
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfMovimientosCaja()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        context.MovimientosCaja.AddRange(new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 0 },
                                         new MovimientoCaja { IdSucursal = 1, IdMedico = 2, IdPaciente = 2, CotizacionDolar = 200, NumeroFactura = "456", IdMedioPago = 2, Monto = 2000, TipoMovimiento = "Egreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0});
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsMovimientoCajaDTO()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCaja = new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 0 };
        context.MovimientosCaja.Add(movimientoCaja);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(movimientoCaja.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.IdMedico);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidMovimientoCajaDTO_CreatesMovimientoCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCajaDto = new MovimientoCajaDTO { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0};

        // Act
        await service.AddAsync(movimientoCajaDto);
        var result = await context.MovimientosCaja.FirstOrDefaultAsync(m => m.NumeroFactura == "123");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.IdMedico);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesMovimientoCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCaja = new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0};
        context.MovimientosCaja.Add(movimientoCaja);
        await context.SaveChangesAsync();
        var movimientoCajaDto = new MovimientoCajaDTO { IdSucursal = 1, IdMedico = 2, IdPaciente = 2, NumeroFactura = "456", IdMedioPago = 2, Monto = 2000, TipoMovimiento = "Egreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 1 };

        // Act
        var result = await service.UpdateAsync(movimientoCaja.Id, movimientoCajaDto);
        var updatedMovimientoCaja = await context.MovimientosCaja.FindAsync(movimientoCaja.Id);

        // Assert
        Assert.Equal(2, updatedMovimientoCaja?.IdMedico);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCajaDto = new MovimientoCajaDTO { IdSucursal = 1, IdMedico = 2, IdPaciente = 2, NumeroFactura = "456", IdMedioPago = 2, Monto = 2000, TipoMovimiento = "Egreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0};

        // Act
        var result = await service.UpdateAsync(99, movimientoCajaDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesMovimientoCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCaja = new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 0 };
        context.MovimientosCaja.Add(movimientoCaja);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteAsync(movimientoCaja.Id);
        var deletedMovimientoCaja = await context.MovimientosCaja.FindAsync(movimientoCaja.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedMovimientoCaja);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UpdateAsync_IdCierreGreaterThanZero_DoesNotUpdateMovimientoCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));

        // Setup test
        var movimientoCaja = new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 1 };
        context.MovimientosCaja.Add(movimientoCaja);
        await context.SaveChangesAsync();
        var movimientoCajaDto = new MovimientoCajaDTO { IdMedico = 2, Monto = 2000 };

        // Act
        var result = await Assert.ThrowsAsync<Exception> ( () => service.UpdateAsync(movimientoCaja.Id, movimientoCajaDto));
        
        // Assert
        Assert.Contains("Error", result.Message);
    }
}
