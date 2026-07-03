using Microsoft.AspNetCore.Mvc;
using clinichm_api.Models;
using clinichm_api.Data;
using Microsoft.EntityFrameworkCore; // Agregar esta línea
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using clinichm_api.DTOs;
using clinichm_api.Services;

namespace clinichm_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly IAuthService _authService;
        private readonly IRolService _rolService;
        private readonly IUsuarioAuditService _usuarioAuditService;

        private readonly ISucursalService _sucursalService;

        public UsuarioController(IUsuarioService usuarioService, IAuthService authService,
        IRolService rolService, ISucursalService sucursalService, IUsuarioAuditService usuarioAuditService)
        {
            _usuarioService = usuarioService;
            _authService = authService;
            _rolService = rolService;
            _sucursalService = sucursalService;
            _usuarioAuditService = usuarioAuditService;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioResponseDTO>>> GetAll() => Ok(await _usuarioService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetById(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            return usuario == null ? NotFound() : Ok(usuario);
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioResponseDTO>> Create(UsuarioDTO UsuarioDTO)
        {
            var newUsuario = await _usuarioService.AddAsync(UsuarioDTO);
            return CreatedAtAction(nameof(GetAll), new { id = newUsuario!.Id }, newUsuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UsuarioResponseDTO>> Update(int id, UsuarioDTO UsuarioDTO)
        {
            var updateUsuario = await _usuarioService.UpdateAsync(id, UsuarioDTO);
            return updateUsuario == null ? NotFound() : Ok(updateUsuario);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) =>
            await _usuarioService.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpGet("consultarpass")]
        public async Task<IActionResult> GetUsuarioPass([FromQuery] int? id, [FromQuery] string? username)
        {
            if (id == null && string.IsNullOrEmpty(username))
            {
                return BadRequest("Debe proporcionar al menos un parámetro: id o username.");
            }

            var usuarioDTO = new UsuarioPassRequestDTO { Id = id, UserName = username };
            var usuarioResponse = await _usuarioService.GetByIdOrUsernameAsync(usuarioDTO);

            if (usuarioResponse == null)
            {
                return NotFound();
            }

            return Ok(usuarioResponse);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioAuthDTO request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Password))
            {
                //return BadRequest("Debe proporcionar un nombre de usuario y contraseña.");
                throw new BadHttpRequestException("Debe proporcionar un nombre de usuario y contraseña.");
            }
            var usuario = await _usuarioService.GetByUserNameAsync(request);
            if (usuario == null) // || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.Password))
            {
                throw new UnauthorizedAccessException("Usuario o contraseña incorrectos");
            }

            // Compara con la contraseña enviada
            if (request.Password != usuario.Password)
            {
                throw new UnauthorizedAccessException("Usuario o contraseña incorrectos");
            }

            // Obtener rol
            var rolDTO = await _rolService.GetByIdAsync(usuario.RolId);
            var rol = rolDTO?.Nombre ?? "Guest";

            //extrae Sucursal
            var sucursalDTO = await _sucursalService.GetByIdAsync(usuario.SucursalID);
            var sucursal = sucursalDTO!.Nombre;

            var token = _authService.AuthToken(usuario, rol, sucursal);
            if (token != null)
            {
                //registra auditoria de Login.
                await _usuarioAuditService.AddAsync(new UsuarioAuditReqDTO { UsuarioId = usuario.Id }, HttpContext);
            }

            return Ok(new { Token = token });

        }
        [HttpGet("logout/{usuarioId}")]
        public async Task<ActionResult<UsuarioDTO>> Logout(int usuarioId)
        {
            var usuarioAudit = new UsuarioAuditReqDTO { UsuarioId = usuarioId };
            var usuario = await _usuarioAuditService.UpdateAsync(usuarioAudit);
            return usuario == null ? NotFound() : Ok();
        }
        [HttpPost("cambiarpass")]
        public async Task<IActionResult> ChangePassword([FromBody] UsuarioCambioPassDTO request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                throw new BadHttpRequestException("Debe proporcionar un nombre de usuario, contraseña antigua y nueva.");
            }

            var usuario = await _usuarioService.ChangePassAsync(request);
            if (usuario == null)
            {
                throw new UnauthorizedAccessException("Usuario o contraseña incorrectos");
            }

            return Ok(usuario);
        }
    }
}
