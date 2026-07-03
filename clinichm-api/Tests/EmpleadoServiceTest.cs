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
    public class EmpleadoServiceTests
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfEmpleados()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            context.Empleado.AddRange(new Empleado { Nombre = "Juan" , Apellido= "Perez", DNI="12345678"}, new Empleado { Nombre = "Pedro" , Apellido="Escobar", DNI="12345678"});
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ExistingId_ReturnsEmpleadoDTO()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            var empleado = new Empleado { Nombre = "Juan" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetByIdAsync(empleado.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Juan", result?.Nombre);
        }

        [Fact]
        public async Task GetByIdAsync_NonExistingId_ReturnsNull()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Act
            var result = await service.GetByIdAsync(99);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ValidEmpleadoDTO_CreatesEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            var empleadoDto = new EmpleadoDTO { Nombre = "Nicolas", Apellido= "Perez", DNI="12345678" };

            // Act
            await service.AddAsync(empleadoDto);
            var result = await context.Empleado.FirstOrDefaultAsync(e => e.Nombre == "Nicolas");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Nicolas", result?.Nombre);
        }

        [Fact]
        public async Task UpdateAsync_ExistingId_UpdatesEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            var empleado = new Empleado { Nombre = "Nicolas" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();
            var empleadoDto = new EmpleadoDTO { Nombre = "Carlos" , Apellido= "Perez", DNI="12345678"};

            // Act
            var result = await service.UpdateAsync(empleado.Id, empleadoDto);
            var updatedEmpleado = await context.Empleado.FindAsync(empleado.Id);

            // Assert
            Assert.Equal("Carlos", updatedEmpleado?.Nombre);
        }

        [Fact]
        public async Task UpdateAsync_NonExistingId_ReturnsFalse()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            var empleadoDto = new EmpleadoDTO { Nombre = "Carlos" , Apellido= "Perez", DNI="12345678"};

            // Act
            var result = await service.UpdateAsync(99, empleadoDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ExistingId_DeletesEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Setup test
            var empleado = new Empleado { Nombre = "Nicolas" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteAsync(empleado.Id);
            var deletedEmpleado = await context.Empleado.FindAsync(empleado.Id);

            // Assert
            Assert.True(result);
            Assert.Null(deletedEmpleado);
        }

        [Fact]
        public async Task DeleteAsync_NonExistingId_ReturnsFalse()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));

            // Act
            var result = await service.DeleteAsync(99);

            // Assert
            Assert.False(result);
        }
    }
}
