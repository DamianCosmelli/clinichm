using clinichm_api.DTOs;
using clinichm_api.Services.Implements;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace clinichm_api.Tests
{
    public class DolarServiceTests
    {

        private readonly DolarService _dolarService;
    
        private HttpClient CreateHttpClient()
        {
            var handler = new HttpClientHandlerStub();
            return new HttpClient(handler);
        }

        public DolarServiceTests()
        {
            var inMemorySettings = new Dictionary<string, string>
        {
            { "DolarApi:BaseUrl", "https://api.dolar.com/valor/blue" },
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

            _dolarService = new DolarService(CreateHttpClient(), configuration);
        }

        [Fact]
        public async Task GetDolarAsync_ReturnsDolarDTO()
        {
            // Act
            var result = await _dolarService.GetDolarAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Compra > 0);
            Assert.True(result.FechaActualizacion != default);
        }

        private class HttpClientHandlerStub : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("{\"FechaActualizacion\":\"2023-10-01T00:00:00Z\",\"Compra\":150.75}")
                };
                return Task.FromResult(response);
            }
        }


    [Fact]
    public async Task verifyconnection()
    {
        using (var client = new HttpClient())
        {
            var response = await client.GetAsync("https://dolarapi.com/v1/dolares/blue");
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();

            Assert.NotNull(responseBody);
        }
    }
    }
}
