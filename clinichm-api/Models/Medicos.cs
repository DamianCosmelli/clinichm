namespace clinichm_api.Models
{
    public class Medicos
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Matricula { get; set; } = null!;
        public int SucursalId { get; set; }

        public int RoleId { get; set; }
    }
}