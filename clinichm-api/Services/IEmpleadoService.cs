using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Services
{
    public interface IEmpleadoService
    {
        Task<IEnumerable<EmpleadoResponseDTO>> GetAllAsync();
        Task<EmpleadoResponseDTO?> GetByIdAsync(int id);
        Task<EmpleadoResponseDTO> AddAsync(EmpleadoDTO empleadoDTO);
        Task<EmpleadoResponseDTO> UpdateAsync(int id, EmpleadoDTO empleadoDTO);
        Task<bool> DeleteAsync(int id);
    }
}
