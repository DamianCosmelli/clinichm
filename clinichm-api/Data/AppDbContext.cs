using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using clinichm_api.Models;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace clinichm_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        UniqueConstraintsConfig.ApplyUniqueConstraints(modelBuilder);
        SeedData.Configure(modelBuilder);

        // Excluir Password de la conversión
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(string) && property.Name == "Password")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
                if (property.ClrType == typeof(string) && property.Name == "Email")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
                if (property.ClrType == typeof(string) && property.Name == "MedioPublicidad")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
                if (property.ClrType == typeof(string) && property.Name == "UserName")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
                if (property.ClrType == typeof(string) && property.Name == "Lote")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
                if (property.ClrType == typeof(string) && property.Name == "Notas")
                {
                    property.SetValueConverter((ValueConverter?)null);
                }
            }
        }
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // Aplica el convertidor a todos los strings
        configurationBuilder
            .Properties<string>()
            .HaveConversion<CapitalizeStringConverter>();
    }

    // Agrega DbSet<T> para cada entidad que desees mapear
    public DbSet<Medicos> Medicos { get; set; }
    public DbSet<Tratamientos> Tratamientos { get; set; }
    public DbSet<Sucursales> Sucursales { get; set; }
    public DbSet<Pacientes> Pacientes { get; set; }
    public DbSet<Turnos> Turnos { get; set; }
    public DbSet<EstadosTurnos> EstadosTurnos { get; set; }
    public DbSet<Rol> Rol { get; set; }
    public DbSet<Usuario> Usuario { get; set; }
    public DbSet<Empleado> Empleado { get; set; }
    public DbSet<AgendaMedica> AgendaMedica { get; set; }
    public DbSet<MedioDePago> MedioDePago { get; set; }
    public DbSet<MovimientoCaja> MovimientosCaja { get; set; }
    public DbSet<RoleComision> RoleComision { get; set; }
    public DbSet<CierreCaja> CierreCaja { get; set; }
    public DbSet<MedicoTratamiento> MedicoTratamiento { get; set; }
    public DbSet<RecepcionPacientes> RecepcionPacientes { get; set; }
    public DbSet<PagoDeComisiones> PagoDeComisiones { get; set; }
    public DbSet<UsuarioAudit> UsuarioAudit { get; set; }
    public DbSet<TipoMovimiento> TipoMovimiento { get; set; }
    public DbSet<CategoriaProd> CategoriaProd { get; set; }
    public DbSet<Producto> Producto { get; set; }
    public DbSet<TurnosAfectados> TurnosAfectados { get; set; }
    public DbSet<Stock> Stock { get; set; }
    public DbSet<AuditStock> AuditStock { get; set; }

    public DbSet<CobroProductos> CobroProductos { get; set; }
    public DbSet<CobroTratamientos> CobroTratamientos { get; set; }
    public DbSet<Vouchers> Vouchers { get; set; }
    public DbSet<CobroNotas> CobroNotas { get; set; }
        
    }

