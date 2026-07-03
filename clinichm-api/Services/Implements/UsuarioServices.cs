using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace clinichm_api.Services
{
    public class UsuarioServices : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;


        public UsuarioServices(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        public async Task<UsuarioResponseDTO?> AddAsync(UsuarioDTO usuarioDTO)
        {
            try
            {
                var usuario = new Usuario
                {
                    UserName = usuarioDTO.UserName,
                    Nombre = usuarioDTO.Nombre,
                    Apellido = usuarioDTO.Apellido,
                    Password = EncryptionHelper.Encrypt(usuarioDTO.Password!), // Encriptar la contraseña
                    RolId = usuarioDTO.RolId,
                    Celular = usuarioDTO.Celular,
                    SucursalID = usuarioDTO.SucursalID
                };
                await _repository.AddAsync(usuario);

                return new UsuarioResponseDTO
                {
                    Id = usuario.Id,
                    UserName = usuario.UserName,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    RolId = usuario.RolId,
                    Celular = usuario.Celular,
                    SucursalID = usuario.SucursalID
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al agregar un usario", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var Usuario = await _repository.GetByIdAsync(id);
                if (Usuario == null) return false;
                await _repository.DeleteAsync(id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al eliminar el usuario con ID {id}", ex);
            }
        }

        public async Task<IEnumerable<UsuarioResponseDTO>> GetAllAsync()
        {
            try
            {
                return (await _repository.GetAllAsync()).Select(m => new UsuarioResponseDTO
                {
                    Id = m.Id,
                    UserName = m.UserName,
                    Nombre = m.Nombre,
                    Apellido = m.Apellido,
                    RolId = m.RolId,
                    Celular = m.Celular,
                    SucursalID = m.SucursalID

                }).ToList();
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception("Error al obtener todos los usuarios", ex);
            }
        }

        public async Task<UsuarioResponseDTO?> GetByIdAsync(int id)
        {
            try
            {
                var usuario = await _repository.GetByIdAsync(id);
                return usuario == null ? null : new UsuarioResponseDTO
                {
                    Id = usuario.Id,
                    UserName = usuario.UserName,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    RolId = usuario.RolId,
                    Celular = usuario.Celular,
                    SucursalID = usuario.SucursalID
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al obtener el usuario con ID {id}", ex);
            }
        }
        // Consulta el password de un usuario consultado por id o username
        public async Task<UsuarioPassResponseDTO?> GetByIdOrUsernameAsync(UsuarioPassRequestDTO usuarioDTO)
        {
            try
            {
                var usuario = await _repository.GetByIdOrUsernameAsync(usuarioDTO);

                if (usuario == null)
                {
                    return null;
                }

                return new UsuarioPassResponseDTO
                {
                    UserName = usuario.UserName,
                    Password = EncryptionHelper.Decrypt(usuario.Password!), // Desencriptar la contraseña
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener el usuario.", ex);
            }
        }

        public async Task<UsuarioResponseDTO> UpdateAsync(int id, UsuarioDTO usuarioDTO)
        {
            try
            {
                var usuario = await _repository.GetByIdAsync(id);
                if (usuario == null) return null!;
                usuario.UserName = usuarioDTO.UserName;
                usuario.Nombre = usuarioDTO.Nombre;
                usuario.Apellido = usuarioDTO.Apellido;
                // Si la contraseña ha sido modificada, encriptarla antes de actualizar
                if (!string.IsNullOrEmpty(usuarioDTO.Password))
                {
                    usuario.Password = EncryptionHelper.Encrypt(usuarioDTO.Password!); // Encriptar la contraseña
                }
                usuario.RolId = usuarioDTO.RolId;
                usuario.Celular = usuarioDTO.Celular;
                usuario.SucursalID = usuarioDTO.SucursalID;
                await _repository.UpdateAsync(usuario);
                return new UsuarioResponseDTO
                {
                    Id = usuario.Id,
                    UserName = usuario.UserName,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    RolId = usuario.RolId,
                    Celular = usuario.Celular,
                    SucursalID = usuario.SucursalID
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                // Manejo de la excepción
                throw new Exception($"Error al actualizar el usuario con ID {id}", ex);
            }
        }
        public async Task<UsuarioFullDTO?> GetByUserNameAsync(UsuarioAuthDTO usuarioDTO)
        {
            try
            {
                var usuario = await _repository.GetByUserNameAsync(usuarioDTO);
                if (usuario == null)
                {
                    return null;
                }

                return new UsuarioFullDTO
                {
                    Id = usuario.Id,
                    UserName = usuario.UserName,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    RolId = usuario.RolId,
                    Password = EncryptionHelper.Decrypt(usuario.Password!),
                    Celular = usuario.Celular,
                    SucursalID = usuario.SucursalID
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el usuario {usuarioDTO.UserName}", ex);
            }
        }
        public async Task<UsuarioAuthDTO?> ChangePassAsync(UsuarioCambioPassDTO usuarioRequest)
        {
            try
            {
                var usuarioAuth = new UsuarioAuthDTO
                {
                    UserName = usuarioRequest.UserName,
                    Password = usuarioRequest.OldPassword
                };
                var usuario = await _repository.GetByUserNameAsync(usuarioAuth);
                if (usuario == null)
                {
                    return null; // Usuario no encontrado
                }

                if (usuario.Password != EncryptionHelper.Encrypt(usuarioRequest.OldPassword!))
                {
                    throw new Exception("La contraseña actual no coincide.");
                }

                // Actualizar la contraseña en el objeto usuario
                usuario.Password = EncryptionHelper.Encrypt(usuarioRequest.NewPassword!); // Encriptar la nueva contraseña
                await _repository.UpdateAsync(usuario);

                return new UsuarioAuthDTO
                {
                    UserName = usuario.UserName,
                    Password = EncryptionHelper.Decrypt(usuario.Password!) // Devolver la contraseña desencriptada
                };
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error en la base de datos", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al cambiar la contraseña del usuario {usuarioRequest.UserName}", ex);
            }
        }
    }
    

}