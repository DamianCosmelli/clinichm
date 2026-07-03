using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using clinichm_api.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using clinichm_api.Services;

namespace clinichm_api.Tests
{
    public class StockControllerTest
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task Create_DeberiaAgregarStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var controller = new StockController(service, new ExcelServices(context));
            var dto = new StockDTO { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };

            var result = await controller.Create(dto);
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);

            var stocks = await service.GetAllAsync();
            Assert.Single(stocks);
            Assert.Equal("A", ((List<StockResponseDTO>)stocks)[0].Lote);
        }

        [Fact]
        public async Task GetAll_DeberiaTraerListaDeStocks()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var controller = new StockController(service, new ExcelServices(context));
            context.Stock.AddRange(
                new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" },
                new Stock { ProductoId = 2, Lote = "B", Vencimiento = new DateOnly(2025, 2, 1), CantidadIngreso = 20, CantidadExistente = 20, FechaIngreso = new DateOnly(2024, 2, 1), Deposito = "Sucursal" }
            );
            await context.SaveChangesAsync();

            var result = await controller.GetAll();
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<StockResponseDTO>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetById_DeberiaTraerStockPorId()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var controller = new StockController(service, new ExcelServices(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var result = await controller.GetById(stock.Id);
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<StockResponseDTO>(actionResult.Value);
            Assert.Equal("A", returnValue.Lote);
        }

        [Fact]
        public async Task Update_DeberiaActualizarStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var controller = new StockController(service, new ExcelServices(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var dto = new StockDTO { ProductoId = 1, Lote = "B", Vencimiento = new DateOnly(2025, 2, 1), CantidadIngreso = 20, CantidadExistente = 15, FechaIngreso = new DateOnly(2024, 2, 1), Deposito = "Sucursal" };
            var result = await controller.Update(stock.Id, dto);

            var updated = await service.GetByIdAsync(stock.Id);
            Assert.Equal("B", updated?.Lote);
            Assert.Equal(15, updated?.CantidadExistente);
        }

        [Fact]
        public async Task Delete_DeberiaEliminarStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var controller = new StockController(service, new ExcelServices(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var result = await controller.Delete(stock.Id);

            var stocks = await service.GetAllAsync();
            Assert.Empty(stocks);
        }
    }
}
