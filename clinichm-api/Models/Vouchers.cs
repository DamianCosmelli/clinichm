namespace clinichm_api.Models
{
    public class Vouchers
    {
        public int Id { get; set; }
        public decimal Voucher { get; set; }
        public decimal Total { get; set; }
        
        public int MovId { get; set; }
        public int? IdCierreCaja { get; set; } 
    }
}