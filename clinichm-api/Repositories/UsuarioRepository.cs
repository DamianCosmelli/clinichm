using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using clinichm_api.Repositories;

public class UsuarioRepository : Repository<Usuario>, IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByIdOrUsernameAsync(UsuarioPassRequestDTO usuarioDTO)
    {
        try
        {
            if (usuarioDTO.Id.HasValue)
            {
                return await _context.Set<Usuario>().FirstOrDefaultAsync(u => u.Id == usuarioDTO.Id.Value);
            }

            if (!string.IsNullOrEmpty(usuarioDTO.UserName))
            {
                return await _context.Set<Usuario>().FirstOrDefaultAsync(u => u.UserName == usuarioDTO.UserName);
            }

            return null;
        }
        catch (Exception ex)
        {
            throw new Exception("Error al obtener el usuario", ex);
        }
    }

        public async Task<Usuario?> GetByUserNameAsync(UsuarioAuthDTO usuarioDTO)
    {
        try
        {

            return await _context.Set<Usuario>().FirstOrDefaultAsync(u => u.UserName == usuarioDTO.UserName);


        }
        catch (Exception ex)
        {
            throw new Exception("Error al obtener el usuario", ex);
        }
    }
}
