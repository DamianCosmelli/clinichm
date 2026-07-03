using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace clinichm_api.Tests;

public class HealthCheckControllerTests
{
    [Fact]
    public async Task CheckHealth_ReturnsHealthy_WhenAllChecksPass()
    {
        // Arrange
        var entries = new Dictionary<string, HealthReportEntry>
        {
            { "Service", new HealthReportEntry(HealthStatus.Healthy, null, TimeSpan.Zero, null, null) },
            { "MySQL", new HealthReportEntry(HealthStatus.Healthy, null, TimeSpan.FromMilliseconds(50), null, null) }
        };

        var report = new HealthReport(entries, TimeSpan.FromMilliseconds(50));
        #pragma warning disable CS0436 // Deshabilita mensajes de Warning
        var fakeHealthCheckService = new FakeHealthCheckService(report);
        #pragma warning restore CS0436 // Habilita mensajes de Warning
        var controller = new HealthCheckController(fakeHealthCheckService);

        // Act
        var result = await controller.CheckHealth() as ObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
    }

    [Fact]
    public async Task CheckHealth_ReturnsUnhealthy_WhenAServiceFails()
    {
        // Arrange
        var exception = new Exception("Database connection failed");
        var entries = new Dictionary<string, HealthReportEntry>
        {
            { "Service", new HealthReportEntry(HealthStatus.Healthy, null, TimeSpan.Zero, null, null) },
            { "MySQL", new HealthReportEntry(HealthStatus.Unhealthy, null, TimeSpan.FromMilliseconds(50), exception, null) }
        };

        var report = new HealthReport(entries, TimeSpan.FromMilliseconds(50));
        #pragma warning disable CS0436 // Deshabilita mensajes de Warning
        var fakeHealthCheckService = new FakeHealthCheckService(report);
        #pragma warning restore CS0436 // Habilita mensajes de Warning
        var controller = new HealthCheckController(fakeHealthCheckService);

        // Act
        var result = await controller.CheckHealth() as ObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(503, result.StatusCode);
        var jsonResponse = result.Value?.ToString();
        Assert.Contains("Database connection failed", jsonResponse);
    }
}

// Implementación de un servicio de HealthCheck falso SIN MOQ
public class FakeHealthCheckService : HealthCheckService
{
    private readonly HealthReport _healthReport;

    public FakeHealthCheckService(HealthReport healthReport)
    {
        _healthReport = healthReport;
    }

    public override Task<HealthReport> CheckHealthAsync(Func<HealthCheckRegistration, bool>? predicate = null, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_healthReport);
    }
}
