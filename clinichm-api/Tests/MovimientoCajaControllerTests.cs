using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Services.Implements;
using clinichm_api.Controllers;
using Xunit;
using Moq;

namespace clinichm_api.Tests;

public class MovimientoCajaControllerTests
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
    public async Task Create_DeberiaAgregarMovimientoCaja()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));
        var cobroService = new CobrosServices(
            new MovimientoCajaRepository(context),
            new Repository<CobroProductos>(context),
            new Repository<CobroTratamientos>(context),
            new Repository<Vouchers> (context),
            new Repository<CobroNotas>(context),
            new Repository<PagoDeComisiones>(context),
            new Repository<Tratamientos>(context),
            new Repository<Medicos>(context),
            new StockRepository(context)
        );
        var controller = new MovimientoCajaController(service, cobroService);
        // Setup test
        var movimientoCajaDto = new MovimientoCajaDTO { IdMedico = 1, IdPaciente = 1, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0};

        // Act
        var result = await controller.Create(movimientoCajaDto);
        var actionResult = Assert.IsType<ActionResult<MovimientoCajaResponseDTO>>(result);

        // Verificar que ahora hay 1 movimiento de caja en la BD
        var movimientosCaja = await service.GetAllAsync();
        Assert.Single(movimientosCaja);
        Assert.Equal(1, movimientosCaja.First().IdMedico);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeMovimientosCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));
        var cobroService = new CobrosServices(
            new MovimientoCajaRepository(context),
            new Repository<CobroProductos>(context),
            new Repository<CobroTratamientos>(context),
            new Repository<Vouchers> (context),
            new Repository<CobroNotas>(context),
            new Repository<PagoDeComisiones>(context),
            new Repository<Tratamientos>(context),
            new Repository<Medicos>(context),
            new StockRepository(context)
        );
        var controller = new MovimientoCajaController(service, cobroService);
        // Asegura un contexto limpio
        context.MovimientosCaja.RemoveRange(context.MovimientosCaja);
        await context.SaveChangesAsync();

        // Setup test
        context.MovimientosCaja.AddRange(new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 0 },
                                         new MovimientoCaja { IdSucursal = 1, IdMedico = 2, IdPaciente = 2, CotizacionDolar = 200, NumeroFactura = "456", IdMedioPago = 2, Monto = 2000, TipoMovimiento = "Egreso", FechaHora = DateTime.Now, FechaHoraTransf = "", IdCierreCaja = 1});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);

        // Aquí, solo esperamos IEnumerable<MovimientoCajaDTO> en lugar de una List
        var returnValue = Assert.IsType<List<MovimientoCajaResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerMovimientoCajaPorId()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));
        var cobroService = new CobrosServices(
            new MovimientoCajaRepository(context),
            new Repository<CobroProductos>(context),
            new Repository<CobroTratamientos>(context),
            new Repository<Vouchers> (context),
            new Repository<CobroNotas>(context),
            new Repository<PagoDeComisiones>(context),
            new Repository<Tratamientos>(context),
            new Repository<Medicos>(context),
            new StockRepository(context)
        );
        var controller = new MovimientoCajaController(service, cobroService);
         // Asegura un contexto limpio
        context.MovimientosCaja.RemoveRange(context.MovimientosCaja);
        await context.SaveChangesAsync();

        // Setup test
        context.MovimientosCaja.AddRange(new MovimientoCaja { IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0});
        await context.SaveChangesAsync();

        // Verifica que el movimiento de caja fue guardado
        var movimientoCajaGuardado = await context.MovimientosCaja.FirstOrDefaultAsync(m => m.NumeroFactura == "123");
        Assert.NotNull(movimientoCajaGuardado); // Asegura que el movimiento de caja fue guardado en la base de datos

        // Act
        var result = await controller.GetById(movimientoCajaGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<MovimientoCajaResponseDTO>(actionResult.Value);
        Assert.Equal(1, returnValue.IdMedico);
    }

    [Fact]
    public async Task Update_DeberiaActualizarMovimientoCaja()
    {
        using var context = CreateNewContext();
                var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));
       var cobroService = new CobrosServices(
            new MovimientoCajaRepository(context),
            new Repository<CobroProductos>(context),
            new Repository<CobroTratamientos>(context),
            new Repository<Vouchers> (context),
            new Repository<CobroNotas>(context),
            new Repository<PagoDeComisiones>(context),
            new Repository<Tratamientos>(context),
            new Repository<Medicos>(context),
            new StockRepository(context)
        );
        var controller = new MovimientoCajaController(service, cobroService);
        // Asegura un contexto limpio
        context.MovimientosCaja.RemoveRange(context.MovimientosCaja);
        await context.SaveChangesAsync();

        // Setup test
        context.MovimientosCaja.AddRange(new MovimientoCaja { Id = 1, IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0});
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var movimientoCajaDto = new MovimientoCajaDTO { IdMedico = 2, IdSucursal = 1, IdPaciente = 2, NumeroFactura = "456", IdMedioPago = 2, Monto = 2000, TipoMovimiento = "Egreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0};

        // Act
        var result = await controller.Update(1, movimientoCajaDto);

        // Assert: Verifica que solo hay un movimiento de caja y que su IdMedico es el esperado
        var movimientoCaja = await service.GetByIdAsync(1);
        Assert.Equal(2, movimientoCaja?.IdMedico);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarMovimientoCaja()
    {
        using var context = CreateNewContext();
        var service = new MovimientoCajaService(new MovimientoCajaRepository(context),
        CreateMockDolarService(),
        new Repository<CobroNotas>(context));
       var cobroService = new CobrosServices(
            new MovimientoCajaRepository(context),
            new Repository<CobroProductos>(context),
            new Repository<CobroTratamientos>(context),
            new Repository<Vouchers> (context),
            new Repository<CobroNotas>(context),
            new Repository<PagoDeComisiones>(context),
            new Repository<Tratamientos>(context),
            new Repository<Medicos>(context),
            new StockRepository(context)
        );
        var controller = new MovimientoCajaController(service, cobroService);
        // Asegura un contexto limpio
        context.MovimientosCaja.RemoveRange(context.MovimientosCaja);
        await context.SaveChangesAsync();

        // Setup test
        context.MovimientosCaja.AddRange(new MovimientoCaja { Id = 1,IdSucursal = 1, IdMedico = 1, IdPaciente = 1, CotizacionDolar = 100, NumeroFactura = "123", IdMedioPago = 1, Monto = 1000, TipoMovimiento = "Ingreso", FechaHora = DateTime.Now, FechaHoraTransf = "" , IdCierreCaja = 0});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        // Assert
        var movimientosCaja = await service.GetAllAsync(); 
        Assert.Empty(movimientosCaja);
    }
}
