using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using clinichm_api.Repositories;

public class UsuarioAuditRepository : Repository<UsuarioAudit>, IUsuarioAuditRepository
{
    private readonly AppDbContext _context;

    public UsuarioAuditRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
    /*
    * Toma el ultimo registro de login del usuario indicado
    */
    public async Task<UsuarioAudit?> GetByUserIdAsync(UsuarioAuditReqDTO auditoriaDTO)
    {
        try
        {

            return await _context.UsuarioAudit
            .Where(u => u.UsuarioId == auditoriaDTO.UsuarioId)
            .OrderByDescending(u => u.LoginTime) // Ordena por fecha de más reciente a más antigua
            .FirstOrDefaultAsync(); // Toma el primer registro después del ordenamiento
            //.LastOrDefaultAsync();

        }
        catch (Exception ex)
        {
            throw new Exception("Error al obtener el usuario", ex);
        }
    }

    public async Task<List<UsuarioAudit>> GetSessionByUserIdAsync(int usuarioId)
    {
        try
        {

            return await _context.UsuarioAudit
            .Where(u => u.UsuarioId == usuarioId)
            .OrderByDescending(u => u.Id)
            .Take(5)
            .ToListAsync();

        }
        catch (Exception ex)
        {
            throw new Exception("Error al obtener la auditoria del usurio", ex);
        }
    }
}