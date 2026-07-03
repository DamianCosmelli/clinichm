using Microsoft.Extensions.DependencyInjection;
using clinichm_api.Repositories;
using clinichm_api.Services;
using clinichm_api.Services.Implements;
using System;
using System.Reflection;

namespace clinichm_api.Extensions
{
    public static class ServiceCollectionExtensions
    {  
    public static IServiceCollection AddServicesFromAssembly(this IServiceCollection services, Assembly assembly)
    {
        var types = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && (t.Name.EndsWith("Service") || t.Name.EndsWith("Services")))
            .ToList();

            foreach (var type in types)
            {
                var interfaces = type.GetInterfaces();
                if (interfaces.Any())
                {
                    foreach (var @interface in interfaces)
                    {
                        services.AddScoped(@interface, type);
                    }
                }
            }

        return services;
    }
    public static IServiceCollection AddApplicationRepository(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<ITurnoRepository, TurnoRepository>();
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<ICierreCajaRepository, CierreCajaRepository>();
            services.AddScoped<IUsuarioAuditRepository, UsuarioAuditRepository>();
            services.AddScoped<IAgendaMedicaRepository, AgendaMedicaRepository>();
            services.AddScoped<IStockRepository, StockRepository>();
            services.AddScoped<IMovimientoCajaRepository, MovimientoCajaRepository>();
            return services;
        }
    }
}
