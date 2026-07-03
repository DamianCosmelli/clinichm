namespace clinichm_api.DTOs
{
    public class ProductoDTO
    {
        public int Id { get; set; }
        public int CategoriaProdId { get; set; }
        public string Nombre { get; set; } = null!;
        public Boolean NoAutoDescontable { get; set; }

    }
    public class ProductoReqDTO
    {
        public int CategoriaProdId { get; set; }
        public string Nombre { get; set; } = null!;
        public Boolean NoAutoDescontable { get; set; }
    }
}