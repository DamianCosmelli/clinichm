using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using clinichm_api.Services.Implements;

namespace clinichm_api.Tests
{
    public class EmpleadoControllerTests
    {
        private AppDbContext CreateNewContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task Create_DeberiaAgregarEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));
            var controller = new EmpleadoController(service);
            // Setup test
            var empleadoDto = new EmpleadoDTO { Nombre = "Juan", Apellido= "Perez" , DNI="12345678"};

            // Act
            var result = await controller.Create(empleadoDto);
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);

            // Verificar que ahora hay 1 empleado en la BD
            var empleados = await service.GetAllAsync();
            Assert.Single(empleados);
            Assert.Equal("Juan", empleados.First().Nombre);
        }

        [Fact]
        public async Task GetAll_DeberiaTraerListaDeEmpleados()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));
            var controller = new EmpleadoController(service);
            // Asegura un contexto limpio
            context.Empleado.RemoveRange(context.Empleado);
            await context.SaveChangesAsync();

            // Setup test
            context.Empleado.AddRange(new Empleado { Nombre = "Juan", Apellido= "Perez" , DNI="12345678"}, new Empleado { Nombre = "Pedro", Apellido="Escobar" , DNI="12345678"});
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetAll();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<EmpleadoResponseDTO>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetById_DeberiaTraerEmpleadoPorId()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));
            var controller = new EmpleadoController(service);
            // Asegura un contexto limpio
            context.Empleado.RemoveRange(context.Empleado);
            await context.SaveChangesAsync();

            // Setup test
            var empleado = new Empleado { Nombre = "Carlos" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();

            // Verifica que el empleado fue guardado
            var empleadoGuardado = await context.Empleado.FirstOrDefaultAsync(e => e.Nombre == "Carlos");
            Assert.NotNull(empleadoGuardado); // Asegura que el empleado fue guardado en la base de datos

            // Act
            var result = await controller.GetById(empleadoGuardado.Id);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<EmpleadoResponseDTO>(actionResult.Value);
            Assert.Equal("Carlos", returnValue.Nombre);
        }

        [Fact]
        public async Task Update_DeberiaActualizarEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));
            var controller = new EmpleadoController(service);
            // Asegura un contexto limpio
            context.Empleado.RemoveRange(context.Empleado);
            await context.SaveChangesAsync();

            // Setup test
            var empleado = new Empleado { Nombre = "Carlos" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();
            var empleadoDto = new EmpleadoDTO { Nombre = "Juan Carlos" , Apellido= "Perez", DNI="12345678"};

            // Act
            var result = await controller.Update(empleado.Id, empleadoDto);

            // Assert: Verifica que solo hay un empleado y que su nombre es el esperado
            var empleadoActualizado = await service.GetByIdAsync(empleado.Id);
            Assert.Equal("Juan Carlos", empleadoActualizado?.Nombre);
        }

        [Fact]
        public async Task Delete_DeberiaEliminarEmpleado()
        {
            using var context = CreateNewContext();
            var service = new EmpleadoService(new Repository<Empleado>(context));
            var controller = new EmpleadoController(service);
            // Asegura un contexto limpio
            context.Empleado.RemoveRange(context.Empleado);
            await context.SaveChangesAsync();

            // Setup test
            var empleado = new Empleado { Nombre = "Juan Carlos" , Apellido= "Perez", DNI="12345678"};
            context.Empleado.Add(empleado);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.Delete(empleado.Id);

            // Assert
            var empleados = await service.GetAllAsync();
            Assert.Empty(empleados);
        }
    }
}
