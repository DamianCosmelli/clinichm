using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using clinichm_api.Models;


namespace clinichm_api.Data;

public static class UniqueConstraintsConfig
{
    public static void ApplyUniqueConstraints(ModelBuilder modelBuilder)
    {
        foreach (var entry in UniqueFields)
        {
            var entityType = entry.Key;
            var fields = entry.Value;

            foreach (var field in fields)
            {
                modelBuilder.Entity(entityType)
                    .HasIndex(field)
                    .IsUnique();
            }
        }
    }
    private static readonly Dictionary<Type, string[]> UniqueFields = new()
    {
        { typeof(Usuario), new[] { "UserName" } },
        { typeof(Pacientes), new[] { "DNI" } },
        { typeof(Empleado), new[] { "DNI" } },
        { typeof(EstadosTurnos), new[] { "Estado" } },
        { typeof(Medicos), new[] { "Matricula" } },
        { typeof(MedioDePago), new[] { "MedioPago" } },
        { typeof(Rol), new[] { "Nombre" } },
        { typeof(RoleComision), new[] { "Role" } },
        { typeof(Sucursales), new[] { "Nombre" } },
        { typeof(Tratamientos), new[] { "NombreTratamiento" } }
        
    };


}
