using clinichm_api.Controllers;
using clinichm_api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore.InMemory.Query.Internal;
using NuGet.Protocol;

namespace clinichm_api.Tests
{
    public class ImportDataControllerTest
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CargarMasivo_ReturnsOkResult_WithSuccessMessage()
        {
            using var _context = CreateNewContext();
            var _controller = new ImportDataController(_context);
            var __services = new ExcelServices(_context);

            // Arrange
            string modelo = "Medicos";
            var projectDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".."));
            var filePath = Path.Combine(projectDir, "Mocks", "Medicos_TestPlantilla.xlsx");
            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var file = new FormFile(stream, 0, stream.Length, "file", Path.GetFileName(filePath));

            // Act
            var result = await _controller.CargarMasivo(modelo, file);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value?.ToString()  ;
            Assert.Contains("4 registros cargados en Medicos con éxito.", returnValue);
        }
    }
}