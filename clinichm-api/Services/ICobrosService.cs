using clinichm_api.DTOs;

namespace clinichm_api.Services
{
    public interface ICobrosService
    {
        Task<CobrosRespDto> ProcesarCobro(CobrosDTO cobro);
    }
}