using System.ComponentModel.DataAnnotations;

namespace clinichm_api.Models
{
    public class CierreCaja
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "La fecha y hora son obligatorias.")]
        public DateTime FechaHora { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto en efectivo no puede ser negativo.")]
        public decimal MontoEfectivo { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto con tarjeta de crédito no puede ser negativo.")]
        public decimal MontoTarjetaCredito { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto con tarjeta de débito no puede ser negativo.")]
        public decimal MontoDebito { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto por transferencia no puede ser negativo.")]
        public decimal MontoTransferencia { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto en dólares no puede ser negativo.")]
        public decimal MontoDolar { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El total en efectivo no puede ser negativo.")]
        public decimal TotalEfectivo { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El total en cuenta Clinichm no puede ser negativo.")]
        public decimal TotalCuentaClinichm { get; set; }

        [Required(ErrorMessage = "El ID de la sucursal es obligatorio.")]
        public int IdSucursal { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El total en Retiro no puede ser negativo.")]
        public decimal TotalRetiro { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El total en Voucher no puede ser negativo.")]
        public decimal TotalVoucher { get; set; }
        public int CantVoucher { get; set; }
        public decimal TotalVuelto { get; set; }
        public decimal TotalSinCargo { get; set; }

    }
}
