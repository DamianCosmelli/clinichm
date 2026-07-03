using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface IDolarService
    {
        Task<DolarDTO> GetDolarAsync();
    }
}
