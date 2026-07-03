using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class PacienteControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);
        // Setup test
        var pacienteDto = new PacienteDTO { Nombre = "Luis", Apellido = "Badia", Celular= "1124566565", Email="badia@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram"};

        // Act
        var result = await controller.Create(pacienteDto);
        var actionResult = Assert.IsType<ActionResult<PacienteResponseDTO>>(result);

        // Verificar que ahora hay 1 persona en la BD
        var paciente = await service.GetAllAsync();
        Assert.Single(paciente);
        Assert.Equal("Luis", paciente.First().Nombre);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDePacientes()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);
        // Asegura un contexto limpio
        context.Pacientes.RemoveRange(context.Pacientes);
        await context.SaveChangesAsync();

        // Setup test
        context.Pacientes.AddRange(new Pacientes { Nombre = "Luis", Apellido = "Badia", Celular= "1124566565", Email="badia@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram" },
                              new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular= "1124566565", Email="badia@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram" });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);

        // Aquí, solo esperamos IEnumerable<RolDTO> en lugar de una List
        var returnValue = Assert.IsType<List<PacienteResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);
         // Asegura un contexto limpio
        context.Pacientes.RemoveRange(context.Pacientes);
        await context.SaveChangesAsync();

        // Setup test
        context.Pacientes.AddRange(new Pacientes { Nombre = "Badia", Apellido = "Luis", Celular= "1124566565", Email="badia@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram"});
        await context.SaveChangesAsync();

        // Verifica que el rol fue guardado
        var pacienteGuardado = await context.Pacientes.FirstOrDefaultAsync(p => p.Nombre == "Badia");
        Assert.NotNull(pacienteGuardado); // Asegura que el rol fue guardado en la base de datos


        // Act
        var result = await controller.GetById(pacienteGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<PacienteResponseDTO>(actionResult.Value);
        Assert.Equal("Badia", returnValue.Nombre);

    }
     [Fact]
    public async Task Update_DeberiaActualizarPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);
        // Asegura un contexto limpio
        context.Pacientes.RemoveRange(context.Pacientes);
        await context.SaveChangesAsync();

        // Setup test
        context.Pacientes.AddRange(new Pacientes { Id=1, Nombre = "Juan", Apellido = "Pedro", Celular= "1124566565", Email="badia@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram" });
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var pacienteDto = new PacienteDTO {Nombre = "Juan pablo", Apellido = "Pedro", Celular= "1124566565", Email="badiaJuan@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram"};

        // Act
        var result = await controller.Update(1, pacienteDto);

        // Assert: Verifica que solo hay un rol y que su nombre es el esperado
        var paciente = await service.GetByIdAsync(1);
        Assert.Equal("Juan pablo", paciente?.Nombre);

    }
     [Fact]
    public async Task Deleted_DeberiaElimimarPaciente()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);
        // Asegura un contexto limpio
        context.Pacientes.RemoveRange(context.Pacientes);
        await context.SaveChangesAsync();

        // Setup test
        context.Pacientes.AddRange(new Pacientes { Nombre = "Juan", Apellido = "Pedro", Celular= "1124566565", Email="badiaJuan@gmail.com", DNI="42345654" ,Direccion = "Calle 123", CodigoPostal= "1618", MedioPublicidad="Instagram"});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        //assert
        var paciente = await service.GetAllAsync(); 
        Assert.Empty(paciente);


    }

    [Fact]
    public async Task GetPacientesPorMedico_DeberiaTraerPacientesAgrupadosPorMedico()
    {
        using var context = CreateNewContext();
        var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
        var controller = new PacientesController(service);

        // Setup test
        context.RecepcionPacientes.AddRange(
            new RecepcionPacientes {  PacienteId = 1, MedicoId = 1 , EstadoRecepcion = "En Espera"},
            new RecepcionPacientes {  PacienteId = 2, MedicoId = 1 , EstadoRecepcion = "En Espera"},
            new RecepcionPacientes {  PacienteId = 3, MedicoId = 2 , EstadoRecepcion = "En Espera"}
        );
        context.Pacientes.AddRange(
            new Pacientes { Id = 1, Nombre = "Juan", Apellido = "Perez", Celular = "123456789", Email = "juan.perez@example.com", DNI = "12345678", Direccion = "Calle Falsa 123", CodigoPostal = "1234", MedioPublicidad = "Internet" },
            new Pacientes { Id = 2, Nombre = "Maria", Apellido = "Gomez", Celular = "987654321", Email = "maria.gomez@example.com", DNI = "87654321", Direccion = "Avenida Siempre Viva 456", CodigoPostal = "5678", MedioPublicidad = "TV" },
            new Pacientes { Id = 3, Nombre = "Carlos", Apellido = "Lopez", Celular = "555555555", Email = "carlos.lopez@example.com", DNI = "55555555", Direccion = "Calle 123", CodigoPostal = "7890", MedioPublicidad = "Radio" }
        );
         await context.SaveChangesAsync();

        // Act
        var result = await controller.GetPacientesPorMedico();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<PacientesPorMedicoDTO>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count); // Dos médicos diferentes
        Assert.Equal(2, returnValue.First().Pacientes.Count); // Dos pacientes para el primer médico
    }

        [Fact]
        public async Task GetByDNI_DeberiaTraerPacientePorDNI()
        {
            using var context = CreateNewContext();
            var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
            var controller = new PacientesController(service);

            // Setup test
            context.Pacientes.Add(new Pacientes { Nombre = "Luis", Apellido = "Badia", Celular = "1124566565", Email = "badia@gmail.com", DNI = "42345654", Direccion = "Calle 123", CodigoPostal = "1618", MedioPublicidad = "Instagram" });
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetByDNI(new PacienteDNIDTO { DNI = "42345654" });

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<PacienteResponseDTO>(actionResult.Value);
            Assert.Equal("Luis", returnValue.Nombre);
        }

        [Fact]
        public async Task GetByDNI_DeberiaRetornarNotFoundSiNoExiste()
        {
            using var context = CreateNewContext();
            var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
            var controller = new PacientesController(service);

            // Act
            var result = await controller.GetByDNI(new PacienteDNIDTO { DNI = "99999999" });

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetPacientesSoloConsulto_DeberiaTraerPacientesQueSoloConsultaron()
        {
            using var context = CreateNewContext();
            var service = new PacienteServices(new Repository<Pacientes>(context), new PacienteRepository(context));
            var controller = new PacientesController(service);

            // Setup test
            context.Pacientes.AddRange(
                new Pacientes { Id = 1, Nombre = "Juan", Apellido = "Perez", Celular = "123456789", Email = "juan.perez@example.com", DNI = "12345678", Direccion = "Calle Falsa 123", CodigoPostal = "1234", MedioPublicidad = "Internet", SoloConsulto = true },
                new Pacientes { Id = 2, Nombre = "Maria", Apellido = "Gomez", Celular = "987654321", Email = "maria.gomez@example.com", DNI = "87654321", Direccion = "Avenida Siempre Viva 456", CodigoPostal = "5678", MedioPublicidad = "TV", SoloConsulto = false },
                new Pacientes { Id = 3, Nombre = "Carlos", Apellido = "Lopez", Celular = "555555555", Email = "carlos.lopez@example.com", DNI = "55555555", Direccion = "Calle 123", CodigoPostal = "7890", MedioPublicidad = "Radio", SoloConsulto = true }
            );
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetPacientesSoloConsulto();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<PacienteResponseDTO>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count); // Dos pacientes que solo consultaron
        }
}