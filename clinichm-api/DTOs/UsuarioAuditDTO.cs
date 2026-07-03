namespace clinichm_api.DTOs
{

    public class UsuarioAuditDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime? LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public string? Ip { get; set; }
        public string? Navegador { get; set; }
    }

    public class UsuarioAuditReqDTO
    {
        public int UsuarioId { get; set; }
    }

    public class UsuarioAuditRespDTO
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateTime? LoginTime { get; set; }
    public DateTime? LogoutTime { get; set; }
    public string? Ip { get; set; }
    public string? Navegador { get; set; }

    public string Sesion 
    { 
        get
        {
            if (LogoutTime == null && LoginTime.HasValue && LoginTime.Value >= DateTime.Now.AddHours(-1))
            {
                return "Activa";
            }
            return "Finalizada";
        }
    }
}
}