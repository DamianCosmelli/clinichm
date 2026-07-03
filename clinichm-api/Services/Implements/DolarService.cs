using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using System.Net.Http;
using System.Text.Json;

namespace clinichm_api.Services.Implements
{
    public class DolarService : IDolarService
    {
        private readonly HttpClient _httpClient;
        private readonly string _dolarApiUrl;

        public DolarService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _dolarApiUrl = configuration["DolarApi:BaseUrl"] ?? throw new InvalidOperationException("DolarApi URL no está configurada.");
        }

        public async Task<DolarDTO> GetDolarAsync()
        {
            try
            {
                
                var options = new JsonSerializerOptions
                {
                    // Ignora mayúsculas y minúsculas en los nombres de propiedadesa serializar
                    PropertyNameCaseInsensitive = true 
                };

                var response = await _httpClient.GetAsync(_dolarApiUrl);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var dolarData = JsonSerializer.Deserialize<Dolar>(content, options);

                if (dolarData == null)
                {
                    throw new Exception("Error al obtener datos del Dolar");
                }

                return new DolarDTO
                {
                    FechaActualizacion = dolarData.FechaActualizacion,
                    Compra = dolarData.Compra
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas las cotizacion dolar", ex);
            }
        }
    }
}
