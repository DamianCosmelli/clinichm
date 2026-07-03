using Microsoft.EntityFrameworkCore;
using clinichm_api.Models;


public static class SeedData
{
    public static void Configure(ModelBuilder modelBuilder)
    {
        //Genera roles base
        modelBuilder.Entity<Rol>().HasData(
            new Rol { Id = 1, Nombre = "Admin" },
            new Rol { Id = 2, Nombre = "Recepcion" },
            new Rol { Id = 3, Nombre = "Turnos" },
            new Rol { Id = 4, Nombre = "Caja" },
            new Rol { Id = 5, Nombre = "Stock" }
        );

        // genera medios de pago disponibles
        modelBuilder.Entity<MedioDePago>().HasData(
            new MedioDePago { Id = 1, MedioPago = "Efectivo Peso" },
            new MedioDePago { Id = 2, MedioPago = "Efectivo Dolar" },
            new MedioDePago { Id = 3, MedioPago = "Tarjeta de Debito" },
            new MedioDePago { Id = 4, MedioPago = "Tarjeta de Credito" },
            new MedioDePago { Id = 5, MedioPago = "Transferencia" },
            new MedioDePago { Id = 6, MedioPago = "Sin Cargo" }
        );

        // genera estados de turnos
        modelBuilder.Entity<EstadosTurnos>().HasData(
            new EstadosTurnos { Id = 1, Estado = "Confirmado", Color = "verde", Descripcion = "Turno confirmado por paciente" },
            new EstadosTurnos { Id = 2, Estado = "Sin Confirmar", Color = "celeste", Descripcion = "Turno sin confirmar" },
            new EstadosTurnos { Id = 3, Estado = "Cancelado", Color = "violeta", Descripcion = "Turno cancelado" },
            new EstadosTurnos { Id = 4, Estado = "Reprogramado", Color = "azul", Descripcion = "Turno reprogramado" },
            new EstadosTurnos { Id = 5, Estado = "Numero No Encontrado", Color = "rosa", Descripcion = "Numero de celular no encontrado" }
        );

        // genera roles de comisiones 
        modelBuilder.Entity<RoleComision>().HasData(
            new RoleComision { Id = 1, Role = "Comision" },
            new RoleComision { Id = 2, Role = "Encargado" },
            new RoleComision { Id = 3, Role = "Especial" }
        );

        //Sucursales
        modelBuilder.Entity<Sucursales>().HasData(
            new Sucursales { Id = 1, Nombre = "Flores", Direccion = "Av. Gaona 3707", Ciudad = "CABA", CodigoPostal = "1416" },
            new Sucursales { Id = 2, Nombre = "Lomas", Direccion = "Av. Rivadavia 5000", Ciudad = "Lomas de Zamora", CodigoPostal = "1400" }
        );

        //TipoMovimiento
        modelBuilder.Entity<TipoMovimiento>().HasData(
            new TipoMovimiento { Id = 1, Descripcion = "Cobro" },
            new TipoMovimiento { Id = 2, Descripcion = "Retiro" }
        );

        //CategoriaProd (Hialuronico, Toxina Botulinica, Bioestimulador, Enzimas, Insumo)
        modelBuilder.Entity<CategoriaProd>().HasData(
            new CategoriaProd { Id = 1, Nombre = "Hialuronico" },
            new CategoriaProd { Id = 2, Nombre = "Toxina Botulinica" },
            new CategoriaProd { Id = 3, Nombre = "Bioestimulador" },
            new CategoriaProd { Id = 4, Nombre = "Enzimas" },
            new CategoriaProd { Id = 5, Nombre = "Insumo" }
        );

        //Medicos - Equipo Medico
        modelBuilder.Entity<Medicos>().HasData(
            new Medicos { Id = 1, Nombre = "Equipo", Apellido = "Medico", Matricula = "0", RoleId = 0, SucursalId = 0 }
            );


    }
}