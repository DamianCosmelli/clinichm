using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace clinichm_api.Tests
{
    public class StockServiceTest
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfStocks()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            context.Stock.AddRange(
                new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" },
                new Stock { ProductoId = 2, Lote = "B", Vencimiento = new DateOnly(2025, 2, 1), CantidadIngreso = 20, CantidadExistente = 20, FechaIngreso = new DateOnly(2024, 2, 1), Deposito = "Sucursal" }
            );
            await context.SaveChangesAsync();

            var result = await service.GetAllAsync();
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ExistingId_ReturnsStockDTO()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var result = await service.GetByIdAsync(stock.Id);
            Assert.NotNull(result);
            Assert.Equal("A", result?.Lote);
        }

        [Fact]
        public async Task AddAsync_CreatesStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var dto = new StockDTO { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };

            var result = await service.AddAsync(dto);
            Assert.NotNull(result);
            Assert.Equal("A", result.Lote);
        }

        [Fact]
        public async Task UpdateAsync_ExistingId_UpdatesStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var dto = new StockDTO { ProductoId = 1, Lote = "B", Vencimiento = new DateOnly(2025, 2, 1), CantidadIngreso = 20, CantidadExistente = 15, FechaIngreso = new DateOnly(2024, 2, 1), Deposito = "Sucursal" };
            var result = await service.UpdateAsync(stock.Id, dto);

            Assert.NotNull(result);
            Assert.Equal("B", result.Lote);
            Assert.Equal(15, result.CantidadExistente);
        }

        [Fact]
        public async Task DeleteAsync_ExistingId_DeletesStock()
        {
            using var context = CreateNewContext();
            var service = new StockService(new StockRepository(context));
            var stock = new Stock { ProductoId = 1, Lote = "A", Vencimiento = new DateOnly(2025, 1, 1), CantidadIngreso = 10, CantidadExistente = 10, FechaIngreso = new DateOnly(2024, 1, 1), Deposito = "Central" };
            context.Stock.Add(stock);
            await context.SaveChangesAsync();

            var result = await service.DeleteAsync(stock.Id);
            Assert.True(result);
            Assert.Null(await context.Stock.FindAsync(stock.Id));
        }
    }
}
