namespace clinichm_api.DTOs;

public class UsuarioDTO
{
    public string? UserName {get; set;}

    public string? Nombre {get; set;}

    public string? Apellido {get; set;}

    public string? Password {get; set;}

    public int RolId {get; set;}

    public string? Celular {get; set;}

    public int SucursalID {get; set;}
}

public class UsuarioFullDTO
{
    public int Id {get; set;}
    public string? UserName {get; set;}

    public string? Nombre {get; set;}

    public string? Apellido {get; set;}

    public string? Password {get; set;}

    public int RolId {get; set;}

    public string? Celular {get; set;}

    public int SucursalID {get; set;}
}
public class UsuarioResponseDTO
{
    public int Id {get; set;}
    public string? UserName {get; set;}

    public string? Nombre {get; set;}

    public string? Apellido {get; set;}

    public int RolId {get; set;}

    public string? Celular {get; set;}

    public int? SucursalID {get; set;}
}

public class UsuarioPassResponseDTO 
{
    public string? UserName {get; set;}
    public string? Password {get; set;}
}

public class UsuarioPassRequestDTO 
{
    public int? Id {get; set;}
    public string? UserName {get; set;}
}

public class UsuarioAuthDTO
{
    public string? UserName { get; set; }
    public string? Password { get; set; }
}

public class UsuarioCambioPassDTO 
{
    public string? UserName {get; set;}
    
    public string? OldPassword {get; set;}
    public string? NewPassword { get; set; }
}

public class UsuarioToken
{
    public string Token { get; set; } = string.Empty;
}