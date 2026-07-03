using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests;

public class CierreCajaServiceTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsCierreCajaDTO()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        var result = await service.GetByIdAsync(cierreCaja.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1000, result.MontoEfectivo);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

        // Act
        var result = await service.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ValidCierreCajaDTO_CreatesCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        await service.AddAsync(cierreCajaDto);
        var result = await context.CierreCaja.FirstOrDefaultAsync(c => c.MontoEfectivo == 1000);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1000, result.MontoEfectivo);
    }

    [Fact]
    public async Task UpdateAsync_ExistingId_UpdatesCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        var result = await service.UpdateAsync(cierreCaja.Id, cierreCajaDto);
        var updatedCierreCaja = await context.CierreCaja.FindAsync(cierreCaja.Id);

        // Assert
        Assert.Equal(2000, updatedCierreCaja?.MontoEfectivo);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

        // Setup test
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
        var result = await service.UpdateAsync(99, cierreCajaDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingId_DeletesCierreCaja()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        var result = await service.DeleteAsync(cierreCaja.Id);
        var deletedCierreCaja = await context.CierreCaja.FindAsync(cierreCaja.Id);

        // Assert
        Assert.True(result);
        Assert.Null(deletedCierreCaja);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

        // Act
        var result = await service.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ProcesarCierreDiarioAsync_DeberiaProcesarCierreCorrectamente()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

        // Setup test
        var request = new CierreCajaRequestDTO
        {
            FechaHora = DateTime.Now,
            IdSucursal = 1
        };

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
        var result = await service.ProcesarCierreDiarioAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1000, result.TotalEfectivo); // 1000 - 100 (medico regular) - 250 (encargado)
        Assert.Equal(1, result.IdSucursal);
    }

    [Fact]
    public async Task GetCierresDelMesAsync_ReturnsCierresDelMes()
    {
        using var context = CreateNewContext();
        var service = new CierreCajaService(new Repository<CierreCaja>(context), new CierreCajaRepository(context));

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
        var result = await service.GetCierresDelMesAsync(1, 10, 2023);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Detalle!.Count()); // Incluye el resumen
        Assert.All(result.Detalle!.Take(2), c => Assert.Equal(10, c.FechaHora.Month));
        Assert.All(result.Detalle!.Take(2), c => Assert.Equal(2023, c.FechaHora.Year));
        Assert.All(result.Detalle!.Take(2), c => Assert.Equal(1, c.IdSucursal));
        
        // Verificar el resumen
        Assert.Equal("Resumen de Totales", result.Resumen!.Mensaje);
        Assert.Equal(3000, result.Resumen!.MontoEfectivo);
        Assert.Equal(1500, result.Resumen!.MontoTarjetaCredito);
        Assert.Equal(900, result.Resumen!.MontoDebito);
        Assert.Equal(600, result.Resumen!.MontoTransferencia);
        Assert.Equal(300, result.Resumen!.MontoDolar);
        Assert.Equal(2700, result.Resumen!.TotalEfectivo);
        Assert.Equal(2400, result.Resumen!.TotalCuentaClinichm);
    }
}
