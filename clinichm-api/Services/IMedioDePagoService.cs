using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;

namespace clinichm_api.Services
{
    public interface IMedioDePagoService
    {
        Task<IEnumerable<MedioDePagoResponseDTO>> GetAllAsync();
        Task<MedioDePagoResponseDTO?> GetByIdAsync(int id);
        Task <MedioDePagoResponseDTO> AddAsync(MedioDePagoDTO dto);
        Task<MedioDePagoResponseDTO> UpdateAsync(int id, MedioDePagoDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
