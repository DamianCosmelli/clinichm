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

namespace clinichm_api.Tests
{
    public class AuditStockControllerTest
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAll_DeberiaTraerListaDeAuditStock()
        {
            using var context = CreateNewContext();
            var service = new AuditStockService(new Repository<AuditStock>(context));
            var controller = new AuditStockController(service);
            context.AuditStock.AddRange(
                new AuditStock { Fecha = System.DateTime.Now, IdRegistro = 1, CantPrevia = 10, CantNueva = 8, TipoMovimiento = "Descuento", UsuarioId = 1 },
                new AuditStock { Fecha = System.DateTime.Now, IdRegistro = 2, CantPrevia = 5, CantNueva = 7, TipoMovimiento = "Actualización", UsuarioId = 2 }
            );
            await context.SaveChangesAsync();

            var result = await controller.GetAll();
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<AuditStockResponseDTO>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}
