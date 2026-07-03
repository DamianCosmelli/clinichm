using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace clinichm_api.Tests
{
    public class AuditStockServiceTest
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfAuditStock()
        {
            using var context = CreateNewContext();
            var service = new AuditStockService(new Repository<AuditStock>(context));
            context.AuditStock.AddRange(
                new AuditStock { Fecha = System.DateTime.Now, IdRegistro = 1, CantPrevia = 10, CantNueva = 8, TipoMovimiento = "Descuento", UsuarioId = 1 },
                new AuditStock { Fecha = System.DateTime.Now, IdRegistro = 2, CantPrevia = 5, CantNueva = 7, TipoMovimiento = "Actualización", UsuarioId = 2 }
            );
            await context.SaveChangesAsync();

            var result = await service.GetAllAsync();
            Assert.Equal(2, result.Count());
        }
    }
}
