using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using clinichm_api.Data;
using clinichm_api.Services;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace clinichm_api.Tests
{
    public class ExcelServicesTest
    {
        private readonly ExcelServices _excelServices;

        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
                .Options;

            return new AppDbContext(options);
        }
        

        public ExcelServicesTest()
        {
            using var context = CreateNewContext();
            _excelServices = new ExcelServices(context);
        }

        [Fact]
        public void GenerarExcelModelo_ModeloValido_GeneraArchivoExcel()
        {
            // Arrange
            string modelo = "Medicos";
            // Act
            var result = _excelServices.GenerarExcelModelo(modelo);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", result.ContentType);
            Assert.Equal($"{modelo}_Plantilla.xlsx", result.FileDownloadName);
        }

        [Fact]
        public async Task CargarMasivoExcel_ArchivoValido_CargaDatosCorrectamente()
        {
            using var context = CreateNewContext();
            context.Database.EnsureCreated();
            var _excelServicesFile=new ExcelServices(context);

            // Arrange
            string modelo = "Medicos";
            var projectDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".."));
            var filePath = Path.Combine(projectDir, "Mocks", "Medicos_TestPlantilla.xlsx");
            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var file = new FormFile(stream, 0, stream.Length, "file", Path.GetFileName(filePath));
        
            // Act
            var (registrosExitosos, errores) = await _excelServicesFile.CargarMasivoExcel(modelo, file);

            // Assert
            Assert.Equal(4, registrosExitosos);
            Assert.Empty(errores);
        }

    }
}
