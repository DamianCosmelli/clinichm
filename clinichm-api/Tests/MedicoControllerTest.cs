using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Controllers;

namespace clinichm_api.Tests;

public class MedicoControllerTests
{
    private AppDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Base de datos única por test
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_DeberiaAgregarMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));
        var controller = new MedicosController(service);
        // Setup test
        var medicoDto = new MedicoDTO { Nombre = "Juan", Apellido = "Perez", Matricula = "1234", SucursalId = 1};

        // Act
        var result = await controller.Create(medicoDto);
        var actionResult = Assert.IsType<CreatedAtActionResult>(result);

        // Verificar que ahora hay 1 persona en la BD
        var rol = await service.GetAllAsync();
        Assert.Single(rol);
        Assert.Equal("Juan", rol.First().Nombre);
    }

    [Fact]
    public async Task Getall_DeberiaTraerListaDeMedicos()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));
        var controller = new MedicosController(service);
        // Asegura un contexto limpio
        context.Medicos.RemoveRange(context.Medicos);
        await context.SaveChangesAsync();

        // Setup test
        context.Medicos.AddRange(new Medicos { Nombre = "Juan", Apellido = "Perez", Matricula = "1234", SucursalId = 1},
                                  new Medicos { Nombre = "Pedro", Apellido = "Lopez", Matricula = "1274", SucursalId = 1});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);

        // Aquí, solo esperamos IEnumerable<RolDTO> en lugar de una List
        var returnValue = Assert.IsType<List<MedicoResponseDTO>>(actionResult.Value);
        
        // Asegurarnos de que haya 2 elementos en la secuencia
        Assert.Equal(2, returnValue.Count());
    }

    [Fact]
    public async Task GetById_DeberiaTraerxIdMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));
        var controller = new MedicosController(service);
         // Asegura un contexto limpio
        context.Medicos.RemoveRange(context.Medicos);
        await context.SaveChangesAsync();

        // Setup test
        context.Medicos.AddRange(new Medicos { Nombre = "carlos", Apellido = "Lopez", Matricula = "1774", SucursalId = 1});
        await context.SaveChangesAsync();

        // Verifica que el rol fue guardado
        var medicoGuardado = await context.Medicos.FirstOrDefaultAsync(m => m.Nombre == "Carlos");
        Assert.NotNull(medicoGuardado); // Asegura que el rol fue guardado en la base de datos


        // Act
        var result = await controller.GetById(medicoGuardado.Id);

        // Assert
        var actionResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<MedicoResponseDTO>(actionResult.Value);
        Assert.Equal("carlos", returnValue.Nombre);

    }

    [Fact]
    public async Task Update_DeberiaActualizarMedico()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));
        var controller = new MedicosController(service);
        // Asegura un contexto limpio
        context.Medicos.RemoveRange(context.Medicos);
        await context.SaveChangesAsync();

        // Setup test
        context.Medicos.AddRange(new Medicos { Id=1 ,Nombre = "carlos", Apellido = "Bou", Matricula = "1974", SucursalId = 1});
        await context.SaveChangesAsync();
        // Nuevo registro actualizado
        var medicoDto = new MedicoDTO { Nombre = "juan carlos", Apellido = "Bou", Matricula = "1974", SucursalId = 1};

        // Act
        var result = await controller.Update(1, medicoDto);

        // Assert: Verifica que solo hay un rol y que su nombre es el esperado
        var medico = await service.GetByIdAsync(1);
        Assert.Equal("juan carlos", medico?.Nombre);

    }

    [Fact]
    public async Task Deleted_DeberiaElimimarRol()
    {
        using var context = CreateNewContext();
        var service = new MedicoService(new Repository<Medicos>(context));
        var controller = new MedicosController(service);
        // Asegura un contexto limpio
        context.Medicos.RemoveRange(context.Medicos);
        await context.SaveChangesAsync();

        // Setup test
        context.Medicos.AddRange(new Medicos { Nombre = "juan carlos", Apellido = "Bou", Matricula = "1974", SucursalId = 1});
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        //assert
        var medico = await service.GetAllAsync(); 
        Assert.Empty(medico);


    }

}