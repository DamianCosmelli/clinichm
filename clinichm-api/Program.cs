using Microsoft.EntityFrameworkCore;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Extensions;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using clinichm_api.Utils;
using System.Reflection;
using Serilog;
using Serilog.Events;
using clinichm_api.Middleware;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Configurar Serilog antes de construir la aplicación
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information() // Nivel mínimo de logs
    .WriteTo.Console() // Escribe en la consola
    .WriteTo.File(
        "logs/log-.log", //carpeta logs y formato de archivo
        rollingInterval: RollingInterval.Day, // Archivo diario
        retainedFileCountLimit: 5, // Limita el número de archivos a 5
        rollOnFileSizeLimit: true, // Rota los archivos si superan el tamaño límite
        fileSizeLimitBytes: 10485760 // Tamaño de archivo máximo de 10 MB
    )
    .Enrich.FromLogContext() // Añadir contexto adicional a los logs
    .CreateLogger();

    Log.Information("clinichm-api : Inicio correctamente");
try
{
    //Zona Horaria
    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Argentina/Buenos_Aires");
    TimeZoneInfo.ClearCachedData();  // Asegura que se use la nueva configuración
    TimeZoneInfo localTimeZone = argentinaTimeZone;
    Log.Information("Zona horaria configurada correctamente {TimeZone}", localTimeZone);
    // Add services to the container.

    // Limpiar los proveedores de configuración predeterminados
    builder.Configuration.Sources.Clear();

    // Agregar configuración desde la carpeta "conf"
    builder.Configuration
        .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "conf"))
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables();

    // Configurar HealthChecks
    builder.Services.AddHealthChecks()
        .AddCheck("Service", () => 
            HealthCheckResult.Healthy())
        .AddMySql(builder.Configuration.GetConnectionString("DefaultConnection")!,
            name: "MySQL",
            failureStatus: HealthStatus.Unhealthy,
            timeout: TimeSpan.FromSeconds(5));
    
    // Obtener la clave secreta desde appsettings.json
    var secretKey = builder.Configuration["Jwt:SecretKey"];
    var key = Encoding.UTF8.GetBytes(secretKey ?? throw new InvalidOperationException("SecretKey no encontrada en la configuración"));

    // Configurar autenticación JWT sin validar Issuer y Audience
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,  
            ValidateAudience = true,
            ValidIssuer = "clinichm_api",
            ValidAudience = "clinichm_api",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

    // Lee los orígenes desde appsettings.json
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
                        policy =>
                        {
                            if (allowedOrigins != null && allowedOrigins.Length > 0)
                            {
                                policy.WithOrigins(allowedOrigins)
                                        .AllowAnyMethod()
                                        .AllowAnyHeader();
                            }
                        });
    });
    
    builder.Services.AddAuthorization();

    builder.Services.AddControllers(options =>
    {
        // Configuracion global para filtros de excepciones
        options.Filters.Add(new NotFoundResultFilter());
        options.Filters.Add(new BadRequestResultFilter());
        options.Filters.Add<ApiKeyFilter>(); // API Key por defecto

    })
    .AddJsonOptions(options =>
    {
        // Configurar JSON para usar el convertidor de decimal de manera Global
        options.JsonSerializerOptions.Converters.Add(new DecimalJsonConverter());
    });

    // Configurar el DbContext con MySQL
    builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

    // Mover la configuración de los servicios a una clase de extensión
    // Registra IHttpClientFactory
    builder.Services.AddHttpClient();
    // Registro de repository
    builder.Services.AddApplicationRepository();
    // Registro de Services
    builder.Services.AddServicesFromAssembly(Assembly.GetExecutingAssembly());

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Mi API", Version = "v1" });

    // Agrega definición de seguridad para API Key
    c.AddSecurityDefinition("ApiKey", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "API Key debe ir en el header: X-API-KEY",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Name = "X-API-KEY",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Scheme = "ApiKeyScheme"
    });

    // Requiere el esquema de seguridad en todas las operaciones
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                }
            },
            Array.Empty<string>()
        }
    });
});

    builder.Services.Configure<EncryptionSettings>(builder.Configuration.GetSection("Encryption"));

    var app = builder.Build();

    // Middleware de Excepciones 500
    app.UseMiddleware<ExceptionMiddleware>();

    using (var scope = app.Services.CreateScope())
{
    var settings = scope.ServiceProvider.GetRequiredService<IOptions<EncryptionSettings>>();
    EncryptionHelper.Initialize(settings);
}

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors(MyAllowSpecificOrigins);

    app.UseHttpsRedirection();

    app.UseAuthentication();
    
    //Middleware de Autenticación por Roles
    app.UseMiddleware<AuthenticationMiddleware>();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();

}
catch (Exception ex)
{
    Log.Fatal(ex, "La aplicación falló al iniciarse.");
}
finally
{
    Log.CloseAndFlush(); // Asegúrate de cerrar y vaciar los logs
}

public partial class Program {}

