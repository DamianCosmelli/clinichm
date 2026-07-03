using System.ComponentModel.DataAnnotations.Schema;
namespace clinichm_api.Models;

public class Usuario
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