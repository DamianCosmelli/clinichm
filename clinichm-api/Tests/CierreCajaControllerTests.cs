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

public class CierreCajaControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);
        // Setup test
        var cierreCajaDto = new CierreCajaDTO
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        };

        // Act
        var result = await controller.Create(cierreCajaDto);
        var actionResult = Assert.IsType<ActionResult<CierreCajaResponseDTO>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Verificar que ahora hay 1 cierre de caja en la BD
        var cierresCaja = await service.GetAllAsync();
        Assert.Single(cierresCaja);
        Assert.Equal(1000, cierresCaja.First().MontoEfectivo);
    }

    [Fact]
    public async Task GetAll_DeberiaTraerListaDeCierresCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);
        // Asegura un contexto limpio
        context.CierreCaja.RemoveRange(context.CierreCaja);
        await context.SaveChangesAsync();

        // Setup test
        context.CierreCaja.AddRange(new CierreCaja
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        },
        new CierreCaja
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 2000,
            MontoTarjetaCredito = 1000,
            MontoDebito = 600,
            MontoTransferencia = 400,
            MontoDolar = 200,
            TotalEfectivo = 1800,
            TotalCuentaClinichm = 1600,
            IdSucursal = 2
        });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<CierreCajaResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerCierreCajaPorId()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);
         // Asegura un contexto limpio
        context.CierreCaja.RemoveRange(context.CierreCaja);
        await context.SaveChangesAsync();

        // Setup test
        var cierreCaja = new CierreCaja
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        };
        context.CierreCaja.Add(cierreCaja);
        await context.SaveChangesAsync();

        // Verifica que el cierre de caja fue guardado
        var cierreCajaGuardado = await context.CierreCaja.FirstOrDefaultAsync(c => c.MontoEfectivo == 1000);
        Assert.NotNull(cierreCajaGuardado); // Asegura que el cierre de caja fue guardado en la base de datos

        // Act
        var result = await controller.GetById(cierreCajaGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<CierreCajaResponseDTO>(actionResult.Value);
        Assert.Equal(1000, returnValue.MontoEfectivo);
    }

    [Fact]
    public async Task Update_DeberiaActualizarCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);
        // Asegura un contexto limpio
        context.CierreCaja.RemoveRange(context.CierreCaja);
        await context.SaveChangesAsync();

        // Setup test
        var cierreCaja = new CierreCaja
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        };
        context.CierreCaja.Add(cierreCaja);
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var cierreCajaDto = new CierreCajaDTO
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 2000,
            MontoTarjetaCredito = 1000,
            MontoDebito = 600,
            MontoTransferencia = 400,
            MontoDolar = 200,
            TotalEfectivo = 1800,
            TotalCuentaClinichm = 1600,
            IdSucursal = 2
        };

        // Act
        var result = await controller.Update(cierreCaja.Id, cierreCajaDto);

        // Assert: Verifica que solo hay un cierre de caja y que sus montos son los esperados
        var updatedCierreCaja = await service.GetByIdAsync(cierreCaja.Id);
        Assert.Equal(2000, updatedCierreCaja?.MontoEfectivo);
    }

    [Fact]
    public async Task Delete_DeberiaEliminarCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);
        // Asegura un contexto limpio
        context.CierreCaja.RemoveRange(context.CierreCaja);
        await context.SaveChangesAsync();

        // Setup test
        var cierreCaja = new CierreCaja
        {
            FechaHora = DateTime.Now,
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        };
        context.CierreCaja.Add(cierreCaja);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(cierreCaja.Id);

        // Assert
        var cierresCaja = await service.GetAllAsync(); 
        Assert.Empty(cierresCaja);
    }

    [Fact]
    public async Task ProcesarCierreDiario_DeberiaProcesarCierreCorrectamente()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);

        // Setup test
        var request = new CierreCajaRequestDTO
        {
            FechaHora = DateTime.Now,
            IdSucursal = 1
        };

        // Agregar movimientos de caja
        context.MovimientosCaja.AddRange(new MovimientoCaja
        {
            FechaHora = request.FechaHora,
            IdSucursal = request.IdSucursal,
            IdMedioPago = 1, // Efectivo
            Monto = 1000,
            NumeroFactura = "FAC001",
            TipoMovimiento = "Ingreso",
            IdMedico = 1
        },
        new MovimientoCaja
        {
            FechaHora = request.FechaHora,
            IdSucursal = request.IdSucursal,
            IdMedioPago = 2, // Tarjeta de Crédito
            Monto = 500,
            NumeroFactura = "FAC002",
            TipoMovimiento = "Ingreso",
            IdMedico = 2
        });

        // Agregar medios de pago
        context.MedioDePago.AddRange(new MedioDePago
        {
            Id = 1,
            MedioPago = "Efectivo Peso"
        },
        new MedioDePago
        {
            Id = 2,
            MedioPago = "Tarjeta de Crédito"
        });

        // Agregar tratamientos
        context.Tratamientos.AddRange(new Tratamientos
        {
            Id = 1,
            NombreTratamiento = "Tratamiento 1",
            Comision = 100,
            ComisionEncargado = 150,
            Descripcion = "Descripcion 1"
        },
        new Tratamientos
        {
            Id = 2,
            NombreTratamiento = "Tratamiento 2",
            Comision = 200,
            ComisionEncargado = 250,
            Descripcion = "Descripcion 2"
        });

        // Agregar roles
        context.RoleComision.AddRange(new RoleComision
        {
            Id = 1,
            Role = "Medico Regular"
        },
        new RoleComision
        {
            Id = 2,
            Role = "Encargado"
        });

        // Agregar médicos con roles
        context.Medicos.AddRange(new Medicos
        {
            Id = 1,
            Nombre = "Medico 1",
            Apellido = "Apellido 1",
            Matricula = "Matricula 1",
            SucursalId = 1,
            RoleId = 1 // Rol de médico regular
        },
        new Medicos
        {
            Id = 2,
            Nombre = "Medico 2",
            Apellido = "Apellido 2",
            Matricula = "Matricula 2",
            SucursalId = 1,
            RoleId = 2 // Rol de encargado
        });

        // Agregar comisiones
        context.PagoDeComisiones.AddRange(new PagoDeComisiones
        {
            MedicoId = 1,
            FechaDePago = DateTime.Now,
            MetodoDePago = "Efectivo Peso",
            Monto = 100,
            CierreDeCajaId = 0
        },
        new PagoDeComisiones
        {
            MedicoId = 2,
            FechaDePago = DateTime.Now,
            MetodoDePago = "Efectivo Peso",
            Monto = 200,
            CierreDeCajaId = 0
        });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.ProcesarCierreDiario(request);
        var actionResult = Assert.IsType<ActionResult<CierreCajaResponseDTO>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var cierreCaja = Assert.IsType<CierreCajaResponseDTO>(okResult.Value);

        // Assert
        Assert.Equal(1000, cierreCaja.TotalEfectivo); // 1000 - 100 (medico regular) - 250 (encargado)
        Assert.Equal(1, cierreCaja.IdSucursal);
    }

    [Fact]
    public async Task GetCierresDelMes_DeberiaTraerCierresDelMes()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));
        var controller = new CierreCajaController(service);

        // Setup test
        context.CierreCaja.AddRange(new CierreCaja
        {
            FechaHora = new DateTime(2023, 10, 1),
            MontoEfectivo = 1000,
            MontoTarjetaCredito = 500,
            MontoDebito = 300,
            MontoTransferencia = 200,
            MontoDolar = 100,
            TotalEfectivo = 900,
            TotalCuentaClinichm = 800,
            IdSucursal = 1
        },
        new CierreCaja
        {
            FechaHora = new DateTime(2023, 10, 15),
            MontoEfectivo = 2000,
            MontoTarjetaCredito = 1000,
            MontoDebito = 600,
            MontoTransferencia = 400,
            MontoDolar = 200,
            TotalEfectivo = 1800,
            TotalCuentaClinichm = 1600,
            IdSucursal = 1
        },
        new CierreCaja
        {
            FechaHora = new DateTime(2023, 9, 1),
            MontoEfectivo = 3000,
            MontoTarjetaCredito = 1500,
            MontoDebito = 900,
            MontoTransferencia = 600,
            MontoDolar = 300,
            TotalEfectivo = 2700,
            TotalCuentaClinichm = 2400,
            IdSucursal = 1
        });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetCierresDelMes(1, 10, 2023);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<CierreCajaMesResponseDTO>(actionResult.Value);

        Assert.Equal(2, returnValue.Detalle!.Count());
        Assert.All(returnValue.Detalle!.Take(2), c => Assert.Equal(10, c.FechaHora.Month));
        Assert.All(returnValue.Detalle!.Take(2), c => Assert.Equal(2023, c.FechaHora.Year));
        Assert.All(returnValue.Detalle!.Take(2), c => Assert.Equal(1, c.IdSucursal));
        
        // Verificar el resumen
        //var resumen = returnValue.Last();
        Assert.Equal("Resumen de Totales", returnValue.Resumen!.Mensaje);
        Assert.Equal(3000, returnValue.Resumen!.MontoEfectivo);
        Assert.Equal(1500, returnValue.Resumen!.MontoTarjetaCredito);
        Assert.Equal(900, returnValue.Resumen!.MontoDebito);
        Assert.Equal(600, returnValue.Resumen!.MontoTransferencia);
        Assert.Equal(300, returnValue.Resumen!.MontoDolar);
        Assert.Equal(2700, returnValue.Resumen!.TotalEfectivo);
        Assert.Equal(2400, returnValue.Resumen!.TotalCuentaClinichm);
    }
}
